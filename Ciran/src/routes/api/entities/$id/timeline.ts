import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getTimeline } from '../../../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/entities/$id/timeline')({
  GET: async ({ request, params }) => {
    // Filter timeline where entities array includes the id
    const allEvents = getTimeline()
    const entityEvents = allEvents.filter(e => e.entities.includes(params.id))
    
    return new Response(JSON.stringify(entityEvents), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
