# Civitas Studio API reference (58 tools)

All calls are REST: `POST http://127.0.0.1:8971/api/tools/<name>` with a JSON object body.
MCP clients use `POST /mcp` JSON-RPC (`tools/list`, `tools/call`).

Every result has:

```jsonc
{
  "ok": true,
  "summary": "human-readable Chinese summary",
  "data": { /* tool-specific payload */ },
  "scene": {
    "projectName": "...",
    "counts": { "wall": 0, "opening": 0, "object": 0, "path": 0, "slab": 0, "roof": 0, "building": 0 },
    "activeLevelId": "level-0",
    "levels": [{ "id": "level-0", "name": "一层", "elevation": 0 }],
    "selectedId": null,
    "tool": "select",
    "dirty": false,
    "settings": { "gridSnap": true, "angleSnap": true, "showGrid": true, "showRoofs": true,
                  "isolateLevel": false, "planMode": false, "shadows": true,
                  "quality": "auto", "visualStyle": "mono" },
    "buildingSession": null,
    "history": { "canUndo": true, "canRedo": false, "undo": ["AI · ..."], "redo": [] }
  },
  "error": "only when ok=false"
}
```

Units are metres. Ground plane is X/Z, +Y is up. Rotations are radians unless the field ends in `Deg`.
Coordinate range is roughly -280..280 for props and -400..400 for buildings.

---

## Read

