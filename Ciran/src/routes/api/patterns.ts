import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getPatterns } from '../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/patterns')({
  GET: async () => {
    return new Response(JSON.stringify(getPatterns()), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
