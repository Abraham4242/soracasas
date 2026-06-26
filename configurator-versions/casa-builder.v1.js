// ============================================================================
// Sora Casas — shared procedural house builder (DOM-free ES module)
// Extracted verbatim from the disena-3d.html configurator render engine so the
// build page (index.html) shows the EXACT same furnished render. Pure given
// THREE: returns geometry groups; the caller owns the scene/camera/lights.
// Adds roof styles (flat/gable/thatch) for the build page's roof control.
// ============================================================================
import * as THREE from 'three';

// ===== PROCEDURAL TEXTURES =====
function CV(){const c=document.createElement('canvas');c.width=c.height=512;return c;}
function R(a,b){return a+Math.random()*(b-a);}
function tex(draw,srgb=true){const c=CV();draw(c.getContext('2d'),512);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=8;return t;}
function fillNoise(x,s,base,dark,light,density){x.fillStyle=base;x.fillRect(0,0,s,s);for(let i=0;i<density;i++){const px=R(0,s),py=R(0,s),r=R(.5,2.2);x.fillStyle=Math.random()<.5?dark:light;x.globalAlpha=R(.03,.14);x.beginPath();x.arc(px,py,r,0,7);x.fill();}x.globalAlpha=1;}
const B={};
B.wood=tex((x,s)=>{const ph=s/5;for(let r=0;r<5;r++){const y=r*ph,sh=R(-12,12);x.fillStyle=`rgb(${150+sh},${108+sh},${66+sh})`;x.fillRect(0,y,s,ph);for(let g=0;g<26;g++){x.strokeStyle=`rgba(70,45,22,${R(.04,.13)})`;x.lineWidth=R(.5,1.6);x.beginPath();const gy=y+R(0,ph);x.moveTo(0,gy);for(let xx=0;xx<=s;xx+=32)x.lineTo(xx,gy+Math.sin(xx*.05+r)*R(.5,2.5));x.stroke();}x.strokeStyle='rgba(40,25,12,.4)';x.lineWidth=2;x.beginPath();x.moveTo(0,y);x.lineTo(s,y);x.stroke();}});
B.tile=tex((x,s)=>{const n=4,g=s/n;fillNoise(x,s,'#dcd6ca','#c8c2b4','#ece7dc',1400);for(let i=0;i<=n;i++){x.strokeStyle='rgba(120,112,98,.5)';x.lineWidth=4;x.beginPath();x.moveTo(i*g,0);x.lineTo(i*g,s);x.moveTo(0,i*g);x.lineTo(s,i*g);x.stroke();}});
B.marble=tex((x,s)=>{x.fillStyle='#ece9e2';x.fillRect(0,0,s,s);for(let i=0;i<22;i++){x.strokeStyle=`rgba(120,118,112,${R(.05,.22)})`;x.lineWidth=R(.5,2.6);x.beginPath();let px=R(0,s),py=R(0,s);x.moveTo(px,py);for(let k=0;k<8;k++){px+=R(-70,70);py+=R(-70,70);x.lineTo(px,py);}x.stroke();}fillNoise(x,s,'rgba(0,0,0,0)','#d8d4cb','#fbfaf6',600);});
B.granite=tex((x,s)=>{x.fillStyle='#2c2a27';x.fillRect(0,0,s,s);for(let i=0;i<5200;i++){const c=Math.random();x.fillStyle=c<.5?'#46433d':(c<.8?'#615c52':'#8a8378');x.globalAlpha=R(.2,.7);x.beginPath();x.arc(R(0,s),R(0,s),R(.5,2),0,7);x.fill();}x.globalAlpha=1;});
B.concrete=tex((x,s)=>{fillNoise(x,s,'#b6b0a6','#9c968c','#cfc9bd',2600);for(let i=0;i<5;i++){x.strokeStyle='rgba(90,86,78,.18)';x.lineWidth=R(.6,1.6);x.beginPath();x.moveTo(R(0,s),0);x.lineTo(R(0,s),s);x.stroke();}});
B.stone=tex((x,s)=>{x.fillStyle='#6f6960';x.fillRect(0,0,s,s);const rows=6;let y=0;for(let r=0;r<rows;r++){const h=s/rows;let xx=R(-30,0);while(xx<s){const w=R(60,130);const sh=R(-22,22);x.fillStyle=`rgb(${154+sh},${146+sh},${134+sh})`;x.fillRect(xx+2,y+2,w-4,h-4);x.strokeStyle='rgba(60,56,50,.6)';x.lineWidth=2;x.strokeRect(xx+2,y+2,w-4,h-4);xx+=w;}y+=h;}});
B.slats=tex((x,s)=>{const n=12,w=s/n;for(let i=0;i<n;i++){const sh=R(-16,16);x.fillStyle=`rgb(${134+sh},${96+sh},${58+sh})`;x.fillRect(i*w,0,w,s);x.strokeStyle='rgba(50,32,16,.5)';x.lineWidth=2;x.strokeRect(i*w,0,w,s);for(let g=0;g<10;g++){x.strokeStyle=`rgba(60,40,20,${R(.04,.1)})`;x.lineWidth=.8;x.beginPath();x.moveTo(i*w+R(2,w-2),0);x.lineTo(i*w+R(2,w-2),s);x.stroke();}}});
B.stucco=tex((x,s)=>{fillNoise(x,s,'#e6dfce','#d4ccb8','#f2ecdd',3000);});
B.sand=tex((x,s)=>{fillNoise(x,s,'#d8c79c','#c3b288','#e8d9b2',5000);});
B.grass=tex((x,s)=>{x.fillStyle='#86a06a';x.fillRect(0,0,s,s);for(let i=0;i<9000;i++){const c=Math.random();x.strokeStyle=c<.5?'#6f8d54':'#9bb47e';x.globalAlpha=R(.2,.6);x.lineWidth=R(.5,1.3);const px=R(0,s),py=R(0,s);x.beginPath();x.moveTo(px,py);x.lineTo(px+R(-2,2),py-R(1.5,4));x.stroke();}x.globalAlpha=1;});
B.thatch=tex((x,s)=>{x.fillStyle='#b89a5e';x.fillRect(0,0,s,s);for(let i=0;i<170;i++){x.strokeStyle=`rgba(${R(120,170)|0},${R(95,140)|0},${R(50,80)|0},${R(.15,.4)})`;x.lineWidth=R(1.5,4);const px=R(0,s);x.beginPath();x.moveTo(px,0);x.lineTo(px+R(-8,8),s);x.stroke();}});

