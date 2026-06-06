# Assignment 5 — Three.js Crystal Archipelago

## Run

```bash
cd asgn5
python3 -m http.server 8080
```

Visit `http://localhost:8080/index.html`

## Rubric checklist

| Criterion | Status | Where |
|---|---|---|
| Basic scene — 3+ shape types, animation, directional light, perspective camera | ✓ | Boxes, spheres, cylinders, cones, toruses, octahedrons; spinning crystals; `DirectionalLight`; `PerspectiveCamera` |
| At least one textured primary shape | ✓ | Grass ground, brick shrine cubes, wood islands, six-face cube (`textures/`) |
| Custom textured 3D model (.glb / .gltf / .obj+.mtl) | ✓ | `models/duck.glb` loaded with `GLTFLoader` |
| Camera controls | ✓ | `OrbitControls` — drag orbit, scroll zoom, right-drag pan |
| At least 3 different light sources | ✓ | Ambient, Directional, Hemisphere, Point, Spot (5 types) |
| Skybox | ✓ | Cubemap in `textures/skybox/` (`scene.background`) |
| At least 20 primary shapes | ✓ | 43+ primitive meshes + duck GLB (HUD shows live count) |
| Extra feature | ✓ | Gem collection mini-game — click gems, score HUD, particle bursts, victory toast |

## Controls

- **Left drag** — orbit camera
- **Scroll** — zoom
- **Right drag** — pan
- **Click gems** — collect golden octahedrons
