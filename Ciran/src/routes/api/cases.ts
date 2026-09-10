import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getCases } from '../../lib/ciran-service'

export const APIRoute = createAPIFileRoute('/api/cases')({
  GET: async () => {
    const cases = getCases()
    return new Response(JSON.stringify(cases), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