function mat(base,rx,ry,rough,opts){const m=base.clone();m.needsUpdate=true;m.wrapS=m.wrapT=THREE.RepeatWrapping;m.repeat.set(rx,ry);return new THREE.MeshStandardMaterial(Object.assign({map:m,roughness:rough,metalness:0},opts||{}));}
function tint(base,rx,ry,rough,color,opts){const m=mat(base,rx,ry,rough,opts);m.color=new THREE.Color(color);return m;}

// finish material resolvers
function floorMat(key,W,D){const rx=W/3.2,ry=D/3.2;switch(key){case'roble':return mat(B.wood,rx,ry,.42);case'porcelanato':return mat(B.tile,rx*.8,ry*.8,.16);case'marmol':return mat(B.marble,rx*.5,ry*.5,.1);default:return tint(B.concrete,rx*.4,ry*.4,.5,'#c6c0b5');}}
function counterMat(key){switch(key){case'marmol_blanco':return mat(B.marble,1.4,.6,.12);case'granito_negro':return mat(B.granite,1.4,.6,.16,{metalness:.1});case'madera':return mat(B.wood,1.4,.5,.4);default:return tint(B.concrete,1,.5,.5,'#a39d92');}}
function cladMat(key,h){switch(key){case'madera':return mat(B.slats,2.6,h/2.4,.55);case'piedra':return mat(B.stone,2.2,h/3,.85);case'concreto':return tint(B.concrete,1.6,h/3,.6,'#8a847a');default:return tint(B.stucco,2,h/3,.9,'#e2dac8');}}

