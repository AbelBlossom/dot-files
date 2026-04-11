import { describe, it, expect, beforeEach } from 'vitest'
import createServer from '../index.js'

let app

describe('POEMS API', () => {
  beforeEach(() => {
    app = createServer()
    if (typeof app.resetPoemsTable === 'function') app.resetPoemsTable()
  })

  it('returns empty list initially', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/poems' })
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.poems).toBeDefined()
    expect(body.poems).toHaveLength(0)
  })

  it('creates a poem and lists it', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/poems', payload: { title: 't', body: 'b' } })
    expect(res.statusCode).toBe(201)
    const created = JSON.parse(res.payload).poem
    expect(created).toBeDefined()
    const list = await app.inject({ method: 'GET', url: '/api/poems' })
    const listBody = JSON.parse(list.payload)
    expect(listBody.poems[0].id).toBe(created.id)
  })
})
