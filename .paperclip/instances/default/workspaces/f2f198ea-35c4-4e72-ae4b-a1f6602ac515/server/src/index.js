import Fastify from 'fastify'

// Simple in-memory persistence for agents keyed by companyId
const store = {
  agents: []
}

function createServer() {
  const app = Fastify({ logger: false })
  // intentionally not registering fastify-sensible to avoid an external dependency

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

  // variant used when companyId is supplied via URL param
  const bodySchemaNoCompany = {
    type: 'object',
    required: ['name', 'adapterType', 'adapterConfig'],
    properties: {
      name: { type: 'string' },
      adapterType: { type: 'string' },
      adapterConfig: adapterConfigSchema
    }
  }

  // central handler for creating agents (used by multiple routes)
  async function handleCreateAgent({ companyId, name, adapterType, adapterConfig }, reply) {
    if (adapterType === 'golang_dev_local') {
      if (!adapterConfig || !adapterConfig.cwd) {
        return reply.code(400).send('adapterConfig.cwd is required for golang_dev_local')
      }
      if (typeof adapterConfig.cwd !== 'string') {
        return reply.code(400).send('adapterConfig.cwd must be a string')
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

  // board-style route: POST /api/companies/:companyId/agents
  app.post('/api/companies/:companyId/agents', { schema: { body: bodySchemaNoCompany } }, async (req, reply) => {
    const body = req.body
    // ensure companyId is set from param if missing
    body.companyId = body.companyId || req.params.companyId
    return handleCreateAgent(body, reply)
  })

  app.get('/api/companies/:companyId/agents', async (req, reply) => {
    const companyId = req.params.companyId
    const agents = store.agents.filter(a => a.companyId === companyId)
    return { agents }
  })

  // expose store for tests
  app.decorate('store', store)

  return app
}

// Auto-start server when not running in test mode. Tests can disable auto-start by
// setting NODE_ENV=test or NO_SERVER_AUTO_START=1 in their environment.
if (process.env.NODE_ENV !== 'test' && process.env.NO_SERVER_AUTO_START !== '1') {
  const app = createServer()
  const port = process.env.PORT || 4000
  app.listen({ port }).then(() => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at http://localhost:${port}`)
  })
}

export default createServer
