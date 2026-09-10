import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getEvidence } from '../../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/evidence/$id')({
  GET: async ({ request, params }) => {
    const evidenceList = getEvidence()
    const item = evidenceList.find(e => e.id === params.id)
    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(item), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
