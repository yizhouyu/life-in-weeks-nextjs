// Home-ruler milestones for the main site (yizhouyu.dev) — month-level only, never the full birth date.
import { SERVER_CONFIG } from '../../lib/server-config'
import { createDerivedConfig } from '../../config/app-config'
import { createLifeEvents } from '../../data/life-events'

export const dynamic = 'force-dynamic'

export function GET() {
  const birthDate = SERVER_CONFIG.BIRTH_DATE
  const events = createLifeEvents({ birthDate }, createDerivedConfig(birthDate))
  const milestones = Object.entries(events)
    .flatMap(([date, list]) => list.filter(e => e.home).map(e => ({
      month: date.slice(0, 7),
      label: e.homeLabel ?? e.headline.replace(/^\P{L}+/u, '').trim(),
    })))
    .sort((a, b) => a.month.localeCompare(b.month))
  return Response.json(
    { milestones },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