const glassMk=(c,o)=>new THREE.MeshPhysicalMaterial({color:c,metalness:0,roughness:.04,transparent:true,opacity:o,envMapIntensity:1.8,clearcoat:.6,emissive:new THREE.Color(0xffcf8a),emissiveIntensity:0});
const box=(w,h,d,m)=>{const x=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);x.castShadow=true;x.receiveShadow=true;return x;};
const cyl=(rt,rb,h,m,seg=14)=>{const x=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),m);x.castShadow=true;x.receiveShadow=true;return x;};

const FX={uph:new THREE.MeshStandardMaterial({color:0x8d8676,roughness:.92}),uph2:new THREE.MeshStandardMaterial({color:0x5d6b62,roughness:.9}),
  metal:new THREE.MeshStandardMaterial({color:0xb9b6b0,roughness:.3,metalness:.85}),black:new THREE.MeshStandardMaterial({color:0x1a1816,roughness:.4,metalness:.3}),
  white:new THREE.MeshStandardMaterial({color:0xede9e0,roughness:.6}),wood:()=>mat(B.wood,1,1,.45),
  plant:new THREE.MeshStandardMaterial({color:0x4f7d52,roughness:.7}),lamp:new THREE.MeshStandardMaterial({color:0xf6e6c2,emissive:0xffcf8a,emissiveIntensity:0,roughness:.4}),
  glassClear:new THREE.MeshPhysicalMaterial({color:0xdfeef2,roughness:.03,transparent:true,opacity:.25,envMapIntensity:1.6})};

const TP={
 esencial:{glass:.32,overhang:.5,roofH:.45,wall:0xe9e3d6,roof:0x9a958c,base:0xc9c3b6,glass_c:0xaec3cf,glass_o:.4,cantile:0},
 sora:{glass:.56,overhang:1.0,roofH:.5,wall:0xe0d4bd,roof:0x39342d,base:0x8f8980,glass_c:0x9fb6c2,glass_o:.42,cantile:0},
 firma:{glass:.86,overhang:1.5,roofH:.42,wall:0xcfc6b6,roof:0x1a1813,base:0x423e38,glass_c:0x8fa8b4,glass_o:.42,cantile:.22}
};

export function disposeG(g){g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map&&m.map.isCanvasTexture)m.map.dispose();});}});}

let H={lights:[],lampMats:[],glassMats:[]};
function addPoint(x,y,z,c,base){const p=new THREE.PointLight(c,0,14,2);p.position.set(x,y,z);p.userData.base=base;return p;}

