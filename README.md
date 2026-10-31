# Civitas Studio · 城市建造工坊

A desktop 3D city & building construction studio built with Tauri 2, React 19 and Three.js. Draw freeform roads, rivers and bridges, assemble walls/doors/windows/roofs, place whole building templates that open into editable shells/interiors, furnish rooms from a 215-piece catalog, and export the result as GLB/glTF/OBJ/STL. A built-in AI Copilot can also build and edit the scene from natural-language instructions.

> **AI agents receiving this repo:** start at [`AGENTS.md`](AGENTS.md). It explains how to run the desktop app, connect to the local MCP API, import the bundled `drive-civitas-studio` skill (`npm run skill:install`), and verify all 58 tools.

## Highlights

- **AI Copilot** — press `Ctrl+K` and describe what you want. It turns Chinese/English requests into validated editor actions: whole villas, individual furnished rooms, furniture, freeform roads/rivers/bridges/ponds, vegetation, roofs, walls/doors/windows/slabs, levels, selected-object edits, and opening/closing doors to a chosen angle. With an OpenAI-compatible provider it also **sees the live scene**: current view or multi-angle screenshots are attached to every request, and a result snapshot is shown after each build. The local planner works offline; an optional OpenAI-compatible provider can be configured for stronger language understanding. Every AI plan is a single undo step, and dangerous actions require confirmation.
- **External agent API (MCP)** — the desktop build serves MCP over HTTP on `127.0.0.1` plus a plain REST mirror, exposing 58 tools (`build_room`, `add_wall`, `capture_views`, `generate_city`, `furnish_building`, …). Screenshots come back as native MCP image content, so an external agent can look at the scene from any angle, act, and look again. Any third-party agent can connect to the running app and drive AI auto-modeling end to end. Localhost-only, optional bearer token, whitelisted action schemas, and destructive calls require `confirm=true`.
- **Windows UI automation ready** — every control has a unique automation id exposed through WebView2 UIA (stable ids for key controls, generated scope/label ids for the rest), the 3D canvas is `civitas-viewport`, and the window starts maximized. `list_ui_controls` returns the full inventory for agents.
- **Bundled agent skill** — `.agents/skills/drive-civitas-studio/` contains a ready-to-import skill in the vendor-neutral Agent Skills layout (SKILL.md, full 58-tool API reference, workflow recipes, and a zero-dependency CLI). `npm run skill:install` copies it to the generic user-level `~/.agents/skills`; AI agents receiving this repo should start at `AGENTS.md`.
- **One-click city generator** — the Build-City workspace generates a complete district in a single undo step: road grid with sidewalks and crosswalks, residential blocks or glass towers, a central park (pond, gazebo or plaza), street trees, lamps, benches, planters and parked cars. Four presets (lakeside town, downtown blocks, garden suburb, riverside district) and three sizes; it automatically finds free ground next to the existing scene.
- **Furnish and landscape in one click** — closed rooms are detected (including rooms sharing a wall) and typed as living room, bedroom, kitchen/dining, bathroom, office or open-plan lobby, then furnished from the existing catalog while avoiding doors, stairs and overlaps. Any building can also get a generated front path, trees, flower beds, lamps, benches and an office plaza.
- **2D plan building** — the Plan workspace locks a top-down view and hides roofs/other floors. Drag a rectangle to generate four walls, a floor slab, a door, windows and an optional roof in one gesture; hand-drawn closed wall loops can be completed into slabs/roofs with one click. "Copy to new floor" lifts the current plan to the next elevation, so per-floor 2D plans assemble into a multi-storey 3D building. Exit the plan workspace via the top-right button, the status-bar chip, clicking the Plan rail again, or `Esc`.
- **Whole buildings with editable interiors** — pick a villa, townhouse, office or tower template and a valid/invalid ghost follows the cursor; `R` rotates, clicks keep placing, and floors, façade color, roof finish, window style, auto-furnishing and gardens are chosen before you drop it. Buildings move/rotate as one unit; double-click (or use the Inspector) to enter. Inside, switch between **shell** (walls, windows, doors, stairs) and **interior** (furniture) modes, change floors in the top bar, and exit back to the city at any time. The city view renders a merged shell derived from the edited exterior walls, so changes made inside are reflected outside.
- **Skyline brush** — the Buildings panel can place a template at the view centre or generate a 4/6/8-building skyline row with varied tower heights in one click; buildings remain individually movable units.
- **Visual styles** — switch between Mono, Daylight, Sunset and Blueprint presets in the Select panel; sky, fog, lighting, exposure and ground tint change together.
- **Freeform infrastructure** — roads, rivers, footpaths, bridges and fences are smooth Catmull-Rom curves with draggable control points. Close a river path to fill a pond; bridges get automatic railings, piers and ramps.
- **Component library** — 215 modeled components across living, bedroom, dining, kitchen, bathroom, office, laundry, outdoor, street, infrastructure, vegetation, vehicles and structure categories, plus imported custom models. The infrastructure set covers viaduct decks, curved/ramp segments, Y-piers, cloverleaf loops, pedestrian bridges, tunnel portals and toll booths alongside W-beam/concrete/pedestrian guardrails, sound barriers, median strips, sign gantries, highway lighting and lane markings; structure adds U-shaped, full-storey U, curved, public-plaza, stone, open-double, square-spiral and terrace stairs plus fire escapes, ladders and escalators.
- **Construction feedback** — valid placements use a light-grey ghost preview; invalid placements turn red with a specific reason (collision, wall fit, overlap, water, road-only/water-only rules). Walls, path endpoints and wall-backed furniture snap automatically with generous, distance-aware thresholds.
- **Parametric building** — walls support doors/windows with real openings and frames; doors can be left closed or opened to any angle from -135° to 135° with left/right hinges (single, double and glass leaves swing around the hinge; sliding panels slide along the wall). Slabs have generated surface textures and real floor openings: stair/escalator placements can cut the slab above, elevator shafts can cut every floor above, and hole outlines are editable in the Inspector. Automatic roofs recognize closed wall loops in gable/hip/flat/shed styles; multi-level floors and roof hiding make interior work easy.
- **Project workflow** — autosave to local storage, `.civitas` JSON projects, undo/redo, copy/delete, native save/open dialogs, and GLB/glTF/OBJ/STL import & export.
- **Performance** — shared merged geometry, a single vertex-PBR material per model batch, batched wall/path meshes, on-demand shadow updates, incremental scene sync, frustum culling, a capped pixel ratio, lightweight ribbon previews while drawing roads, and distance LOD that hides sub-pixel street props (automatically off when quality is explicitly set to High). The bundled sample runs at ~180 FPS / ~160 draw calls in headless Chromium, ~200k triangles.
- **Map fidelity** — 1K procedural ground with a bump map, textured asphalt and pavement with metre-based UVs, 0.32 m curve sampling for roads/rivers, and 1K floor textures for slabs. Roads add lane markings, crosswalks, reflective studs, drainage inlets, raised sidewalks, tactile paving and tree pits; rivers/ponds get three animated wave layers, foam, bank strata, reeds, rocks and lily pads; bridges add railing posts, piers, expansion joints and head reflectors. Quality still scales with the adaptive render presets.

