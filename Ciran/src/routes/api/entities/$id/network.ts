import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getNeighbours, getEntity } from '../../../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/entities/$id/network')({
  GET: async ({ request, params }) => {
    const neighbours = getNeighbours(params.id)
    const entity = getEntity(params.id)
    
    if (!entity) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      nodes: [entity, ...neighbours.map(n => n.other)],
      edges: neighbours.map(n => n.relation)
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
