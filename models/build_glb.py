#!/usr/bin/env python3
"""
Sora Casas .glb generator (stdlib only, no deps).
Hand-authors valid glTF 2.0 binary (.glb) parametric house models with NAMED
PBR materials and NAMED toggle-nodes, structured for runtime material-swaps +
part toggles in three.js. Stylized starter geometry; an artist can later replace
the meshes while keeping the same node/material names so the configurator code
keeps working. Run: python3 build_glb.py
"""
import struct, json, math, os

# ---- researched PBR material library (baseColor sRGB 0..1, metallic, roughness) ----
# Sources: typical PBR values for architectural surfaces (stucco/concrete are
# dielectric rough; metal roof semi-metallic mid-rough; glass low-rough w/ alpha).
MATS = {
  "MAT_WALL":   {"c":[0.90,0.86,0.76,1], "m":0.0, "r":0.92},  # warm stucco
  "MAT_WALL2":  {"c":[0.82,0.78,0.70,1], "m":0.0, "r":0.90},  # secondary mass
  "MAT_ROOF":   {"c":[0.13,0.12,0.11,1], "m":0.55,"r":0.45},  # dark standing-seam metal
  "MAT_ROOF_CLAY":{"c":[0.55,0.27,0.18,1],"m":0.0,"r":0.75},  # terracotta (beach)
  "MAT_GLASS":  {"c":[0.55,0.74,0.82,0.32],"m":0.0,"r":0.06,"blend":True},
  "MAT_FRAME":  {"c":[0.16,0.15,0.14,1], "m":0.2, "r":0.5},   # window frames
  "MAT_DOOR":   {"c":[0.36,0.24,0.14,1], "m":0.0, "r":0.55},  # wood door
  "MAT_FLOOR":  {"c":[0.62,0.60,0.57,1], "m":0.0, "r":0.40},  # polished concrete
  "MAT_DECK":   {"c":[0.50,0.36,0.22,1], "m":0.0, "r":0.6},   # wood deck
  "MAT_POOL":   {"c":[0.16,0.55,0.66,0.85],"m":0.0,"r":0.12,"blend":True},
  "MAT_SOLAR":  {"c":[0.08,0.10,0.16,1], "m":0.4, "r":0.35},  # PV panels
  "MAT_TRIM":   {"c":[0.93,0.91,0.85,1], "m":0.0, "r":0.7},   # trim/soffit
  "MAT_GROUND": {"c":[0.78,0.74,0.60,1], "m":0.0, "r":1.0},   # site pad
}
MAT_INDEX = {name:i for i,name in enumerate(MATS)}

def box(cx,cy,cz,sx,sy,sz):
    hx,hy,hz=sx/2,sy/2,sz/2
    # 6 faces, 4 verts each, flat normals
    faces=[
        ([(-hx,-hy, hz),( hx,-hy, hz),( hx, hy, hz),(-hx, hy, hz)],(0,0,1)),   # +Z
        ([( hx,-hy,-hz),(-hx,-hy,-hz),(-hx, hy,-hz),( hx, hy,-hz)],(0,0,-1)),  # -Z
        ([( hx,-hy, hz),( hx,-hy,-hz),( hx, hy,-hz),( hx, hy, hz)],(1,0,0)),   # +X
        ([(-hx,-hy,-hz),(-hx,-hy, hz),(-hx, hy, hz),(-hx, hy,-hz)],(-1,0,0)),  # -X
        ([(-hx, hy, hz),( hx, hy, hz),( hx, hy,-hz),(-hx, hy,-hz)],(0,1,0)),   # +Y
        ([(-hx,-hy,-hz),( hx,-hy,-hz),( hx,-hy, hz),(-hx,-hy, hz)],(0,-1,0)),  # -Y
    ]
    pos=[]; nrm=[]; idx=[]
    for verts,n in faces:
        b=len(pos)//3
        for (x,y,z) in verts:
            pos+=[x+cx,y+cy,z+cz]; nrm+=list(n)
        idx+=[b,b+1,b+2, b,b+2,b+3]
    return pos,nrm,idx

