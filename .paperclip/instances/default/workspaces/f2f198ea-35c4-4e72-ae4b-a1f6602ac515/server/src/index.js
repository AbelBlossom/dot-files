import Fastify from 'fastify'
import sensible from 'fastify-sensible'

// Simple in-memory persistence for agents keyed by companyId
const store = {
  agents: []
}

function createServer() {
  const app = Fastify({ logger: false })
  app.register(sensible)

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

  app.post('/api/agents', { schema: { body: bodySchema } }, async (req, reply) => {
    const { companyId, name, adapterType, adapterConfig } = req.body

    // Adapter-specific validation
    if (adapterType === 'golang_dev_local') {
      if (!adapterConfig || !adapterConfig.cwd) {
        return reply.badRequest('adapterConfig.cwd is required for golang_dev_local')
      }

      // enforce type of cwd
      if (typeof adapterConfig.cwd !== 'string') {
        return reply.badRequest('adapterConfig.cwd must be a string')
      }
    }

    const id = `agent_${Date.now()}_${Math.floor(Math.random()*1000)}`
    const agent = { id, companyId, name, adapterType, adapterConfig }

    store.agents.push(agent)

    reply.code(201)
    return { agent }
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

if (process.env.NODE_ENV !== 'test') {
  const app = createServer()
  const port = process.env.PORT || 4000
  app.listen({ port }).then(() => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at http://localhost:${port}`)
  })
}

export default createServer
