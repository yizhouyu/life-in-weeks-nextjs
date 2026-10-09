// Automatic Milestone Color Generation
// Generates colors based on actual milestone events in the data

import { EventsData } from '../data/life-events'

// Life-phase palette ("E · Bright Grid").
// A single cobalt-grey tonal ramp: each milestone deepens the shade a step, so the
// grid reads as ink slowly filling in. The actual colours live in weeks.css as
// --phase-0 … --phase-10 (with dark-mode values), so phases follow the theme.
export const PHASE_COUNT = 11

// Get color for a given index; phases beyond the ramp hold the deepest step.
function getColorAtIndex(index: number): string {
  return `var(--phase-${Math.min(index, PHASE_COUNT - 1)})`
}

// Auto-detect milestone events from life events data
export function detectMilestoneEvents(lifeEvents: EventsData) {
  const milestoneEvents = Object.entries(lifeEvents)
    .filter(([, events]) => events.some(event => event.milestone))
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, events]) => ({
      date,
      event: events.find(e => e.milestone)!
    }))

  return milestoneEvents
}

// Generate milestone colors automatically based on detected events
export function generateMilestoneColors(lifeEvents: EventsData): string[] {
  const milestoneEvents = detectMilestoneEvents(lifeEvents)
  
  // Generate colors for each milestone
  const colors = milestoneEvents.map((_, index) => getColorAtIndex(index))
  
  // Validation
  if (colors.length !== milestoneEvents.length) {
    throw new Error(`Color count mismatch: ${colors.length} colors vs ${milestoneEvents.length} milestones`)
  }
  
  return colors
}