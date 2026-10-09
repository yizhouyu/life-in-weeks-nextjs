'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { SiteNav } from './site-nav'
import { StickyHeader } from './sticky-header'
import { IntroContent } from './intro-content'
import { WeeksGrid } from './weeks-grid'
import { Footer } from './footer'
import { EventFilter, EventFilters } from './event-filter'
import { APP_CONFIG, DerivedConfig } from '../config/app-config'
import { EventsData, WeeksConfig } from '../data/life-events'

interface LifeWeeksClientProps {
  lifeEvents: EventsData
  weeksConfig: WeeksConfig
  derivedConfig: DerivedConfig
  /** Timestamp of the server render, so the first client render hydrates identically. */
  renderedAt: number
}

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Client Component for Life in Weeks visualization
 * Handles interactive state like compact mode toggle and event filters
 */
export function LifeWeeksClient({ lifeEvents, weeksConfig, derivedConfig, renderedAt }: LifeWeeksClientProps) {
  const [isCompactMode, setIsCompactMode] = useState<boolean>(APP_CONFIG.defaultCompactMode)
  const [now, setNow] = useState<number>(renderedAt)

  // After hydration (before paint): mobile/tablet starts in compact mode, and the
  // clock moves from render time to the visitor's "now".
  useIsoLayoutEffect(() => {
    if (window.innerWidth <= 768) setIsCompactMode(true)
    setNow(Date.now())
  }, [])

  // Event filter state
  const [filters, setFilters] = useState<EventFilters>({
    showPersonalEvents: true,
    showWorldEvents: APP_CONFIG.defaultShowWorldEvents,
    showPresidents: APP_CONFIG.defaultShowPresidents,
    personalCategories: {
      personal: true,
      education: true,
      work: true,
      travel: true,
      achievement: true
    }
  })

  const gridRef = useRef<HTMLDivElement>(null)

  return (
    <div className="frame life-in-weeks-container">
      <SiteNav />
      <main className="page life-in-weeks">
        <IntroContent
          lifeEvents={lifeEvents}
          weeksConfig={weeksConfig}
          now={now}
        />
        <EventFilter
          filters={filters}
          setFilters={setFilters}
        />
        <StickyHeader
          derivedConfig={derivedConfig}
          gridRef={gridRef}
          isCompactMode={isCompactMode}
          setIsCompactMode={setIsCompactMode}
        />
        <WeeksGrid
          ref={gridRef}
          isCompactMode={isCompactMode}
          lifeEvents={lifeEvents}
          weeksConfig={weeksConfig}
          filters={filters}
          now={now}
        />
      </main>
      <Footer />
    </div>
  )
}