function furnishLiving(f,W,D,y,floorMatKey){
  const wood=FX.wood();
  const sofa=box(W*.4,.4,.95,FX.uph);sofa.position.set(-W*.17,y+.34,D*.24);f.add(sofa);
  const sb=box(W*.4,.55,.22,FX.uph);sb.position.set(-W*.17,y+.5,D*.33);f.add(sb);
  [-1,1].forEach(s=>{const arm=box(.22,.5,.95,FX.uph);arm.position.set(-W*.17+s*(W*.2),y+.4,D*.24);f.add(arm);});
  const cof=box(1.3,.16,.66,wood);cof.position.set(-W*.17,y+.24,D*.02);f.add(cof);
  const rug=box(W*.46,.03,D*.36,new THREE.MeshStandardMaterial({color:0xc7b694,roughness:.96}));rug.position.set(-W*.15,y+.165,D*.12);f.add(rug);
  const cons=box(W*.34,.5,.4,wood);cons.position.set(-W*.17,y+.4,-D*.04);f.add(cons);
  const tv=box(1.9,1.05,.07,FX.black);tv.position.set(-W*.17,y+1.25,-D*.05);f.add(tv);
  const lp=cyl(.04,.04,1.7,FX.metal);lp.position.set(-W*.34,y+.85,D*.2);f.add(lp);const sh=cyl(.22,.16,.3,FX.lamp);sh.position.set(-W*.34,y+1.75,D*.2);f.add(sh);H.lampMats.push(sh.material);H.lights.push(addPoint(-W*.34,y+1.7,D*.2,0xffcf8a,4));
}
function furnishKitchen(f,W,D,y,counterKey){
  const cMat=counterMat(counterKey),cab=new THREE.MeshStandardMaterial({color:0x35302a,roughness:.45}),cabL=FX.white;
  const runW=W*.34;
  const lower=box(runW,.9,.62,cab);lower.position.set(W*.27,y+.46,-D*.31);f.add(lower);
  const ctop=box(runW+.05,.08,.66,cMat);ctop.position.set(W*.27,y+.94,-D*.31);f.add(ctop);
  const upper=box(runW,.62,.34,cabL);upper.position.set(W*.27,y+1.95,-D*.36);f.add(upper);
  const splash=box(runW,.7,.04,mat(B.tile,2,.6,.2));splash.position.set(W*.27,y+1.35,-D*.31-.31);f.add(splash);
  const hood=box(.7,.4,.5,FX.metal);hood.position.set(W*.27,y+1.85,-D*.31);f.add(hood);
  const stove=box(.62,.04,.56,FX.black);stove.position.set(W*.27,y+.99,-D*.31);f.add(stove);
  const sink=box(.5,.06,.4,FX.metal);sink.position.set(W*.27-runW*.3,y+.99,-D*.31);f.add(sink);
  const fridge=box(.7,2.0,.7,FX.metal);fridge.position.set(W*.27+runW*.5+.4,y+1.0,-D*.31);f.add(fridge);
  const island=box(2.1,.9,1.0,cab);island.position.set(W*.16,y+.46,D*.04);f.add(island);
  const itop=box(2.2,.09,1.1,cMat);itop.position.set(W*.16,y+.95,D*.04);f.add(itop);
  [-.7,0,.7].forEach(o=>{const st=cyl(.16,.14,.02,FX.wood());const leg=cyl(.03,.03,.62,FX.metal);st.position.set(W*.16+o,y+.95+.32,D*.04+.75);leg.position.set(W*.16+o,y+.31,D*.04+.75);f.add(st,leg);});
  [-.6,.6].forEach(o=>{const pl=cyl(.13,.05,.22,FX.lamp);pl.position.set(W*.16+o,y+2.0,D*.04);f.add(pl);H.lampMats.push(pl.material);H.lights.push(addPoint(W*.16+o,y+1.95,D*.04,0xffd79a,3.5));const wire=cyl(.01,.01,.6,FX.black);wire.position.set(W*.16+o,y+2.4,D*.04);f.add(wire);});
}
function furnishDining(f,W,D,y){
  const wood=FX.wood();
  const t=box(1.9,.1,.9,wood);t.position.set(-W*.27,y+.76,-D*.27);f.add(t);
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{const l=cyl(.05,.05,.76,wood);l.position.set(-W*.27+sx*.8,y+.38,-D*.27+sz*.34);f.add(l);});
  [[-.8,-.55],[.8,-.55],[-.8,.55],[.8,.55],[0,-.62],[0,.62]].forEach(([cx,cz])=>{const seat=box(.42,.06,.42,FX.uph2);seat.position.set(-W*.27+cx,y+.46,-D*.27+cz);f.add(seat);const bk=box(.42,.5,.07,FX.uph2);bk.position.set(-W*.27+cx,y+.7,-D*.27+cz-Math.sign(cz||1)*.18);f.add(bk);[[.18,.18],[-.18,.18],[.18,-.18],[-.18,-.18]].forEach(([lx,lz])=>{const lg=cyl(.025,.025,.46,FX.wood());lg.position.set(-W*.27+cx+lx,y+.23,-D*.27+cz+lz);f.add(lg);});});
  const pl=cyl(.32,.32,.12,FX.lamp);pl.position.set(-W*.27,y+2.1,-D*.27);f.add(pl);H.lampMats.push(pl.material);H.lights.push(addPoint(-W*.27,y+2.0,-D*.27,0xffd79a,3.5));
}
function furnishBedroom(f,W,D,y){
  const wood=FX.wood();
  const bed=box(2.2,.45,2.4,wood);bed.position.set(-W*.1,y+.32,-D*.06);f.add(bed);
  const mat_=box(2.05,.28,2.25,FX.white);mat_.position.set(-W*.1,y+.6,-D*.06);f.add(mat_);
  const duv=box(2.0,.16,1.6,new THREE.MeshStandardMaterial({color:0xcfc4ad,roughness:.92}));duv.position.set(-W*.1,y+.74,-D*.06+.34);f.add(duv);
  const head=box(2.35,1.05,.16,FX.uph);head.position.set(-W*.1,y+.78,-D*.06-1.18);f.add(head);
  [[-1.4],[1.4]].forEach(([nx])=>{const ns=box(.55,.5,.45,wood);ns.position.set(-W*.1+nx,y+.4,-D*.06-1.0);f.add(ns);const tl=cyl(.12,.1,.28,FX.lamp);tl.position.set(-W*.1+nx,y+.78,-D*.06-1.0);f.add(tl);H.lampMats.push(tl.material);H.lights.push(addPoint(-W*.1+nx,y+.85,-D*.06-1.0,0xffcf8a,2.4));});
  const ward=box(W*.26,2.1,.62,FX.white);ward.position.set(W*.3,y+1.2,-D*.26);f.add(ward);
  const bench=box(1.8,.4,.5,FX.uph2);bench.position.set(-W*.1,y+.34,-D*.06+1.5);f.add(bench);
  const rug=box(W*.4,.03,D*.34,new THREE.MeshStandardMaterial({color:0xbcae8e,roughness:.96}));rug.position.set(-W*.1,y+.16,-D*.06+.4);f.add(rug);
}
function furnishBath(f,W,D,y){
  const cMat=counterMat('marmol_blanco');
  const van=box(1.5,.85,.55,new THREE.MeshStandardMaterial({color:0x4a4038,roughness:.5}));van.position.set(W*.34,y+.44,D*.3);f.add(van);
  const vtop=box(1.55,.08,.6,cMat);vtop.position.set(W*.34,y+.9,D*.3);f.add(vtop);
  const mir=box(1.2,.9,.04,FX.glassClear);mir.position.set(W*.34,y+1.6,D*.3+.3);f.add(mir);
  const toilet=box(.45,.7,.62,FX.white);toilet.position.set(W*.34,y+.35,-D*.05);f.add(toilet);
  const sg=box(.06,2.0,1.4,FX.glassClear);sg.position.set(W*.2,y+1.0,D*.22);f.add(sg);
  const sg2=box(1.3,2.0,.06,FX.glassClear);sg2.position.set(W*.27,y+1.0,D*.5);f.add(sg2);
}
function furnishFloor(f,floorIdx,W,D,y,upperBedroom,decor,floorKey,counterKey){
  const bedroom=(upperBedroom&&floorIdx===1);
  if(bedroom){furnishBedroom(f,W,D,y);furnishBath(f,W,D,y);}
  else{furnishLiving(f,W,D,y,floorKey);furnishKitchen(f,W,D,y,counterKey);furnishDining(f,W,D,y);}
  if(decor){
    [[W*.4,D*.3],[-W*.42,-D*.32]].forEach(([px,pz])=>{const pot=cyl(.22,.16,.5,new THREE.MeshStandardMaterial({color:0xb8b1a4,roughness:.85}));pot.position.set(px,y+.4,pz);f.add(pot);const fol=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,0),FX.plant);fol.position.set(px,y+1.15,pz);fol.castShadow=true;f.add(fol);});
    const art=box(1.2,.85,.05,new THREE.MeshStandardMaterial({color:bedroom?0x6f7d8a:0x9a6f5a,roughness:.6}));art.position.set(W*.46,y+1.6,bedroom?D*.1:-D*.05);art.rotation.y=-Math.PI/2;f.add(art);
  }
  H.lights.push(addPoint(0,y+2.7,0,0xfff0d6,decor?6:4));
}

