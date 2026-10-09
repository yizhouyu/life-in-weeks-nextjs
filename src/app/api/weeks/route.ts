// Weeks-lived count for the main site (yizhouyu.dev) — returns the number only, never the birth date.
import { SERVER_CONFIG } from '../../lib/server-config'

export const dynamic = 'force-dynamic'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function GET() {
  const [y, m, d] = SERVER_CONFIG.BIRTH_DATE.split('-').map(Number)
  const weeks = Math.max(0, Math.floor((Date.now() - new Date(y, m - 1, d).getTime()) / WEEK_MS))
  return Response.json(
    { weeks },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