## Run

```bash
npm install
npm run dev          # browser (http://localhost:1420)
npm run tauri:dev    # desktop shell
```

## Build desktop app

```bash
npm run tauri:build
```

Prebuilt Windows x64 artifacts are in `release/` (version 0.3.0, rebuilt 2026-10-31 02:43):

- `Civitas Studio.exe` — portable app (13.55 MB)
- `Civitas Studio_0.3.0_x64-setup.exe` — NSIS installer (3.46 MiB)
- `Civitas Studio_0.3.0_x64_en-US.msi` — MSI installer (4.84 MiB)

The later 2026-10-31 API-completeness + vision batch (58 tools, `capture_views`, Copilot vision, bundled skill) is source-only so far; run `npm run tauri:build` to produce artifacts that include it.

The previous 2026-10-28 build is kept in `release/old-0.3.0-1028/`.

## AI Copilot

- **内置规划器** — works offline and sends no data. Understands Chinese build/edit instructions and creates deterministic action plans.
- **大语言模型** — optional. Configure any OpenAI-compatible `/v1/chat/completions` endpoint, model and API key under the AI panel's gear icon. The key is stored only in local app storage, never in project files. Desktop requests go through the Rust backend to avoid browser CORS limits.
- **场景视觉** — with vision enabled, each request carries labelled JPEG screenshots of the live viewport (current view or overview + top + four compass directions). The model is told to inspect them before planning, the chat shows the exact frames it saw, and a result snapshot is attached after execution. Use `场景视觉 → 关闭` for text-only endpoints.
- AI edits are applied as a single history entry; undo once with `Ctrl+Z`. Destructive plans (currently clearing a floor) always ask for confirmation.

