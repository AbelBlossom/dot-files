import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('golang agent docs', () => {
  it('workspace contains AGENTS.md and example task for golang agent', () => {
    // server tests run with cwd at the server package root; agents are commonly one level up
    // but in some workspaces the path may be nested under the paperclip instance path.
    // Walk upward from the current working directory and try to find the agents/golang folder
    function findAgentsDir(startDir, maxUp = 6) {
      let dir = startDir
      for (let i = 0; i < maxUp; i++) {
        try {
          const candidates = fs.readdirSync(dir)
          for (const entry of candidates) {
            const candidatePath = path.join(dir, entry)
            // look for nested agents/golang under this entry
            const nested = path.join(candidatePath, 'agents', 'golang')
            if (fs.existsSync(nested)) return nested
          }
        } catch (e) {
          // ignore permission errors
        }
        const parent = path.dirname(dir)
        if (parent === dir) break
        dir = parent
      }
      return null
    }

    const agentsDir = findAgentsDir(process.cwd())
    if (!agentsDir) throw new Error('golang agent docs not found in workspace')
    const agentsFile = path.join(agentsDir, 'AGENTS.md')
    const exampleFile = path.join(agentsDir, 'example-task.md')

    expect(fs.existsSync(agentsFile)).toBe(true)
    expect(fs.existsSync(exampleFile)).toBe(true)

    const content = fs.readFileSync(agentsFile, 'utf8')
    expect(content).toContain('Golang Dev Agent Instructions')
  })
})
