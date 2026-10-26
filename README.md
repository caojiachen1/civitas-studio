# Civitas Studio · 城市建造工坊

A desktop 3D city & building construction studio built with Tauri 2, React 19 and Three.js. Draw freeform roads, rivers and bridges, assemble walls/doors/windows/roofs, furnish interiors from a 130-piece catalog, and export the result as GLB/glTF/OBJ/STL. A built-in AI Copilot can also build and edit the scene from natural-language instructions.

## Highlights

- **AI Copilot** — press `Ctrl+K` and describe what you want. It turns Chinese/English requests into validated editor actions: whole villas, individual furnished rooms, furniture, freeform roads/rivers/bridges/ponds, vegetation, roofs, levels, selected-object edits, and opening/closing doors to a chosen angle. The local planner works offline; an optional OpenAI-compatible provider can be configured for stronger language understanding. Every AI plan is a single undo step, and dangerous actions require confirmation.
- **External agent API (MCP)** — the desktop build serves MCP over HTTP on `127.0.0.1` plus a plain REST mirror, exposing 27 tools (`build_room`, `place_model`, `draw_path`, `apply_actions`, `get_screenshot`, …). Any third-party agent can connect to the running app and drive AI auto-modeling end to end. Localhost-only, optional bearer token, whitelisted action schemas, and destructive calls require `confirm=true`.
- **Freeform infrastructure** — roads, rivers, footpaths, bridges and fences are smooth Catmull-Rom curves with draggable control points. Close a river path to fill a pond; bridges get automatic railings, piers and ramps.
- **Component library** — 130 modeled components across living, bedroom, dining, kitchen, bathroom, office, laundry, outdoor, street, vegetation, vehicles and structure categories, plus imported custom models.
- **Construction feedback** — valid placements use a light-grey ghost preview; invalid placements turn red with a specific reason (collision, wall fit, overlap, water, road-only/water-only rules). Walls, path endpoints and wall-backed furniture snap automatically with generous, distance-aware thresholds.
- **Parametric building** — walls support doors/windows with real openings and frames; doors can be left closed or opened to any angle from -135° to 135° with left/right hinges (single, double and glass leaves swing around the hinge; sliding panels slide along the wall). Slabs have generated surface textures; automatic roofs recognize closed wall loops in gable/hip/flat/shed styles; multi-level floors and roof hiding make interior work easy.
- **Project workflow** — autosave to local storage, `.civitas` JSON projects, undo/redo, copy/delete, native save/open dialogs, and GLB/glTF/OBJ/STL import & export.
- **Performance** — shared merged geometry, a single vertex-PBR material per model batch, batched wall/path meshes, on-demand shadow updates, incremental scene sync, frustum culling and a capped pixel ratio. The bundled sample runs at ~180 FPS / ~160 draw calls in headless Chromium, ~200k triangles.

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

Prebuilt Windows x64 artifacts are in `release/` (version 0.3.0):

- `Civitas Studio.exe` — portable app
- `Civitas Studio_0.3.0_x64-setup.exe` — NSIS installer
- `Civitas Studio_0.3.0_x64_en-US.msi` — MSI installer

## AI Copilot

- **内置规划器** — works offline and sends no data. Understands Chinese build/edit instructions and creates deterministic action plans.
- **大语言模型** — optional. Configure any OpenAI-compatible `/v1/chat/completions` endpoint, model and API key under the AI panel's gear icon. The key is stored only in local app storage, never in project files. Desktop requests go through the Rust backend to avoid browser CORS limits.
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

### Tools (27)

| Group | Tools |
| --- | --- |
| Read | `get_scene` `list_models` `get_selection` `get_screenshot` |
| View | `select_entity` `set_camera` `focus_all` |
| Build | `build_villa` `build_room` `furnish_room` `place_model` `draw_path` `add_pond` `add_roof` `add_vegetation` |
| Edit | `modify_selected` `delete_selected` `clear_level` `undo` `redo` |
| Levels | `add_level` `set_active_level` |
| Batch | `apply_actions` (same validated action plan the built-in Copilot uses) |
| Files | `save_project` `export_scene` `new_project` |
| Runtime | `set_quality` |

Every mutating tool returns `{ ok, summary, created?, focusIds?, scene }`, so an agent can read back the new entity counts and immediately screenshot the result for a visual feedback loop. `get_screenshot` returns a downscaled JPEG as base64. With a door selected, `modify_selected` also accepts `openAngle` (-135…135, `0` = closed, negative swings to the other side) and `hinge` (`left` / `right`).

### Safety model

- **Localhost only** — the listener binds `127.0.0.1`. Nothing is reachable from the network.
- **Optional bearer token** — send `Authorization: Bearer <token>` or `X-Mcp-Token`. Empty token means no auth (safe because of the localhost bind, but set one for shared machines).
- **Whitelisted actions, never code** — the server accepts only the validated tool/action schemas above. There is no endpoint that evaluates scripts.
- **Destructive calls need an explicit opt-in** — `clear_level` and `new_project` (and any `apply_actions` plan containing them) fail unless you pass `confirm=true`; the editor also shows a confirmation dialog.
- **Your LLM key stays local** — the AI provider key lives in local app storage only, is never written into `.civitas` or exported scene files, and desktop inference goes through the Rust proxy.
- If the configured port is busy, startup tries the next ports (up to 24) and the panel shows the port actually in use. Requests time out after 120 s.

The API is desktop-only: in `npm run dev` (browser) the panel reports that the MCP server runs only in the desktop build.

## Controls

| Input | Action |
| --- | --- |
| Left click | Select / place / add path or wall point |
| Alt + left drag | Pan camera |
| Alt + right drag | Orbit camera |
| WASD + wheel | Pan / zoom camera |
| R | Rotate placement preview or selected object |
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

- `src/editor` — engine, interaction, snapping/validation, parametric builders, project I/O.
- `src/models/catalog` — one module per component model, auto-registered through `src/models/registry.ts`.
- `src/ai` — AI planner, action validation/execution, scene-building helpers, provider client and chat store.
- `src/mcp` — tool schemas and dispatcher, the Tauri event bridge, and the MCP connection settings store.
- `src/ui` — React panels, catalog, inspector, status bar and overlays.
- `src-tauri` — Tauri 2 shell, native file dialogs, file read/write commands, the AI provider proxy, and the axum MCP/HTTP server (`src/mcp.rs`).
