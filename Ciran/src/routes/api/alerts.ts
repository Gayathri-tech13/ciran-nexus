import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getIntelligenceAlerts } from '../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/alerts')({
  GET: async () => {
    return new Response(JSON.stringify(getIntelligenceAlerts()), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