### `get_scene`
`{ includeEntities?: boolean, entityLimit?: 1..1000, levelId?, kind?, modelId? }`
Returns scene context (levels, counts, detected rooms, camera target), `perf`, `render`, live `view`, `cameraEye`, selection and optional entity list. `levelId`/`kind`/`modelId` filter the entity list (openings follow their wall's level).
Entity entries: id, kind, levelId, geometry fields, model name; slabs include `holeCount`.

### `get_entity`
`{ id }`
Returns the full entity plus `bounds` (world-space center/size). For a wall, includes its `openings`.

### `list_ui_controls`
`{ includeHidden?, query?, limit? }`
Returns Windows UIA automation ids/roles/names/rects for every control. Useful for GUI automation; not required for modeling.

### `list_models`
`{ category?, query?, placement?: "indoor"|"outdoor"|"on-road"|"on-water"|"any" }`
Returns built-in catalog models (id, Chinese name, footprint, height, placement, wallAlign) plus imported custom assets (category `custom`).

### `get_selection`
`{}`
Returns the currently selected entity and its editable fields.

---

## View and vision

### `select_entity`
`{ id?, modelId?, x?, z?, clear? }`
Select by id, by nearest model id around `x/z`, or clear with `clear:true`. Returns `data.selection`.

### `set_camera`
`{ target?:[x,y,z], distance?, azimuth?, polar?, eye?:[x,y,z], top?:boolean, focusId?:string }`
Moves the live orbit camera. `eye` is converted to orbit coordinates. `top:true` enters the near top-down view. `focusId` frames one entity.

### `focus_selection`
`{}` — frame the selected entity.

### `set_transform_mode`
`{ mode: "translate"|"rotate" }` — gizmo mode for the selected object.

### `focus_all`
`{}` — frame the whole scene.

### `get_screenshot`
`{ maxSize?, clean?, view?:{target?,distance?,azimuth?,polar?}, eye?:[x,y,z], target?:[x,y,z], fov? }`
Returns `data.images[]` with `{ label, mime, width, height, data(base64), eye?, target? }`.
`clean:true` hides selection boxes, gizmos, ghosts and the plan grid. `fov` 24..90.
MCP `tools/call` converts these to native `image` content blocks and strips base64 from the text copy.

### `capture_views`
Multi-angle visual inspection.
```jsonc
{
  "id": "optional entity id",
  "x": 0, "y": 1.6, "z": 0,            // optional point target
  "views": ["current","overview","top","north","east","south","west","northeast","southeast","southwest","northwest"],
  "ring": 8,                            // optional evenly spaced orbit views (2..16)
  "elevation": 30,                      // ring elevation degrees
  "distance": 30,                       // default fits the target
  "maxSize": 1024,
  "clean": true,
  "includeCurrent": false
}
```
Returns `data.focus { center, radius, source }` and `data.images[]` (same shape as get_screenshot, each labelled).
If no camera options are given, defaults to `current` + `overview`. If a target is given, defaults frame that target.
Directions are camera positions around the target: north = -Z side, east = +X side, south = +Z, west = -X.

---

## Build

### `build_villa`
`{ width?:10..30, depth?:6..18, centerX?, centerZ?, withPool?, withCarport?, withGarden? }`
Complete furnished single-storey villa. Omit coordinates to auto-find free land near the camera.

### `build_room`
`{ roomType?: "living|bedroom|kitchen|dining|bathroom|office|generic", width?:2.4..22, depth?:2.4..22, centerX?, centerZ?, roof?, furnish? }`
One enclosed room with door/window/slab/optional roof and matching furniture.

### `add_wall`
`{ id?, a:[x,z], b:[x,z], height?:0.6..8, thickness?:0.06..0.6, color?, levelId? }`
Draw one validated wall segment. Validate overlaps/water. For multi-wall work prefer `apply_actions` for one undo step. Supply stable `id`s when later `add_opening` actions in the same plan reference these walls.

### `add_opening`
`{ wallId, openingType:"door"|"window", style?, offset?, width?, height?, sill?, openAngle?, hinge? }`
Cut a door/window into an existing wall. `offset` metres from wall point A; default centres it.
Door styles: `single`, `double`, `sliding`, `glass`, `garage`.
Window styles: `standard`, `wide`, `picture`, `slim`, `small`.
Open angle -135..135 (0 closed); hinge `left`/`right`.

### `add_slab`
`{ x, z, width?, depth?, rot?, rotDeg?, thickness?, style?, levelId?, holes?:[{x,z,w,d,rot?}] }`
Rectangular slab/deck. Slab styles: `wood`, `oak`, `concrete`, `tile`, `stone`, `deck`.
`holes` are **world-space** rectangular voids cut through the slab (real geometry, not a decal); each hole must fit inside the slab.

### `cut_floor_opening`
`{ x, z, width, depth, rot?, levelId?, fromLevelId?, allAbove? }`
Cut a real rectangular opening in the slab above the active level (or `fromLevelId`), or in every level above when `allAbove:true` (elevator shafts). `levelId` targets one exact level. Use it after placing a stair/escalator; the Inspector also exposes one-click buttons on stair/escalator/elevator objects. Returns affected slab and level ids. Each hole must fit inside a single slab.

### `furnish_room`
`{ roomType?, centerX?, centerZ? }`
Furnish an existing closed room (selected room or nearest to camera).

### `place_model`
`{ modelId, x?, z?, rot?, scale?, scaleY? }`
Place any catalog or imported custom model. `scaleY` stretches height only (e.g. stair/elevator models to the storey height) without changing footprint. Omit x/z to let the app find a legal spot (indoor items go to a room, vehicles to roads, boats to water).

### `draw_path`
`{ pathType:"road"|"river"|"bridge"|"footpath"|"fence", points?:[[x,z],...], width?, closed?, sidewalk?, lanes?:2|4, bridgeHeight?, railings?, length?, curve?, centerX?, centerZ? }`
Catmull-Rom curved path. Omit points to auto-generate; a bridge without points crosses the nearest river. A closed river becomes a pond. Footpath styles: `stone`, `gravel`; fence styles: `wood`, `metal`, `hedge`, `stone`.

### `add_pond`
`{ centerX?, centerZ?, radius?:3..32 }`

### `add_roof`
`{ x?, z?, style?:"gable"|"hip"|"flat"|"shed", finish?:"terracotta"|"slate"|"charcoal"|"copper"|"shingle", pitch? }`
Generates a roof from the closed room at x/z (or near the camera).

### `add_vegetation`
`{ centerX?, centerZ?, radius?:4..45, count?:1..20 }`
Trees/bushes/flower beds, avoiding buildings and roads.

---

## Edit

### `modify_selected`
`{ rotateByDeg?, color?, x?, z?, scale?, height?, width?, depth?, pitch?, finish?, openAngle?, hinge? }`
Convenience edits for the selection. For full Inspector-level control use `update_entity`.

### `update_entity`
`{ id, ...fields }` — full kind-aware editing with validation:
- wall: `a`, `b`, `height`, `thickness`, `color`, `levelId`
- opening: `style`, `offset`, `width`, `height`, `sill`, `openAngle`, `hinge`
- object: `x`, `z`, `rot`/`rotDeg`, `scale`, `scaleY`, `levelId`
- slab: `x`, `z`, `width`/`w`, `depth`/`d`, `rot`/`rotDeg`, `thickness`, `style`, `holes`, `levelId`
- roof: `x`, `z`, `width`/`w`, `depth`/`d`, `rot`/`rotDeg`, `style`, `finish`, `pitch`, `eaveY`, `overhang`, `levelId`
- path: `points`, `width`, `style`, `sidewalk`, `lanes`, `bridgeHeight`, `railings`, `closed`, `levelId`
- building: `x`, `z`, `rot`/`rotDeg`, `name`, `levelId`

### `duplicate_selected`
`{}` — duplicate the selection and select the copy.

### `delete_selected`
`{}` — delete the selection, undoable.

### `delete_entities`
`{ ids: [string] }` — batch delete; deleting a wall also deletes its openings.

### `clear_level`
`{ confirm: true }` — delete every entity on the active level. Destructive.

### `undo` / `redo`
`{}` — one history step.

---

## Levels and plan

### `add_level`
`{}` — new storey above the top level, made active.

### `set_active_level`
`{ index }` — zero-based level index.

### `update_level`
`{ levelId?|index?, name?, elevation? }` — rename/re-elevate a level.

### `duplicate_level`
`{ levelId?|index?, withFurniture? }`
Copy walls/openings/slabs to a new level above the top (same as Plan → copy to new floor). Returns the new level id and entity count.

### `delete_level`
`{ levelId?|index? }` — only empty levels; fails if it has entities or is the last level.

### `complete_rooms`
`{ levelId? }`
Detect closed wall loops and add missing slabs/doors/windows/top-storey roof according to plan options.

### `set_plan_options`
`{ autoSlab?, autoDoor?, autoWindow?, autoRoof? }`

---

## Buildings and city

### `list_building_templates`
`{}` — villa, townhouse, office, tower with size/floors.

### `place_building`
`{ templateId:"villa"|"townhouse"|"office"|"tower", x?, z?, rot?, floors?:1..24, wallColor?, roofFinish?, windowStyle?:"standard"|"wide"|"picture"|"slim"|"small", furnished?, garden? }`
Places a whole building as one entity. Omit x/z to use the camera target.

### `place_skyline`
`{ count?:3..8, centerX?, centerZ? }` — row of varied towers/buildings.

### `generate_city`
`{ preset?:"lakeside"|"downtown"|"garden"|"riverside", size?:"small"|"medium"|"large", centerX?, centerZ?, furnished?, streetTrees?, streetLights?, vehicles? }`
Whole district in one undo step: road grid, buildings, park/pond/plaza, trees, lamps, cars. Fails inside a building session.

### `furnish_building`
`{ id?, maxFloors? }` — with id: furnish every floor of that building; without: furnish the active level.

### `landscape_building`
`{ id }` — front path, trees, flower beds, lamps, benches, office plaza.

### `enter_building`
`{ id }` — enter a building instance; the editor switches to its interior levels.

### `exit_building`
`{}` — save interior changes and return to the city.

### `set_building_mode`
`{ mode:"shell"|"interior" }`

---

## Batch

### `apply_actions`
`{ actions: [...], allowDestructive?: boolean }`
Atomic plan, one history step, max 24 actions, max ~600 created entities. Action types:
`build_villa`, `build_room`, `furnish_room`, `place_model`, `add_wall`, `add_opening`, `add_slab`, `draw_path`, `add_pond`, `add_roof`, `add_vegetation`, `add_level`, `set_active_level`, `modify_selected`, `delete_selected`, `clear_level`, `undo`, `redo`, `focus_all`.

Rules:
- `undo`/`redo` must be alone.
- `clear_level` requires `allowDestructive:true`.
- On any action failure the whole plan rolls back and returns `ok:false`.
- `add_wall` accepts stable `id`; later `add_opening` actions can reference it in the same plan.
- Result includes `created` and `focusIds`.

---

## Files and project

### `save_project`
`{ path }` — absolute path; writes `.civitas` JSON. Desktop only.

### `open_project`
`{ path, confirm:true }` — load `.civitas`/JSON, replacing the document. Destructive.

### `new_project`
`{ confirm:true, sample? }` — blank or bundled sample scene. Destructive.

### `set_project_name`
`{ name }`

### `import_model`
`{ path, name?, x?, z?, rot?, scale? }`
Imports GLB/glTF/OBJ/STL from an absolute path, registers a custom asset, optionally places it. Returns `modelId` for later `place_model` calls. Desktop only.

### `export_scene`
`{ format:"glb"|"gltf"|"obj"|"stl", path }` — absolute path export.

---

## Settings

### `set_settings`
`{ gridSnap?, angleSnap?, showGrid?, showRoofs?, isolateLevel?, planMode?, shadows?, quality?:"auto"|"high"|"balanced"|"low", visualStyle?:"mono"|"daylight"|"sunset"|"blueprint" }`

### `set_quality`
`{ quality }` — shorthand.

### `set_visual_style`
`{ style }` — shorthand.

---

## Practical limits

- MCP HTTP timeout: 120 s per call.
- `apply_actions`: 24 actions, ~600 created entities per plan.
- `get_scene` entity list: max 1000 (default 300).
- Screenshot `maxSize`: 160..2560 in the API; default 1280 (`capture_views` 1024).
- Imported models are stored inside the project document, so large GLBs inflate `.civitas` files.
- The server binds 127.0.0.1 only. If the port is busy, startup tries 8971..8994; the MCP panel shows the actual port.
