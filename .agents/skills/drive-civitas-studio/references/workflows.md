# Civitas Studio workflow recipes

Assumes the desktop app is running and the MCP service is on. Run everything from this skill's directory (the folder containing `references/` and `scripts/`); the commands below use relative paths.

```bash
node scripts/civitas.mjs status
node scripts/civitas.mjs scene --brief
```

If `status` fails: start `Civitas Studio.exe` (or `npm run tauri:dev`), open the plug panel and start MCP, then retry. The CLI auto-scans ports 8971-8994 when `CIVITAS_URL` is unset.

---

## 1. Build a custom two-room house atomically

Use `apply_actions` so the entire shell is one undo step. Give walls stable ids so doors/windows in the same plan can reference them.

Create `two-room.json`:

```json
{
  "actions": [
    { "type": "add_wall", "id": "w_n", "a": [-5, -4], "b": [5, -4] },
    { "type": "add_wall", "id": "w_e", "a": [5, -4], "b": [5, 4] },
    { "type": "add_wall", "id": "w_s", "a": [5, 4], "b": [-5, 4] },
    { "type": "add_wall", "id": "w_w", "a": [-5, 4], "b": [-5, -4] },
    { "type": "add_wall", "id": "w_mid", "a": [0, -4], "b": [0, 4], "thickness": 0.12 },
    { "type": "add_opening", "wallId": "w_s", "openingType": "door", "style": "single", "offset": 2.5 },
    { "type": "add_opening", "wallId": "w_mid", "openingType": "door", "style": "single", "offset": 4 },
    { "type": "add_opening", "wallId": "w_n", "openingType": "window", "style": "wide", "offset": 2.5 },
    { "type": "add_opening", "wallId": "w_n", "openingType": "window", "style": "wide", "offset": 7.5 },
    { "type": "add_opening", "wallId": "w_e", "openingType": "window", "style": "standard", "offset": 4 },
    { "type": "add_slab", "x": 0, "z": 0, "width": 10, "depth": 8 }
  ]
}
```

Finish the roof with `complete_rooms` after the shell exists:

```bash
node scripts/civitas.mjs batch two-room.json
node scripts/civitas.mjs call set_plan_options '{"autoSlab":false,"autoDoor":false,"autoWindow":false,"autoRoof":true}'
node scripts/civitas.mjs call complete_rooms '{}'
node scripts/civitas.mjs views --x 0 --z 0 --ring 6 --max 900 --out shots/two-room
```

Alternative, for a simple room, use the high-level action:

```bash
node scripts/civitas.mjs call build_room '{"roomType":"bedroom","width":6,"depth":5,"roof":true,"furnish":true}'
```

---

## 1b. Stairs, escalators and floor openings

A stair model on a solid slab is decorative: it has no floor opening above. Place the model, then cut a real opening in the slab above (or all levels above for an elevator):

```bash
# 1) place a stair on the active level (scaleY matches a 4.6 m storey)
node scripts/civitas.mjs call place_model '{"modelId":"stair-open-double","x":52,"z":32,"scaleY":1.48}'

# 2) cut the floor above (default source = active level)
node scripts/civitas.mjs call cut_floor_opening '{"x":52,"z":32,"width":5.6,"depth":4.8}'
```

For an elevator shaft, place the cab on the lowest level and cut every level above:

```bash
node scripts/civitas.mjs call place_model '{"modelId":"elevator-shaft","x":30,"z":33,"scaleY":1.44}'
node scripts/civitas.mjs call cut_floor_opening '{"x":30,"z":33,"width":3.4,"depth":3.4,"allAbove":true}'
```

The hole must fit inside one slab. For rotated slabs/openings pass `rot`; for a specific target level pass `levelId`; for a different source level pass `fromLevelId`. In the GUI, select a stair/escalator/elevator and use **楼层洞口 → 在上一层开洞** (elevators also have **贯穿上方所有楼层**). Slabs selected in the Inspector expose/delete their `holes` directly.

When holes or vertical scaling change, the slab mesh is rebuilt (not just moved); screenshots should show the void and the stair reaching the next floor.

---

## 2. Villa, enterable building and interiors

`build_villa` produces a fast one-storey villa from walls, rooms and furniture (it is not a single enterable `building` entity):

```bash
node scripts/civitas.mjs call build_villa '{"width":16,"depth":9,"withPool":true,"withGarden":true}'
node scripts/civitas.mjs views --ring 6 --max 900 --out shots/villa
```

For a building you can enter and edit floor by floor, use a whole-building template or the city generator:

```bash
node scripts/civitas.mjs call place_building '{"templateId":"villa","furnished":true,"garden":true}'
node scripts/civitas.mjs find --kind building
node scripts/civitas.mjs call enter_building '{"id":"building_xxx"}'
node scripts/civitas.mjs call set_building_mode '{"mode":"interior"}'
node scripts/civitas.mjs views --views current,overview,top --max 900 --out shots/interior
node scripts/civitas.mjs call exit_building '{}'
```

Inside a building, `doc.activeLevelId` is an interior level. `generate_city`/`place_building` are rejected until you exit.

Furnish/landscape a whole-building entity from the city:

```bash
node scripts/civitas.mjs call furnish_building '{"id":"building_xxx"}'
node scripts/civitas.mjs call landscape_building '{"id":"building_xxx"}'
```

---

## 3. Whole district

```bash
node scripts/civitas.mjs call generate_city '{"preset":"riverside","size":"medium","furnished":true}'
node scripts/civitas.mjs views --ring 8 --elevation 38 --max 1000 --out shots/city
```

Presets: `lakeside`, `downtown`, `garden`, `riverside`. Sizes: `small`, `medium`, `large`.
The district is one undo step. Generate next to existing content by passing `centerX/centerZ`; otherwise it anchors near the camera target.

