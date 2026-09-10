import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getCrossCaseLinks } from '../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/cross-case')({
  GET: async () => {
    return new Response(JSON.stringify(getCrossCaseLinks()), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
