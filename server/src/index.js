import Fastify from 'fastify'
import fs from 'fs'
import path from 'path'

// Simple in-memory persistence for agents keyed by companyId
const store = {
  agents: []
}

function createServer() {
  const app = Fastify({ logger: false })

  // Basic JSON schema for incoming agent creation
  const adapterConfigSchema = {
    type: 'object',
    properties: {
      cwd: { type: 'string' },
      instructionsFilePath: { type: 'string' }
    },
    additionalProperties: true
  }

  const bodySchema = {
    type: 'object',
    required: ['companyId', 'name', 'adapterType', 'adapterConfig'],
    properties: {
      companyId: { type: 'string' },
      name: { type: 'string' },
      adapterType: { type: 'string' },
      adapterConfig: adapterConfigSchema
    }
  }

  const bodySchemaNoCompany = {
    type: 'object',
    required: ['name', 'adapterType', 'adapterConfig'],
    properties: {
      name: { type: 'string' },
      adapterType: { type: 'string' },
      adapterConfig: adapterConfigSchema
    }
  }

  async function handleCreateAgent({ companyId, name, adapterType, adapterConfig }, reply) {
    if (adapterType === 'golang_dev_local') {
      if (!adapterConfig || !adapterConfig.cwd) {
        return reply.code(400).send('adapterConfig.cwd is required for golang_dev_local')
      }
      if (typeof adapterConfig.cwd !== 'string') {
        return reply.code(400).send('adapterConfig.cwd must be a string')
      }
      if (adapterConfig.instructionsFilePath) {
        try {
          const full = path.resolve(String(adapterConfig.cwd), String(adapterConfig.instructionsFilePath))
          if (!fs.existsSync(full)) {
            return reply.code(400).send(`instructionsFilePath not found: ${String(adapterConfig.instructionsFilePath)}`)
          }
        } catch (e) {
          return reply.code(400).send('invalid adapterConfig.instructionsFilePath')
        }
      }
    }

    const id = `agent_${Date.now()}_${Math.floor(Math.random()*1000)}`
    const agent = { id, companyId, name, adapterType, adapterConfig }
    store.agents.push(agent)
    reply.code(201)
    return { agent }
  }

  app.post('/api/agents', { schema: { body: bodySchema } }, async (req, reply) => {
    return handleCreateAgent(req.body, reply)
  })

  app.post('/api/companies/:companyId/agents', { schema: { body: bodySchemaNoCompany } }, async (req, reply) => {
    const body = req.body
    body.companyId = body.companyId || req.params.companyId
    return handleCreateAgent(body, reply)
  })

  app.get('/api/companies/:companyId/agents', async (req, reply) => {
    const companyId = req.params.companyId
    const agents = store.agents.filter(a => a.companyId === companyId)
    return { agents }
  })

  // Simple file-backed persistence for poems
  const poemsFile = process.env.POEMS_FILE || path.resolve(process.cwd(), 'data', 'poems.json')
  try { fs.mkdirSync(path.dirname(poemsFile), { recursive: true }) } catch (e) {}

  function readPoems() {
    try { const raw = fs.readFileSync(poemsFile, 'utf8'); return JSON.parse(raw) } catch (e) { return [] }
  }
  function writePoems(arr) { fs.writeFileSync(poemsFile, JSON.stringify(arr, null, 2), 'utf8') }
  function resetPoemsTable() { writePoems([]) }

  app.get('/api/poems', async (req, reply) => {
    const rows = readPoems()
    return { poems: rows }
  })

  app.post('/api/poems', { schema: { body: { type: 'object', required: ['title','body'], properties: { title: { type: 'string' }, body: { type: 'string' } } } } }, async (req, reply) => {
    const id = `poem_${Date.now()}_${Math.floor(Math.random()*1000)}`
    const createdAt = new Date().toISOString()
    const poem = { id, title: req.body.title, body: req.body.body, createdAt }
    const arr = readPoems()
    arr.unshift(poem)
    writePoems(arr)
    reply.code(201)
    return { poem }
  })

  app.decorate('store', store)
  app.decorate('resetPoemsTable', resetPoemsTable)

  return app
}

if (process.env.NODE_ENV !== 'test' && process.env.NO_SERVER_AUTO_START !== '1') {
  const app = createServer()
  const port = process.env.PORT || 4000
  app.listen({ port }).then(() => { console.log(`Server listening at http://localhost:${port}`) })
}

export default createServer
