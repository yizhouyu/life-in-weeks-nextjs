'use client'

// WeeksGrid Component - Main grid with exact row-breaking algorithm
// Matches Gina's life-in-weeks.html logic exactly

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, forwardRef } from 'react'
import { EventsData, WeeksConfig } from '../data/life-events'
import { worldEvents } from '../data/world-events'
import { usPresidents } from '../data/us-presidents'
import { APP_CONFIG } from '../config/app-config'
import { EventFilters } from './event-filter'
import { formatDateString, getAge, getWeekStartSunday } from '../utils/date-processing'
import { 
  GridBox, 
  processBoxesIntoRows, 
  createTooltip, 
  createBirthdayLabel, 
  createBirthdayTooltip,
  createCompactEventLabel,
  shouldShowInCompact
} from '../utils/grid-layout'
// Auto-generated milestone colors
import { generateMilestoneColors } from '../utils/milestone-colors'
import { WeekBox } from './week-box'

// Extended event interface for merged events
interface MergedEvent {
  headline: string
  description?: string
  eventType: 'personal' | 'world' | 'president'
  milestone?: boolean
  color?: string
  category?: string
  party?: string
  president?: string
  termNumber?: number
  based?: string
  doing?: string
  association?: string
}

// Merge all event sources based on filters
function getMergedEvents(lifeEvents: EventsData, filters: EventFilters) {
  const merged: Record<string, MergedEvent[]> = {}

  // Add personal events if enabled and filter by category
  if (filters.showPersonalEvents) {
    Object.entries(lifeEvents).forEach(([date, events]) => {
      const filteredEvents = events.filter(event => {
        // If no category specified, include by default
        if (!event.category) return true
        // Otherwise check if this category is enabled
        return filters.personalCategories[event.category]
      })

      if (filteredEvents.length > 0) {
        merged[date] = filteredEvents.map(event => ({
          ...event,
          eventType: 'personal' as const
        }))
      }
    })
  }

  // Add world events if enabled
  if (filters.showWorldEvents) {
    Object.entries(worldEvents).forEach(([date, events]) => {
      if (!merged[date]) merged[date] = []
      merged[date].push(...events.map(event => ({
        ...event,
        eventType: 'world' as const
      })))
    })
  }

  // Add US presidents if enabled
  if (filters.showPresidents) {
    Object.entries(usPresidents).forEach(([date, events]) => {
      if (!merged[date]) merged[date] = []
      merged[date].push(...events.map(event => ({
        ...event,
        eventType: 'president' as const
      })))
    })
  }

  return merged
}

interface WeeksGridProps {
  isCompactMode: boolean
  lifeEvents: EventsData
  weeksConfig: WeeksConfig
  filters: EventFilters
  now: number
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Year gutter on the left of every row (label + gap), in px. Mirrored by --gutter in CSS.
function gutterFor(width: number): number {
  return width < 560 ? 30 : 48
}

function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const WeeksGrid = forwardRef<HTMLDivElement, WeeksGridProps>(
  function WeeksGrid({ isCompactMode, lifeEvents, weeksConfig, filters, now }, ref) {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const gridContainerRef = useRef<HTMLDivElement>(null)
  
  // Measure actual container width
  const measureContainer = useCallback(() => {
    if (gridContainerRef.current) {
      const rect = gridContainerRef.current.getBoundingClientRect()
      const newWidth = rect.width
      if (newWidth > 0) {
        setContainerWidth(newWidth)
      }
    }
  }, [])
  
  // Set up ResizeObserver for efficient container width monitoring
  useEffect(() => {
    if (!gridContainerRef.current) return
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width
        if (newWidth > 0) {
          setContainerWidth(newWidth)
        }
      }
    })
    
    resizeObserver.observe(gridContainerRef.current)
    
    // Initial measurement
    measureContainer()
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [measureContainer])
  
  // Also measure when compact mode changes (before paint on the client)
  useIsoLayoutEffect(() => {
    measureContainer()
  }, [isCompactMode, measureContainer])
  
  const startDate = new Date(weeksConfig.startDate)
  
  // Generate milestone colors from the life events
  const milestoneColors = generateMilestoneColors(lifeEvents)
  
  // Get merged events from all sources
  const mergedEvents = getMergedEvents(lifeEvents, filters)
  
  // Initialize milestone tracking
  const milestoneWeeks = new Set<string>()  // Track weeks with milestone events
  
  // Auto-coloring will be handled in the color map section
  
  // Generate all boxes chronologically
  const allBoxes: GridBox[] = []
  