## External agent API (MCP / HTTP)

The desktop app exposes a local **Model Context Protocol** server so any third-party agent (Claude Desktop, Qoder, a Python script, `curl`) can drive the editor and do AI auto-modeling from outside. The server runs in the Rust shell and dispatches each call into the webview, so tools execute against the *live* scene you are looking at.

Open the panel with the plug icon in the top bar (or `Ctrl+K` → MCP tab) to see the real endpoint, start/stop the server, set the port/token, copy the client config, and watch a live call log.

| Endpoint | Purpose |
| --- | --- |
| `POST /mcp` | MCP Streamable HTTP — JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`). `GET /mcp` opens the SSE stream, `DELETE /mcp` closes it. |
| `GET /api` | Discovery document: name, version, transport, endpoints, auth mode. |
| `POST /api/tools/<name>` | Plain REST call for a single tool — no MCP client required. |

```jsonc
// mcpServers snippet
{
  "mcpServers": {
    "civitas-studio": {
      "url": "http://127.0.0.1:8971/mcp"
      // "headers": { "Authorization": "Bearer <token>" }   // only when a token is set
    }
  }
}
```

```bash
# No MCP client needed:
curl -X POST http://127.0.0.1:8971/api/tools/build_room \
  -H "Content-Type: application/json" \
  -d '{"roomType":"bedroom","width":5,"depth":4.5,"furnish":true}'
