import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getEntity } from '../../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/entities/$id')({
  GET: async ({ request, params }) => {
    const entity = getEntity(params.id)
    if (!entity) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(entity), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
