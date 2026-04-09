import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
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

    const res = await request(app.server).post('/api/agents').send(payload)
    expect(res.status).toBe(201)
    expect(res.body.agent).toBeDefined()
    expect(res.body.agent.adapterConfig.cwd).toBe('/repo/workspace')
    // verify listing endpoint
    const list = await request(app.server).get('/api/companies/company_1/agents')
    expect(list.status).toBe(200)
    expect(list.body.agents).toHaveLength(1)
    expect(list.body.agents[0].id).toBe(res.body.agent.id)
  })

  it('returns 400 if cwd missing for golang_dev_local', async () => {
    const payload = {
      companyId: 'company_1',
      name: 'bad agent',
      adapterType: 'golang_dev_local',
      adapterConfig: {}
    }

    const res = await request(app.server).post('/api/agents').send(payload)
    expect(res.status).toBe(400)
    expect(res.text).toContain('adapterConfig.cwd is required')
  })
})