```

### Tools (58)

| Group | Tools |
| --- | --- |
| Read | `get_scene` `get_entity` `list_ui_controls` `list_models` `get_selection` |
| View & vision | `select_entity` `set_camera` `focus_selection` `set_transform_mode` `focus_all` `get_screenshot` `capture_views` |
| Build | `build_villa` `build_room` `add_wall` `add_opening` `add_slab` `cut_floor_opening` `furnish_room` `place_model` `draw_path` `add_pond` `add_roof` `add_vegetation` |
| Edit | `modify_selected` `update_entity` `duplicate_selected` `delete_selected` `delete_entities` `clear_level` `undo` `redo` |
| Levels & plan | `add_level` `set_active_level` `update_level` `duplicate_level` `delete_level` `complete_rooms` `set_plan_options` |
| Buildings | `list_building_templates` `place_building` `place_skyline` `generate_city` `furnish_building` `landscape_building` `enter_building` `exit_building` `set_building_mode` |
| Batch | `apply_actions` (same validated action plan the built-in Copilot uses) |
| Files & project | `save_project` `open_project` `new_project` `set_project_name` `import_model` `export_scene` |
| Settings | `set_settings` `set_quality` `set_visual_style` |

Every tool returns `{ ok, summary?, data?, scene, error? }` (`apply_actions` also reports `created` / `focusIds`), so an agent can read back the new entity counts and immediately screenshot the result for a visual feedback loop. `get_scene` also returns the live camera, settings and undo/redo labels; `get_entity` returns all editable fields plus bounds.

`update_entity` is the API equivalent of the Inspector and accepts kind-aware fields for every entity type (wall endpoints/height/thickness/color, opening style/offset/sill/openAngle/hinge, object x/z/rot/scale/scaleY, slab/roof dimensions and finish, path control points/lanes/railings, building x/z/rot). Slabs support real world-space holes; `add_slab` can cut them directly and `cut_floor_opening` cuts the slab above a stair/escalator (or every level above an elevator) using the object's exact footprint when given `objectId`. The Inspector's stairwell buttons and slab hole editor use the same exact-footprint logic. `add_wall` accepts an optional stable `id` so a single `apply_actions` plan can draw walls and then cut doors/windows into them atomically.

### Seeing the scene

| Tool | What it does |
| --- | --- |
| `get_screenshot` | One JPEG of the live viewport, or from an explicit `eye`/`target`/`view`. `clean=true` hides selection boxes and gizmos. |
| `capture_views` | Multi-angle capture: `views: ["overview","top","north","east","south","west",corners]`, `ring: 8` for an 8-direction orbit, optional `id`/`x,y,z` target, `distance`, `elevation`, `maxSize`. Each image carries a label plus camera eye/target. |
| `set_camera` | Move the live camera (`target/distance/azimuth/polar`, `eye`, `top=true`, `focusId`). |

Images are returned as **native MCP image content blocks** (`type: "image"`), followed by a text/structured copy of the result with the base64 removed and a `bytes` hint. REST callers still receive the full base64 inside `data.images[]`.

```bash
# Look at a building from eight angles, then read back the geometry
curl -X POST http://127.0.0.1:8971/api/tools/capture_views -H "Content-Type: application/json" \
  -d '{"ring":8,"elevation":32,"maxSize":900}'