class GLB:
    def __init__(self): self.bin=bytearray(); self.bv=[]; self.acc=[]; self.meshes=[]; self.nodes=[]
    def _pad(self):
        while len(self.bin)%4: self.bin.append(0)
    def add_mesh(self, name, parts):
        # parts: list of (positions, normals, indices, material_name)
        prims=[]
        for pos,nrm,idx,mat in parts:
            # indices (uint16)
            self._pad(); off=len(self.bin)
            for v in idx: self.bin+=struct.pack('<H',v)
            self.bv.append({"buffer":0,"byteOffset":off,"byteLength":len(idx)*2,"target":34963})
            ia=len(self.acc); self.acc.append({"bufferView":len(self.bv)-1,"componentType":5123,"count":len(idx),"type":"SCALAR","max":[max(idx)],"min":[min(idx)]})
            # positions (float32)
            self._pad(); off=len(self.bin)
            for f in pos: self.bin+=struct.pack('<f',f)
            xs=pos[0::3]; ys=pos[1::3]; zs=pos[2::3]
            self.bv.append({"buffer":0,"byteOffset":off,"byteLength":len(pos)*4,"target":34962})
            pa=len(self.acc); self.acc.append({"bufferView":len(self.bv)-1,"componentType":5126,"count":len(pos)//3,"type":"VEC3","min":[min(xs),min(ys),min(zs)],"max":[max(xs),max(ys),max(zs)]})
            # normals
            self._pad(); off=len(self.bin)
            for f in nrm: self.bin+=struct.pack('<f',f)
            self.bv.append({"buffer":0,"byteOffset":off,"byteLength":len(nrm)*4,"target":34962})
            na=len(self.acc); self.acc.append({"bufferView":len(self.bv)-1,"componentType":5126,"count":len(nrm)//3,"type":"VEC3"})
            prims.append({"attributes":{"POSITION":pa,"NORMAL":na},"indices":ia,"material":MAT_INDEX[mat]})
        self.meshes.append({"name":name,"primitives":prims})
        return len(self.meshes)-1
    def add_node(self,name,mesh): self.nodes.append({"name":name,"mesh":mesh}); return len(self.nodes)-1
    def write(self,path):
        mats=[]
        for name,m in MATS.items():
            mat={"name":name,"pbrMetallicRoughness":{"baseColorFactor":m["c"],"metallicFactor":m["m"],"roughnessFactor":m["r"]},"doubleSided":True}
            if m.get("blend"): mat["alphaMode"]="BLEND"
            mats.append(mat)
        gltf={"asset":{"version":"2.0","generator":"Sora Casas glb generator"},
              "scene":0,"scenes":[{"nodes":list(range(len(self.nodes)))}],
              "nodes":self.nodes,"meshes":self.meshes,"materials":mats,
              "accessors":self.acc,"bufferViews":self.bv,"buffers":[{"byteLength":len(self.bin)}]}
        js=json.dumps(gltf,separators=(',',':')).encode()
        while len(js)%4: js+=b' '
        b=bytes(self.bin)
        while len(b)%4: b+=b'\x00'
        total=12+8+len(js)+8+len(b)
        out=struct.pack('<III',0x46546C67,2,total)
        out+=struct.pack('<II',len(js),0x4E4F534A)+js
        out+=struct.pack('<II',len(b),0x004E4942)+b
        open(path,'wb').write(out)
        return total

def house(g, roof="metal", wall="MAT_WALL", wide=10.0, deep=7.0, wallh=3.0, pool=True, solar=True, palm=False):
    # ground pad
    g.add_node("Ground", g.add_mesh("Ground",[ (*box(0,-0.05,0, wide+8, 0.1, deep+8),"MAT_GROUND") ]))
    # main mass
    g.add_node("Walls", g.add_mesh("Walls",[ (*box(0,wallh/2,0, wide, wallh, deep), wall) ]))
    # secondary wing
    g.add_node("Wing", g.add_mesh("Wing",[ (*box(wide/2+1.6,1.4,deep/2-1.2, 3.4,2.8,3.0),"MAT_WALL2") ]))
    # roof
    rmat = "MAT_ROOF" if roof=="metal" else "MAT_ROOF_CLAY"
    if roof=="metal":  # flat low roof
        g.add_node("Roof", g.add_mesh("Roof",[ (*box(0,wallh+0.2,0, wide+0.8,0.4,deep+0.8), rmat) ]))
    else:              # simple pitched (two slabs)
        g.add_node("Roof", g.add_mesh("Roof",[
            (*box(0,wallh+0.6,-deep/4, wide+0.8,0.3,deep/2+0.6), rmat),
            (*box(0,wallh+0.9, deep/4, wide+0.8,0.3,deep/2+0.6), rmat) ]))
    # door (front +Z face)
    g.add_node("Door", g.add_mesh("Door",[ (*box(-1.2,1.05,deep/2+0.06, 1.0,2.1,0.12),"MAT_DOOR") ]))
    # windows (glass) + frames on front
    win=[]; frm=[]
    for x in (1.0, 3.2):
        win.append((*box(x,1.6,deep/2+0.05, 1.4,1.3,0.06),"MAT_GLASS"))
        frm.append((*box(x,1.6,deep/2+0.04, 1.55,1.45,0.05),"MAT_FRAME"))
    # big living glass
    win.append((*box(-3.2,1.6,deep/2+0.05, 2.0,1.7,0.06),"MAT_GLASS"))
    frm.append((*box(-3.2,1.6,deep/2+0.04, 2.15,1.85,0.05),"MAT_FRAME"))
    g.add_node("Frames", g.add_mesh("Frames",frm))
    g.add_node("Windows", g.add_mesh("Windows",win))
    # interior floor (visible through glass / for walkthrough)
    g.add_node("Floor", g.add_mesh("Floor",[ (*box(0,0.05,0, wide-0.4,0.1,deep-0.4),"MAT_FLOOR") ]))
    # ---- toggle nodes ----
    if pool:
        g.add_node("Deck", g.add_mesh("Deck",[ (*box(0,0.06,deep/2+3.0, wide,0.12,4.0),"MAT_DECK") ]))
        g.add_node("Pool", g.add_mesh("Pool",[ (*box(0,0.0,deep/2+3.0, wide*0.5,0.4,2.4),"MAT_POOL") ]))
    if solar:
        s=[]
        for i in range(4):
            s.append((*box(-2.4+i*1.5, wallh+0.45, -1.0, 1.3,0.06,2.2),"MAT_SOLAR"))
        g.add_node("Solar", g.add_mesh("Solar",s))

MODELS={
  "bahia":  dict(roof="clay",  wall="MAT_WALL",  wide=11, deep=7.5, pool=True,  solar=True),   # beach
  "montana":dict(roof="metal", wall="MAT_WALL2", wide=10, deep=8,   pool=False, solar=True),   # highland
  "volcan": dict(roof="metal", wall="MAT_WALL",  wide=9,  deep=7,   pool=False, solar=True),   # cooler highland
  "bocas":  dict(roof="clay",  wall="MAT_WALL2", wide=10, deep=7,   pool=True,  solar=True),   # caribbean
}
outdir=os.path.dirname(os.path.abspath(__file__))
report=[]
for key,p in MODELS.items():
    g=GLB(); house(g,**p)
    sz=g.write(os.path.join(outdir,f"{key}.glb"))
    report.append((key,sz,len(g.nodes),len(g.meshes)))
print("model  bytes   nodes meshes")
for k,sz,n,m in report: print(f"{k:8} {sz:6}  {n:4}  {m}")
print("materials:", ", ".join(MATS.keys()))
