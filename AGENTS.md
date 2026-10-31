# AGENTS.md — Civitas Studio agent guide

If you are an AI assistant receiving this repository, read this file before changing code. It explains how to run the desktop app, connect to its local agent API, and import the bundled `drive-civitas-studio` skill from the generic Agent Skills directory.

## What this repo is

Civitas Studio is a Tauri 2 + React 19 + Three.js desktop city/building editor. The desktop shell serves a local MCP/REST API so an external agent can build, edit and screenshot the live scene. The API is desktop-only; `npm run dev` in a browser does not expose it.

## Goal A — connect an agent to the running app

1. Install dependencies: `npm install` (Node 24+).
2. Start the desktop app:
   - Source: `npm run tauri:dev` (requires the Rust toolchain), or
   - Prebuilt: `release/Civitas Studio.exe`. If `tools` returns fewer than 58 tools, the prebuilt predates the latest API; rebuild with `npm run tauri:build`.
3. Wait for the MCP service. The app auto-starts it on `127.0.0.1`, scanning ports 8971–8994:

```bash
curl -s http://127.0.0.1:8971/api
```

Expected JSON contains `"name": "civitas-studio"`. If port 8971 is busy, check `http://127.0.0.1:8972/api`…`8994`, or the port shown in the app's plug panel.
4. Verify the API and the skill CLI:

```bash
node .agents/skills/drive-civitas-studio/scripts/civitas.mjs status
node .agents/skills/drive-civitas-studio/scripts/civitas.mjs tools   # must print 58 tools
node .agents/skills/drive-civitas-studio/scripts/civitas.mjs scene --brief
```

5. Register the MCP server in the client when it supports MCP config:

```jsonc
{
  "mcpServers": {
    "civitas-studio": {
      "url": "http://127.0.0.1:8971/mcp"
      // "headers": { "Authorization": "Bearer <token>" }  // only if a token is configured
    }
  }
}
```

REST mirror: `POST http://127.0.0.1:8971/api/tools/<tool>` with a JSON body. No MCP client is required.

## Goal B — import the bundled skill

The canonical skill lives at `.agents/skills/drive-civitas-studio/` (vendor-neutral Agent Skills layout) and contains:

```text
SKILL.md
references/api.md        # all 58 tools
references/workflows.md  # recipes and troubleshooting
scripts/civitas.mjs      # zero-dependency CLI
```

### Project-level agents

The skill is already inside the repository at `.agents/skills/drive-civitas-studio`. Agents that support the Agent Skills convention can use it directly while this workspace is open; run `/skills reload` (or restart) and invoke `/drive-civitas-studio`. If your runtime does not scan project skills, point it at `SKILL.md` or install the user-level copy below.

### Install into the generic user-level skills directory

```bash
npm run skill:install
```

This copies the project skill to `~/.agents/skills/drive-civitas-studio` (Windows: `C:\Users\<you>\.agents\skills\drive-civitas-studio`) and replaces an older copy there. This is the same generic directory used by other Agent Skills. Options:

```bash
node scripts/install-skill.mjs --dry-run
node scripts/install-skill.mjs --target "D:/agent-skills"
```

Manual equivalent:

```powershell
# Windows PowerShell
Copy-Item -Recurse -Force ".agents\skills\drive-civitas-studio" "$env:USERPROFILE\.agents\skills\"
```

```bash
# macOS / Linux
mkdir -p ~/.agents/skills
cp -R .agents/skills/drive-civitas-studio ~/.agents/skills/
```

Then run `/skills reload` or restart the agent and invoke `/drive-civitas-studio`.

### Other agent runtimes

- If the runtime supports importing a local skill archive, zip the folder and import it with that runtime's skill installer:

```powershell
Compress-Archive -Path ".agents\skills\drive-civitas-studio" -DestinationPath "drive-civitas-studio.zip" -Force
```

- If it does not support skills, no installation is needed: read `.agents/skills/drive-civitas-studio/SKILL.md`, then use `scripts/civitas.mjs` or call the REST/MCP endpoints directly. `references/api.md` is the full tool catalog.

Do not copy or rewrite skill content into ad-hoc prompts; point the agent at `SKILL.md` so it loads the current version.

## What the skill enables

- Build/edit cities, villas, rooms, walls, doors/windows, slabs, roofs, roads, rivers, furniture and whole-building interiors.
- Inspect the live scene and capture labelled screenshots from named views, orbit rings, or an explicit eye/target.
- Close the visual loop: capture → inspect → fix → re-capture, then verify with entity counts.

Typical first commands (from the skill directory):

```bash
node scripts/civitas.mjs scene --brief
node scripts/civitas.mjs find --kind building
node scripts/civitas.mjs call build_room '{"roomType":"bedroom","width":6,"depth":5,"furnish":true}'
node scripts/civitas.mjs views --ring 6 --max 900 --out shots/room
```

## Editing the skill

Edit the repo copy at `.agents/skills/drive-civitas-studio/` only. Keep `SKILL.md` frontmatter name as `drive-civitas-studio`, then sync:

```bash
npm run skill:install
```

The CLI is plain Node ESM with no dependencies; test with:

```bash
node --check .agents/skills/drive-civitas-studio/scripts/civitas.mjs
node .agents/skills/drive-civitas-studio/scripts/civitas.mjs help
```

## Safety and repo rules

- The MCP server binds `127.0.0.1` only. Do not expose it to a network or send its token anywhere.
- `clear_level`, `new_project` and `open_project` are destructive and require explicit confirmation; save before replacing a project.
- Prefer `npm run build` and `npm run lint` before claiming code changes are complete.
- `PROGRESS.md` is local-only and gitignored. Do not add report files or local paths to the public repo.
- `release/` contains prebuilt binaries. Do not overwrite them unless the user asks to rebuild release artifacts.
- Current API: 58 tools. See `README.md` → “External agent API (MCP / HTTP)” for the human-facing overview.