```

The built-in Copilot uses the same capture pipeline: in AI settings choose **场景视觉 → 当前视角 / 多角度** to attach screenshots to each model request; after execution it appends a result snapshot to the chat. Text-only models fall back automatically to a text-only retry.

### Bundled agent skill (for AI assistants)

This repository ships a complete skill for agents that should operate the app:

```text
.agents/skills/drive-civitas-studio/
├── SKILL.md                 # trigger words, golden workflow, critical rules
├── references/api.md        # all 58 tools, result shape, limits
├── references/workflows.md  # recipes: custom house, city, interior, visual QA, import, troubleshooting
└── scripts/civitas.mjs      # status/scene/find/call/batch/views/shot CLI, saves screenshots
```

- **Project-level** — the skill lives in the generic `.agents/skills/` directory. Agents that support the Agent Skills convention can load it directly; otherwise point them at `SKILL.md` or install the user-level copy.
- **Install for all projects** — `npm run skill:install` copies it to `~/.agents/skills/drive-civitas-studio` (optional `--target <dir>`, `--dry-run`).
- **Other runtimes** — read `SKILL.md` directly and use `scripts/civitas.mjs` or the raw REST/MCP endpoints; no installation required.
- **AI receiving this repo** — read `AGENTS.md` for the complete handoff: start the desktop app, wait for MCP, install the skill, and verify with `node .agents/skills/drive-civitas-studio/scripts/civitas.mjs tools` (must print 58 tools).

### Safety model

- **Localhost only** — the listener binds `127.0.0.1`. Nothing is reachable from the network.
- **Optional bearer token** — send `Authorization: Bearer <token>` or `X-Mcp-Token`. Empty token means no auth (safe because of the localhost bind, but set one for shared machines).
- **Whitelisted actions, never code** — the server accepts only the validated tool/action schemas above. There is no endpoint that evaluates scripts.
- **Destructive calls need an explicit opt-in** — `clear_level`, `new_project` and `open_project` (and any `apply_actions` plan containing `clear_level`) fail unless you pass `confirm=true`; the editor also shows a confirmation dialog.
- **Your LLM key stays local** — the AI provider key lives in local app storage only, is never written into `.civitas` or exported scene files, and desktop inference goes through the Rust proxy.
- If the configured port is busy, startup tries the next ports (up to 24) and the panel shows the port actually in use. Requests time out after 120 s.

### Windows UI automation

Every interactive control receives a unique HTML `id`, which WebView2 exposes to Windows UI Automation as its **AutomationId**. Key controls use stable ids (`topbar-save`, `topbar-undo`, `tool-citygen`, `tool-building`, `city-generate`, `city-preset-*`, `building-template-*`, `catalog-model-*`, `level-*`, `mcp-*`, `ai-*`, `status-*`, `session-*`); the rest are generated from panel scope + section + label + role with automatic de-duplication. The 3D canvas is exposed as `civitas-viewport` (role `application`).

Call the `list_ui_controls` MCP tool (or inspect the UIA tree) to get every control's automation id, name, role, disabled state and screen rect. The desktop window starts **maximized**; WebView2 is launched with `--force-renderer-accessibility` so the full DOM tree is visible to UIA clients.

```bash
curl -X POST http://127.0.0.1:8971/api/tools/list_ui_controls   -H "Content-Type: application/json" -d '{"limit":1000}'
```

The API is desktop-only: in `npm run dev` (browser) the panel reports that the MCP server runs only in the desktop build.

## Controls

| Input | Action |
| --- | --- |
| Tool rail → Build City | Generate a whole district from a preset; one click, one undo step |
| Tool rail → Plan | Enter the top-down plan workspace; drag a rectangle to create a room |
| Left click | Select / place / add path or wall point |
| Alt + left drag | Pan camera |
| Alt + right drag | Orbit camera |
| WASD + wheel | Pan / zoom camera |
| R | Rotate placement preview (furniture, building, path snapping) or selected object |
| Shift | Temporarily disable snapping |
| Enter / right click | Finish wall or path |
| Esc | Cancel current operation / return to Select |
| Delete | Delete selected component |
| Ctrl+Z / Ctrl+Shift+Z | Undo / redo |
| Ctrl+D | Duplicate selected component |
| Ctrl+S / Ctrl+O | Save / open project |
| Ctrl+K | Open the AI Copilot |
| F | Focus selection |

## Project layout

- `src/editor` — engine, interaction, snapping/validation, parametric builders, multi-angle capture (`capture.ts`), shared wall/opening/slab factory (`entityOps.ts`), 2D plan-to-3D generation (`plan.ts`), whole-building templates and inside/outside sessions (`buildings.ts`), automatic room furnishing (`furnish.ts`), generated gardens (`landscape.ts`), one-click districts (`citygen.ts`), project I/O.
- `src/models/catalog` — one module per component model, auto-registered through `src/models/registry.ts`.
- `src/ai` — AI planner, action validation/execution, scene-building helpers, provider client and chat store.
- `src/mcp` — tool schemas and dispatcher, the Tauri event bridge, and the MCP connection settings store.
- `src/ui` — React panels, catalog, inspector, status bar and overlays.
- `src-tauri` — Tauri 2 shell, native file dialogs, file read/write commands, the AI provider proxy, and the axum MCP/HTTP server (`src/mcp.rs`).
- `.agents/skills/drive-civitas-studio` — agent skill in the generic Agent Skills layout: `SKILL.md`, 58-tool API reference, workflow recipes and the `civitas.mjs` CLI.
- `scripts/install-skill.mjs` — copies the bundled skill to `~/.agents/skills` (`npm run skill:install`).
- `AGENTS.md` — handoff instructions for AI agents receiving this repository (run the app, connect MCP, import the skill, verify 58 tools).