  // Process each year from start to end
  for (let year = weeksConfig.startYear; year <= weeksConfig.endYear; year++) {
    const age = year - weeksConfig.startYear
    
    // Add birthday box if not the birth year
    if (age > 0) {
      const birthdayDate = new Date(year, startDate.getMonth(), startDate.getDate())
      const birthdayDateStr = formatDateString(birthdayDate)
      
      const birthdayBox: GridBox = {
        type: 'birthday',
        label: createBirthdayLabel(age, year, isCompactMode),
        date: birthdayDateStr,
        tooltip: createBirthdayTooltip(birthdayDateStr, age),
        borderClass: 'btn',
        backgroundClass: 'custom-color', // We'll apply inline styles
        age,
        year
      }
      
      allBoxes.push(birthdayBox)
    }
    
    // Process all 53 weeks in the year (0-52)
    for (let week = 0; week <= 52; week++) {
      let weekDate: Date
      
      if (age === 0) {
        // For birth year, start from the week containing the birth date
        if (week === 0) {
          // Week 0 is the week containing the birth date
          weekDate = getWeekStartSunday(startDate)
        } else {
          // Subsequent weeks are 7 days apart from week 0
          const baseWeek = getWeekStartSunday(startDate)
          weekDate = new Date(baseWeek)
          weekDate.setDate(weekDate.getDate() + (week * 7))
        }
      } else {
        // For other years, start from anniversary date
        const anniversaryDate = new Date(year, startDate.getMonth(), startDate.getDate())
        anniversaryDate.setDate(anniversaryDate.getDate() + (week * 7))
        weekDate = getWeekStartSunday(anniversaryDate)
      }
      
      // Skip if this week is beyond the next birthday
      const nextBirthday = new Date(year + 1, startDate.getMonth(), startDate.getDate())
      if (weekDate >= nextBirthday) continue
      
      const weekDateStr = formatDateString(weekDate)
      const weekAge = getAge(weekDate, startDate)
      
      // Date formatting now working correctly
      
      // Check if this week has any events on the week start date
      let eventsForWeek = mergedEvents[weekDateStr]
      let actualEventDate = weekDateStr // Default to week start
      
      // Also check each day within this week for events (like Gina's implementation)
      for (let day = 0; day < 7; day++) {
        const dayDate = new Date(weekDate)
        dayDate.setDate(dayDate.getDate() + day)
        
        // Don't check dates beyond next birthday
        const nextBirthday = new Date(year + 1, startDate.getMonth(), startDate.getDate())
        if (dayDate >= nextBirthday) break
        
        const dayDateStr = formatDateString(dayDate)
        const eventsForDay = mergedEvents[dayDateStr]
        
        if (eventsForDay && eventsForDay.length > 0) {
          // Add milestone weeks based on week start dates
          const milestoneEvents = eventsForDay.filter(e => e.eventType === 'personal' && e.milestone)
          if (milestoneEvents.length > 0) {
            // Add the week start date to milestone weeks since that's what the box.date will be
            milestoneWeeks.add(weekDateStr)
          }
          // Use the day's events instead of week events
          eventsForWeek = eventsForDay
          actualEventDate = dayDateStr // Store the actual event date
          break // Use first day with events in this week
        }
      }
      
      if (eventsForWeek && eventsForWeek.length > 0) {
        // Pick the most important event (milestone first, then first event)
        const primaryEvent = eventsForWeek.find(e => e.eventType === 'personal' && e.milestone) || eventsForWeek[0]
        
        // In compact mode, check if we should show this event
        if (isCompactMode && !shouldShowInCompact(primaryEvent.headline)) {
          // Skip this event in compact mode, treat as empty week
          const weekBox: GridBox = {
            type: 'week',
            label: '',
            date: weekDateStr,
            tooltip: createTooltip(weekDateStr, undefined),
            borderClass: 'btn',
            backgroundClass: 'custom-color',
            age: weekAge,
            year
          }
          allBoxes.push(weekBox)
        } else {
          // Create tooltip only if there are events with descriptions
          const eventsWithDescriptions = eventsForWeek.filter(e => e.description)
          const allEventDescriptions = eventsWithDescriptions.length > 0
            ? eventsWithDescriptions.map(e => {
                // Add emoji prefix for world/president events to distinguish them
                const prefix = e.eventType === 'world' ? '🌍 ' :
                              e.eventType === 'president' ? '🇺🇸 ' : ''
                return prefix + e.description
              }).join('\n')
            : undefined
          
          const eventLabel = isCompactMode ? createCompactEventLabel(primaryEvent.headline) : primaryEvent.headline
          
          const eventBox: GridBox = {
            type: 'event',
            label: eventLabel,
            date: weekDateStr,
            tooltip: createTooltip(
              weekDateStr, 
              allEventDescriptions, 
              actualEventDate, 
              primaryEvent.eventType, 
              APP_CONFIG.showPersonalEventDates
            ),
            borderClass: 'btn',
            backgroundClass: 'custom-color', // We'll apply inline styles
            age: weekAge,
            year,
            eventType: primaryEvent.eventType, // Use primary event type for styling
            milestone: primaryEvent.eventType === 'personal' && !!primaryEvent.milestone,
            headline: primaryEvent.headline
          }
          
          allBoxes.push(eventBox)
        }
      } else {
        // Empty week box
        const weekBox: GridBox = {
          type: 'week',
          label: '',
          date: weekDateStr,
          tooltip: createTooltip(weekDateStr, undefined),
          borderClass: 'btn',
          backgroundClass: 'custom-color', // We'll apply inline styles
          age: weekAge,
          year
        }
        
        allBoxes.push(weekBox)
      }
    }
  }
  
  // All events are now properly processed
  
