# Sora Casas — 3D Configurator build history

The live page is always `sora/casas/disena-3d.html`. Every build of the
configurator is archived here as an immutable snapshot. To revert, copy a
version file over `disena-3d.html` and redeploy.

| Version | File | Engine | Live? | Notes |
|--------|------|--------|-------|-------|
| v1 | `disena-3d.v1-procedural.html` | three.js procedural | ✅ LIVE | Rich furnished real-time render — full interiors, furniture, walkthrough, tier transforms the architecture, time-of-day glow. The build Abraham prefers. |
| v2 | `disena-3d.v2-glb.html` | three.js + GLTFLoader | ❌ archived | Loaded the 4 generated `.glb` files (bahia/montana/volcan/bocas) with material/finish/extras driving named materials + nodes. Cleaner massing but less rich than v1; rejected. Kept for when an artist supplies detailed `.glb` models. |

## Rule
Always snapshot a new `disena-3d.vN-<label>.html` here BEFORE changing the live
`disena-3d.html`, and update this table (version, engine, live flag, what changed).