// gable-end triangular wall fill (z-y plane, faces +/-x)
function gableEnd(D,ridgeH,m){
  const sh=new THREE.Shape();sh.moveTo(-D/2,0);sh.lineTo(D/2,0);sh.lineTo(0,ridgeH);sh.closePath();
  const me=new THREE.Mesh(new THREE.ShapeGeometry(sh),m);me.castShadow=true;me.receiveShadow=true;return me;
}

// S = {floors, size, tier, finish:{cladding,floor,counter}, roofStyle, pool, solar, wing, decor}
export function buildHouse(S){
  H={lights:[],lampMats:[],glassMats:[]};
  const g=new THREE.Group();const P=TP[S.tier]||TP.sora;const floors=S.floors||1;const decor=S.decor!==false;const roofStyle=S.roofStyle||'flat';
  const areaPerFloor=S.size/(floors>1?1.7:1);let W=Math.sqrt(areaPerFloor*1.7),D=areaPerFloor/W;W=Math.max(11,Math.min(26,W));D=Math.max(7.5,Math.min(15,D));const sx=.6;W*=sx;D*=sx;
  const fH=3.0,baseY=.6,t=.16;
  const wallMat=tint(B.stucco,W/4,fH/3,.9,P.wall),roofMat=tint(B.concrete,2,2,.85,P.roof),baseMat=tint(B.concrete,3,1,.9,P.base),frameMat=new THREE.MeshStandardMaterial({color:0x23201a,roughness:.5,metalness:.2});
  const claddingMat=cladMat(S.finish.cladding,fH);
  const plinth=box(W+1.4,baseY,D+1.4,baseMat);plinth.position.y=baseY/2;g.add(plinth);
  const floorGroups=[];
  for(let i=0;i<floors;i++){
    const fg=new THREE.Group();const y0=baseY+i*fH;const off=(S.tier==='firma'&&i===1)?D*P.cantile:0;fg.position.z=off;
    const fMat=floorMat(S.finish.floor,W,D);const slab=box(W,t,D,fMat);slab.position.set(0,y0+t/2,0);fg.add(slab);
    const gW=W*P.glass;const gMat=glassMk(P.glass_c,P.glass_o);H.glassMats.push(gMat);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(gW,fH-.2,.08),gMat);gl.position.set(0,y0+fH/2,D/2);fg.add(gl);
    for(let m=-2;m<=2;m++){const mu=box(.05,fH-.2,.12,frameMat);mu.position.set(m*gW/5,y0+fH/2,D/2+.02);fg.add(mu);}
    const fl=(W-gW)/2;if(fl>.3){[-1,1].forEach(s=>{const fw=box(fl,fH,t,wallMat);fw.position.set(s*(gW/2+fl/2),y0+fH/2,D/2);fg.add(fw);});}
    const back=box(W,fH,t,wallMat);back.position.set(0,y0+fH/2,-D/2);fg.add(back);
    [-W*.26,W*.26].forEach(wx=>{const gm=glassMk(P.glass_c,P.glass_o);H.glassMats.push(gm);const w=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.3,.1),gm);w.position.set(wx,y0+fH*.58,-D/2);fg.add(w);const fr=box(1.8,1.5,.05,frameMat);fr.position.set(wx,y0+fH*.58,-D/2-.05);fg.add(fr);});
    const left=box(t,fH,D,claddingMat);left.position.set(-W/2,y0+fH/2,0);fg.add(left);
    const right=box(t,fH,D,wallMat);right.position.set(W/2,y0+fH/2,0);fg.add(right);
    const rgm=glassMk(P.glass_c,P.glass_o);H.glassMats.push(rgm);const rw=new THREE.Mesh(new THREE.BoxGeometry(.1,1.5,2.0),rgm);rw.position.set(W/2,y0+fH*.58,D*.08);fg.add(rw);
    if(i===0){const door=box(1.1,2.2,.14,FX.wood());door.position.set(W*.30,y0+1.1,D/2+.01);fg.add(door);}
    const pmat=new THREE.MeshStandardMaterial({color:0xefe9dc,roughness:.95});
    const pL=box(W*.34,fH-.22,t*.8,pmat);pL.position.set(-W*.30,y0+(fH-.22)/2,0);fg.add(pL);
    const pR=box(W*.16,fH-.22,t*.8,pmat);pR.position.set(W*.42,y0+(fH-.22)/2,0);fg.add(pR);
    const pZ=box(t*.8,fH-.22,D*.4,pmat);pZ.position.set(W*.05,y0+(fH-.22)/2,-D*.3);fg.add(pZ);
    furnishFloor(fg,i,W,D,y0+t,floors>1,decor,S.finish.floor,S.finish.counter);
    g.add(fg);floorGroups.push({grp:fg,y0});
  }
  if(floors>1){const steps=10,sw=1.2,sh=fH/steps,sd=.28;const smat=FX.wood();for(let k=0;k<steps;k++){const st=box(sw,sh,sd,smat);st.position.set(-W*.36,baseY+sh*(k+.5),-D*.2+k*sd);g.add(st);}const rail=box(.06,1.0,steps*sd,FX.metal);rail.position.set(-W*.36+sw/2,baseY+fH*.6,-D*.2+steps*sd/2);g.add(rail);}
  // ===== ROOF =====
  const roofTop=baseY+floors*fH;const roofOff=(S.tier==='firma'&&floors>1)?D*P.cantile:0;const oh=P.overhang;
  const roof=new THREE.Group();
  if(roofStyle==='gable'||roofStyle==='thatch'){
    const thatch=roofStyle==='thatch';
    const rw=W+oh*2,rd=D+oh*2,ridgeH=Math.max(1.5,W*.16),thick=thatch?.5:.18;
    const rmat=thatch?tint(B.thatch,rw/3,1.4,.98):roofMat;
    const half=rd/2,slope=Math.sqrt(half*half+ridgeH*ridgeH),ang=Math.atan2(ridgeH,half);
    [1,-1].forEach(s=>{const pl=box(rw,thick,slope+oh*.6,rmat);pl.rotation.x=s*ang;pl.position.set(0,roofTop+ridgeH/2,s*half/2+roofOff/2);roof.add(pl);});
    [1,-1].forEach(s=>{const ge=gableEnd(D,ridgeH,wallMat);ge.rotation.y=s*Math.PI/2;ge.position.set(s*W/2,roofTop,roofOff/2);roof.add(ge);});
    const ridge=box(rw,.16,.22,rmat);ridge.position.set(0,roofTop+ridgeH,roofOff/2);roof.add(ridge);
  }else{
    const slab=box(W+oh*2,P.roofH,D+oh*2,roofMat);slab.position.set(0,roofTop+P.roofH/2,roofOff/2);roof.add(slab);
    if(S.tier!=='esencial'){const par=box(W+oh*2-.2,.25,D+oh*2-.2,roofMat);par.position.set(0,roofTop+P.roofH+.12,roofOff/2);roof.add(par);}
  }
  g.add(roof);
  const can=box(3,.16,2.4,roofMat);can.position.set(W*.30,baseY+2.6,D/2+1.0);g.add(can);
  const deck=box(W*.92,.16,3.4,mat(B.wood,3,1,.5));deck.position.set(0,baseY-.02,D/2+1.7);deck.receiveShadow=true;g.add(deck);
  if(S.wing){const ww=5.0,wd=D*.82,wh=fH;const wing=box(ww,wh,wd,wallMat);wing.position.set(W/2+ww/2,baseY+wh/2,-D*.04);g.add(wing);const wr=box(ww+1,.4,wd+1,roofMat);wr.position.set(W/2+ww/2,baseY+wh+.2,-D*.04);g.add(wr);const gm=glassMk(P.glass_c,P.glass_o);H.glassMats.push(gm);const wg=new THREE.Mesh(new THREE.BoxGeometry(ww*.7,1.5,.1),gm);wg.position.set(W/2+ww/2,baseY+fH*.55,wd/2-D*.04);g.add(wg);}
  if(S.solar){const pm=new THREE.MeshStandardMaterial({color:0x10131a,roughness:.22,metalness:.55});const py=roofStyle==='flat'?roofTop+P.roofH+.35:roofTop+.9;for(let a=0;a<5;a++)for(let b=0;b<2;b++){const pn=box(2.0,.07,1.25,pm);pn.position.set(-W*.32+a*2.15,py,-D*.2+b*1.45+roofOff/2);pn.rotation.x=-.28;g.add(pn);}}
  if(S.pool){const pw=7,pd=3.6;const cop=box(pw+.8,.22,pd+.8,mat(B.tile,2,1,.3));cop.position.set(-W*.05,baseY-.05,D/2+5.8);cop.receiveShadow=true;g.add(cop);const wat=new THREE.Mesh(new THREE.BoxGeometry(pw,.3,pd),new THREE.MeshPhysicalMaterial({color:0x2e8a96,roughness:.06,metalness:.05,transparent:true,opacity:.92,envMapIntensity:1.5,clearcoat:.8}));wat.position.set(-W*.05,baseY-.02,D/2+5.8);g.add(wat);}
  return {group:g,roof,floors:floorGroups,lights:H.lights,lampMats:H.lampMats,glassMats:H.glassMats,dims:{W,D,fH,n:floors,baseY,roofH:P.roofH}};
}