Skyline row:

```bash
node scripts/civitas.mjs call place_skyline '{"count":6}'
```

---

## 4. Visual QA loop

The point of the vision API is to close the loop, not just screenshot once.

1. Capture a baseline: `views --ring 8 --max 900 --out shots/before`.
2. Inspect the JPEG paths printed by the script (read them with an image viewer/vision model).
3. Fix with `update_entity`, `add_opening`, `set_settings`, etc.
4. Capture the same angles: `views --ring 8 --max 900 --out shots/after`.
5. Read back `get_scene` counts / `get_entity` to confirm geometry.

Useful camera recipes:

```bash
# Top-down plan check
node scripts/civitas.mjs call set_camera '{"top":true}'

# Front/back/left/right plus corners
node scripts/civitas.mjs views --views north,south,east,west,northeast,northwest,southeast,southwest --max 800 --out shots/elevations

# Look at one building from 8 angles
node scripts/civitas.mjs views --id building_xxx --ring 8 --elevation 25 --max 900 --out shots/building

# Eye-level interior check
node scripts/civitas.mjs shot '{"eye":[2,1.7,1],"target":[6,1.5,4],"fov":60,"clean":true}'
```

Inside a building session, `id`-targeted views only see entities on the current interior document. Exit first if you need the city exterior.

---

## 5. Import a custom model

```bash
node scripts/civitas.mjs call import_model '{"path":"D:/assets/bench.glb","name":"长椅","x":12,"z":4}'
```

The result contains `data.modelId` (for example `custom_xxx`). Place more copies:

```bash
node scripts/civitas.mjs call place_model '{"modelId":"custom_xxx","x":18,"z":4,"rot":1.5708}'
```

If placement fails, move to a free spot or omit `x/z` when importing to only register the asset.

---

## 6. Save, export, reopen

```bash
node scripts/civitas.mjs call save_project '{"path":"D:/projects/demo.civitas"}'
node scripts/civitas.mjs call export_scene '{"format":"glb","path":"D:/projects/demo.glb"}'
node scripts/civitas.mjs call open_project '{"path":"D:/projects/demo.civitas","confirm":true}'
```

All paths must be absolute. `open_project` and `new_project` require `confirm:true` and replace the current document.

---

## 7. Editing existing entities

Always read before writing:

```bash
node scripts/civitas.mjs scene --entities --limit 200 --brief
node scripts/civitas.mjs find --kind wall
node scripts/civitas.mjs call get_entity '{"id":"wall_xxx"}'
```

Examples:

```bash
# Move/enlarge a wall, change color
node scripts/civitas.mjs call update_entity '{"id":"wall_xxx","a":[-4,-3],"b":[4,-3],"height":3.6,"thickness":0.24,"color":"#55606e"}'

# Change a door style and swing
node scripts/civitas.mjs call update_entity '{"id":"opening_xxx","style":"glass","openAngle":45,"hinge":"right"}'

# Reshape a path
node scripts/civitas.mjs call update_entity '{"id":"path_xxx","points":[[-10,0],[-4,3],[2,0],[8,4]],"width":3,"style":"gravel"}'

# Roof material/pitch
node scripts/civitas.mjs call update_entity '{"id":"roof_xxx","finish":"slate","pitch":40,"overhang":0.7}'
```

`update_entity` returns an error and leaves the document unchanged when the new geometry is invalid (wall overlap, opening out of wall, object collision, path crossing water).

---

## 8. Direct MCP / third-party agents

MCP endpoint: `http://127.0.0.1:8971/mcp` (streamable HTTP). Initialize, then `tools/list`, then `tools/call`.

```bash
curl -s -X POST http://127.0.0.1:8971/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"capture_views","arguments":{"ring":8,"maxSize":900}}}'
```

Image tools return native `image` content blocks plus a text copy with base64 removed. If a bearer token is configured, send `Authorization: Bearer <token>` on REST and MCP requests.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `Cannot reach ... 127.0.0.1:8971-8994` | App not running, or MCP service stopped. Start the desktop app, open the plug panel, start MCP. |
| `Unauthorized` / 401 | Set `CIVITAS_TOKEN` to the token from the MCP panel. |
| Request times out | Single call exceeded 120 s. Split large batches/city sizes. |
| `未找到 wallId 对应的墙体` in `apply_actions` | The wall is not in the same plan or lacks an explicit `id`. Add `"id"` to the `add_wall` action and reference it. |
| `请先退出建筑内部编辑` | Call `exit_building` before city/building operations. |
| `附近没有足够的空地` | Move the camera or pass `centerX/centerZ`; clear space with `delete_entities`/`clear_level`. |
| `与已有墙体重叠` | Adjust `a/b`, thickness, or delete the old wall; `update_entity` validates too. |
| `未知 modelId` | Use an id from `list_models`; imported models use the `custom_...` id returned by `import_model`. |
| Images not visible in an MCP client | The client may not render image content. Use REST and decode `data.images[0].data`, or run `views` to save files. |
| Port changed | MCP startup retries 8971..8994. Set `CIVITAS_URL` to the port shown in the panel. |
| Scene looks wrong after edits | `get_scene` counts and `get_entity` are authoritative; re-capture with `clean:true` to remove gizmos and ghosts. |

---

## 10. Safety

- The API is localhost-only; still treat the port as a control surface. Do not expose it.
- Destructive tools: `clear_level`, `new_project`, `open_project`; `apply_actions` containing `clear_level` requires `allowDestructive:true`.
- All edits are undoable except `new_project`/`open_project`; when unsure, save first.
- Do not write arbitrary code through the API — there is no code-evaluation endpoint.
