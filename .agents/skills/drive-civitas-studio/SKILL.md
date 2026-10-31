---
name: drive-civitas-studio
description: Drive the running Civitas Studio desktop app through its local MCP/REST API on 127.0.0.1:8971 — build and edit cities, buildings, rooms, walls, doors/windows, slabs, roads, rivers, furniture and interiors, and capture or inspect the live 3D scene from any camera angle. Use when the user asks to model a Civitas Studio scene, connect an agent to Civitas MCP, list or fix Civitas entities, run visual QA, or take multi-angle screenshots. Triggers: Civitas Studio, 城市建造工坊, Civitas MCP, 8971, 一键建城, 建模, 多角度截图, 视觉验收.
---

# Drive Civitas Studio

Operate the live Civitas Studio desktop app via its localhost MCP/REST API. The API dispatches into the running webview, so every action changes the scene the user is looking at and every screenshot reflects the real viewport.

All commands below use paths relative to this skill directory (the folder containing this `SKILL.md`). `cd` there before running them; if the session cwd is elsewhere, resolve the skill folder first.

## Preflight

1. Confirm the desktop app is running (MCP is desktop-only; browser `npm run dev` has no API).
2. Check the service and discover its port:

```bash
node scripts/civitas.mjs status
```

The CLI auto-scans ports 8971-8994. If it reports `Cannot reach`, start `Civitas Studio.exe` (or `npm run tauri:dev`) and start MCP from the plug icon panel.
If a bearer token is configured, export `CIVITAS_TOKEN`. Use `CIVITAS_URL` only when the port is custom.

## Golden workflow

1. **Read first** — `get_scene`, `find`, `list_models`, `get_entity`. Never guess ids.
2. **Choose the highest-level tool** — `build_villa`, `build_room`, `generate_city`, `place_building`, `furnish_building`, `landscape_building` before hand-drawing geometry.
3. **Batch custom work** — put walls/openings/slabs in one `apply_actions` call for a single undo step.
4. **See the result** — `capture_views` (ring or named views) or `get_screenshot` with `eye`/`target`.
5. **Inspect the images**, then fix with `update_entity`/`delete_entities` and re-capture.
6. **Verify** — read `scene.counts` / `get_entity` and report concrete numbers.

```bash
node scripts/civitas.mjs scene --brief
node scripts/civitas.mjs find --kind building
node scripts/civitas.mjs call build_room '{"roomType":"bedroom","width":6,"depth":5,"furnish":true}'
node scripts/civitas.mjs views --ring 6 --max 900 --out shots/bedroom
```

## Vision loop (the main advantage)

- `capture_views` supports:
  - named views: `overview`, `top`, `north`, `east`, `south`, `west`, diagonals, `current`
  - `ring: N` evenly spaced orbit angles with `elevation`
  - target by entity `id` or point `x/y/z`
  - `distance`, `maxSize`, `clean` (hides selection/gizmos)
- `get_screenshot` supports explicit `eye` + `target` + `fov` for arbitrary placements, including eye-level interior shots.
- Images arrive as MCP `image` content blocks; REST returns base64 in `data.images[]`. Never print base64 — save files:

```bash
node scripts/civitas.mjs views --id building_xxx --ring 8 --max 900 --out shots/building
node scripts/civitas.mjs shot '{"eye":[2,1.7,1],"target":[6,1.5,4],"fov":60,"clean":true}'
```

Then read the saved JPEG paths with an image-capable model before deciding the next edit. Re-capture the same angles after changes.

## Custom shell in one atomic plan

Give walls stable ids so openings can reference them inside the same `apply_actions` plan:

```json
{
  "actions": [
    { "type": "add_wall", "id": "w_n", "a": [-4,-3], "b": [4,-3] },
    { "type": "add_wall", "id": "w_s", "a": [4,3], "b": [-4,3] },
    { "type": "add_wall", "id": "w_e", "a": [4,-3], "b": [4,3] },
    { "type": "add_wall", "id": "w_w", "a": [-4,3], "b": [-4,-3] },
    { "type": "add_opening", "wallId": "w_s", "openingType": "door", "style": "single", "offset": 4 },
    { "type": "add_opening", "wallId": "w_n", "openingType": "window", "style": "wide", "offset": 4 },
    { "type": "add_slab", "x": 0, "z": 0, "width": 8, "depth": 6 }
  ]
}
```