// ===== SCENERY + GROUND =====
function palm(x,z){const t=new THREE.Group();const tr=cyl(.18,.26,5,FX.wood());tr.position.y=2.5;t.add(tr);const lm=new THREE.MeshStandardMaterial({color:0x4f7d52,roughness:.8,side:THREE.DoubleSide});for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(.5,3.2,4),lm);l.position.y=5;l.rotation.z=Math.PI/2.4;l.rotation.y=i*Math.PI/3;l.castShadow=true;t.add(l);}t.position.set(x,0,z);t.scale.setScalar(.9+Math.random()*.3);return t;}
function pine(x,z){const t=new THREE.Group();const tr=cyl(.22,.28,1.6,new THREE.MeshStandardMaterial({color:0x6b4e34,roughness:.9}));tr.position.y=.8;t.add(tr);const gm=new THREE.MeshStandardMaterial({color:0x3c6043,roughness:.85});for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.7-i*.4,2.4,8),gm);c.position.y=1.8+i*1.5;c.castShadow=true;t.add(c);}t.position.set(x,0,z);t.scale.setScalar(.9+Math.random()*.4);return t;}
export function buildScenery(scn){const g=new THREE.Group();[[-22,9],[24,-14],[-26,-18],[28,13],[-17,-24],[20,20]].forEach(([x,z])=>g.add(scn==='beach'?palm(x,z):pine(x,z)));return g;}

export function makeGround(){
  const groundMat=mat(B.sand,40,40,1);const mesh=new THREE.Mesh(new THREE.CircleGeometry(150,64),groundMat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;
  return {mesh,set(scn){const src=scn==='beach'?B.sand:B.grass;const tm=src.clone();tm.wrapS=tm.wrapT=THREE.RepeatWrapping;tm.repeat.set(scn==='beach'?40:50,scn==='beach'?40:50);groundMat.map=tm;groundMat.color.set(0xffffff);groundMat.needsUpdate=true;}};
}
