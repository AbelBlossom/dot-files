import { describe, it, expect, beforeEach } from 'vitest'
import createServer from '../index.js'

let app

describe('POST /api/agents', () => {
  beforeEach(() => {
    app = createServer()
    // reset in-memory store
    app.store.agents.length = 0
  })

  it('creates golang_dev_local agent when cwd provided', async () => {
    const payload = {
      companyId: 'company_1',
      name: 'golang agent',
      adapterType: 'golang_dev_local',
      adapterConfig: {
        cwd: '/repo/workspace',
        instructionsFilePath: 'AGENTS.md'
      }
    }

    const res = await app.inject({ method: 'POST', url: '/api/agents', payload })
    expect(res.statusCode).toBe(201)
    const body = JSON.parse(res.payload)
    expect(body.agent).toBeDefined()
    expect(body.agent.adapterConfig.cwd).toBe('/repo/workspace')
    // verify listing endpoint
    const listRes = await app.inject({ method: 'GET', url: '/api/companies/company_1/agents' })
    expect(listRes.statusCode).toBe(200)
    const listBody = JSON.parse(listRes.payload)
    expect(listBody.agents).toHaveLength(1)
    expect(listBody.agents[0].id).toBe(body.agent.id)
  })

  it('returns 400 if cwd missing for golang_dev_local', async () => {
    const payload = {
      companyId: 'company_1',
      name: 'bad agent',
      adapterType: 'golang_dev_local',
      adapterConfig: {}
    }

    const res = await app.inject({ method: 'POST', url: '/api/agents', payload })
    expect(res.statusCode).toBe(400)
    expect(res.payload).toContain('adapterConfig.cwd is required')
  })
})
