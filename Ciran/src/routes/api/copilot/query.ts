import { createAPIFileRoute } from '@tanstack/react-start/api'
import { askCopilot } from '../../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/copilot/query')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const query = body.query
      if (!query) {
        return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400 })
      }
      
      const response = askCopilot(query)
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
    }
  },
})