```bash
node scripts/civitas.mjs batch room.json
node scripts/civitas.mjs call set_plan_options '{"autoRoof":true,"autoSlab":false,"autoDoor":false,"autoWindow":false}'
node scripts/civitas.mjs call complete_rooms '{}'
```

Limits: 24 actions per plan, ~600 created entities, whole plan rolls back on any failure. `clear_level` requires `allowDestructive:true`.

## Stairs and floor openings

Stairs/escalators are models: placing one does **not** automatically cut the slab. Add a real opening with `cut_floor_opening`, or select the model in the Inspector and use **楼层洞口 → 在上一层开洞** (elevators also have **贯穿上方所有楼层**). Stretch a low stair/elevator to the storey height with `scaleY` (e.g. `scaleY: 1.48` for a 3.1 m stair under a 4.6 m floor):

```bash
node scripts/civitas.mjs call place_model '{"modelId":"stair-open-double","x":52,"z":32,"scaleY":1.48}'
node scripts/civitas.mjs call cut_floor_opening '{"x":52,"z":32,"width":5.6,"depth":4.8}'
node scripts/civitas.mjs call cut_floor_opening '{"x":30,"z":33,"width":3.4,"depth":3.4,"allAbove":true}'
```

The hole must fit inside a single slab. Slabs also accept world-space `holes` directly in `add_slab`/`update_entity`, and the Inspector can add/delete/resize them.

## Coordinates and units

- Metres; X/Z ground plane, +Y up.
- `rot` is radians; `rotDeg` is degrees (accepted by `update_entity`, `add_slab`; `place_model` uses `rot` only).
- Directions are camera positions around a target: north = -Z, east = +X, south = +Z, west = -X.
- Walls: `a`/`b` are endpoints; openings use `offset` from point A.

## Critical rules

- Read ids from `get_scene`/`find`/`get_entity`; do not invent them.
- `add_opening` cannot reference a wall created earlier unless that `add_wall` had an explicit `id`.
- `enter_building` switches the document to interior levels. Call `exit_building` before city/building-wide operations; `generate_city`/`place_building` fail inside a session.
- `update_entity` validates geometry. If it errors, adjust coordinates instead of forcing via multiple edits.
- A stair/escalator model alone does not cut the floor: call `cut_floor_opening` or use the Inspector's stairwell buttons; use `scaleY` so the flight reaches the next floor.
- Destructive: `clear_level`, `new_project`, `open_project` require explicit confirmation; save before replacing the project.
- File tools need absolute paths and the desktop app; imported models are embedded into the project file.
- MCP calls time out after 120 s. Split huge cities or batches.

## Failure playbook

| Error | Action |
| --- | --- |
| `Cannot reach` | Start desktop app + MCP; check `status` for the actual port. |
| 401 | Set `CIVITAS_TOKEN` from the MCP panel. |
| `未找到 wallId` | Same-plan wall lacked an explicit `id`. |
| `请先退出建筑内部编辑` | `exit_building`, retry. |
| `附近没有足够的空地` | Move camera, pass `centerX/centerZ`, or free space. |
| `未知 modelId` | Use `list_models` ids or the `custom_...` id returned by `import_model`. |

## Resources

- `scripts/civitas.mjs` — zero-dependency CLI: `status`, `scene`, `find`, `tools`, `call`, `batch`, `views`, `shot`, `undo`, `redo`, `focus-all`. Saves screenshots and never prints base64.
- `references/api.md` — all 58 tools, parameters, result shape, constants and limits.
- `references/workflows.md` — full recipes: custom house, villa/interior, city generation, visual QA, import, save/open, editing, direct MCP calls, troubleshooting.

For deeper API semantics read `references/api.md`; for step-by-step modeling sessions read `references/workflows.md`.