  // Group boxes by decade for proper section organization
  // windowWidth state triggers re-render when screen size changes for responsive layout
  // const decadeSections = groupBoxesByDecade(allBoxes) // Unused for now
  
  // Container width changes automatically trigger re-renders through state
  
  // Create a map to store the color for each box based on milestone progression
  const boxColorMap = new Map<string, string>()
  let colorIndex = 0
  let currentBoxColor = milestoneColors[0]
  
  // First pass: identify all milestone events and their weeks
  const milestoneEventDates = new Set<string>()
  Object.entries(mergedEvents).forEach(([date, events]) => {
    events.forEach(event => {
      if (event.eventType === 'personal' && event.milestone) {
        milestoneEventDates.add(date)
        milestoneWeeks.add(date)
      }
    })
  })
  
  // Also add milestone weeks based on which week boxes actually contain milestone events
  for (const box of allBoxes) {
    if (box.type === 'event') {
      const eventsForBox = mergedEvents[box.date]
      if (eventsForBox?.some(event => event.eventType === 'personal' && event.milestone)) {
        milestoneWeeks.add(box.date)
      }
    }
  }
  
  // Second pass: assign colors based on chronological progression
  // Sort all boxes by date to ensure chronological processing
  const sortedBoxes = [...allBoxes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  for (const box of sortedBoxes) {
    // Check if this box's week contains a milestone event
    if (milestoneWeeks.has(box.date)) {
      colorIndex++
      if (colorIndex < milestoneColors.length) {
        currentBoxColor = milestoneColors[colorIndex]
      }
    }
    
    // Also check for custom color overrides from events
    const eventsForBox = mergedEvents[box.date]
    if (eventsForBox) {
      for (const event of eventsForBox) {
        if (event.eventType === 'personal' && event.milestone && event.color) {
          currentBoxColor = event.color
        }
      }
    }
    
    boxColorMap.set(box.date, currentBoxColor)
  }
  
  // Process all boxes together to get proper row numbering with dynamic container width.
  // Rows are only laid out once the container has been measured on the client, so the
  // server HTML and the hydrating render agree (no layout guess from window size).
  const gutter = gutterFor(containerWidth)
  const cellsWidth = containerWidth - gutter
  const allRows = containerWidth > 0 ? processBoxesIntoRows(allBoxes, isCompactMode, cellsWidth) : []

  let lastYearLabel = -1
  const seenDecades = new Set<number>()

  return (
    <div 
      ref={(el) => {
        gridContainerRef.current = el
        if (ref) {
          if (typeof ref === 'function') {
            ref(el)
          } else {
            ref.current = el
          }
        }
      }}
      className={`weeks-grid-container ${isCompactMode ? 'compact-mode' : 'standard-mode'} ${containerWidth > 0 ? 'is-ready' : ''}`}
      style={{ '--gutter': `${gutter}px` } as React.CSSProperties}
    >
      {allRows.map((row, globalRowIndex) => {
        // Year gutter: calendar year of the row's first week, shown when it changes
        const firstYear = parseLocalDate(row[0].date).getFullYear()
        const showYear = firstYear !== lastYearLabel
        if (showYear) lastYearLabel = firstYear

        // Decade anchors for the sticky nav: first row, then each row holding a 10th birthday
        let anchorId: string | undefined
        if (globalRowIndex === 0) {
          anchorId = 'decade-0'
          seenDecades.add(0)
        } else {
          const decadeBirthday = row.find(b => b.type === 'birthday' && b.age !== undefined && b.age % 10 === 0 && !seenDecades.has(b.age))
          if (decadeBirthday?.age !== undefined) {
            anchorId = `decade-${decadeBirthday.age}`
            seenDecades.add(decadeBirthday.age)
          }
        }
        // Ages ascend along a row; the last box's age makes a decade row count as that decade
        const rowAge = row[row.length - 1].age ?? row[0].age ?? 0

        return (
          <div
            key={`row-${globalRowIndex}`}
            id={anchorId}
            className="row-wrapper"
            data-age={rowAge}
          >
            <span className={`row-year ${showYear ? '' : 'is-blank'} ${firstYear % 5 === 0 ? 'is-5' : ''}`} aria-hidden={!showYear}>
              {showYear ? firstYear : ''}
            </span>
            <div className="row-cells">
              {row.map((box, boxIndex) => {
                const boxStart = parseLocalDate(box.date).getTime()
                const isFuture = boxStart > now
                const isNow = box.type !== 'birthday' && boxStart <= now && now < boxStart + WEEK_MS
                const phase = boxColorMap.get(box.date) || milestoneColors[0] || 'var(--phase-0)'

                const classes = [
                  isFuture ? 'future-date' : 'lived',
                  isNow ? 'is-now' : '',
                  box.eventType ? `ev-${box.eventType}` : '',
                  box.milestone ? 'is-milestone' : '',
                ].filter(Boolean).join(' ')

                return (
                  <WeekBox
                    key={`${box.date}-${boxIndex}`}
                    box={box}
                    className={classes}
                    style={{ '--ph': phase } as React.CSSProperties}
                    isCompactMode={isCompactMode}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
})
