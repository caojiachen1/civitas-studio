#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(repoRoot, '.agents', 'skills', 'drive-civitas-studio')

function usage() {
  console.log(`Install the bundled drive-civitas-studio skill.

Usage:
  node scripts/install-skill.mjs [--target <skills-dir>] [--dry-run]

Defaults:
  target : ~/.agents/skills
  source : <repo>/.agents/skills/drive-civitas-studio

Examples:
  node scripts/install-skill.mjs
  node scripts/install-skill.mjs --target "D:/agent-skills"
`)
}

const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) {
  usage()
  process.exit(0)
}

let targetRoot = join(homedir(), '.agents', 'skills')
for (let index = 0; index < args.length; index++) {
  const arg = args[index]
  if (arg === '--target') {
    const value = args[index + 1]
    if (!value) {
      console.error('CIVITAS ERROR: --target requires a directory path')
      process.exit(1)
    }
    targetRoot = resolve(value)
    index++
  } else if (arg.startsWith('--target=')) {
    const value = arg.slice('--target='.length)
    if (!value) {
      console.error('CIVITAS ERROR: --target requires a directory path')
      process.exit(1)
    }
    targetRoot = resolve(value)
  }
}
const dryRun = args.includes('--dry-run')

if (!existsSync(join(source, 'SKILL.md'))) {
  console.error(`CIVITAS ERROR: skill source not found at ${source}`)
  process.exit(1)
}

const target = join(targetRoot, 'drive-civitas-studio')
const resolvedTarget = resolve(target)
if (resolvedTarget === source || resolvedTarget.startsWith(source + sep)) {
  console.error('CIVITAS ERROR: refusing to install over the repository skill source')
  process.exit(1)
}
console.log(`Source : ${source}`)
console.log(`Target : ${target}`)

if (dryRun) {
  console.log('Dry run: no files written.')
  process.exit(0)
}

mkdirSync(targetRoot, { recursive: true })
if (existsSync(target)) {
  console.log('Replacing the existing skill copy.')
  rmSync(target, { recursive: true, force: true })
}
cpSync(source, target, { recursive: true })

const skillFile = join(target, 'SKILL.md')
const text = readFileSync(skillFile, 'utf8').replace(/\r\n/g, '\n')
if (!text.startsWith('---\nname: drive-civitas-studio')) {
  console.error(`CIVITAS ERROR: installed SKILL.md looks invalid: ${skillFile}`)
  process.exit(1)
}

console.log('')
console.log('Installed drive-civitas-studio.')
console.log('Reload skills with /skills reload (or restart the agent), then invoke /drive-civitas-studio.')
console.log('The project-level copy at .agents/skills/drive-civitas-studio is already available to agents opened in this repo.')
console.log('')
console.log('Verify the app API once the desktop app is running with MCP enabled:')
console.log(`  node "${join(target, 'scripts', 'civitas.mjs')}" status`)
