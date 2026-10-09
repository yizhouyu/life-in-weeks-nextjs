'use client'

// StickyHeader Component - sticky bar above the grid with decade navigation and the
// Standard/Compact switch. It sits directly above the grid, so it pins to the top of the
// viewport as soon as the grid scrolls into view.

import React, { useState, useEffect, useRef, RefObject } from 'react'
import { getDecadeMilestones } from '../utils/date-processing'
import { DerivedConfig } from '../config/app-config'
import { CompactToggle } from './compact-toggle'

interface StickyHeaderProps {
  derivedConfig: DerivedConfig
  gridRef: RefObject<HTMLDivElement | null>
  isCompactMode: boolean
  setIsCompactMode: (compact: boolean) => void
}

export function StickyHeader({ derivedConfig, gridRef, isCompactMode, setIsCompactMode }: StickyHeaderProps) {
  const [activeDecade, setActiveDecade] = useState('decade-0')
  const [isStuck, setIsStuck] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)

  // Track which decade sits just under the bar. One elementFromPoint per frame
  // instead of scanning every week box.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const bar = barRef.current
      const grid = gridRef.current
      if (!bar || !grid) return
      const barRect = bar.getBoundingClientRect()
      setIsStuck(barRect.top <= 0.5 && grid.getBoundingClientRect().bottom > barRect.bottom)

      const gridRect = grid.getBoundingClientRect()
      const y = barRect.bottom + 12
      if (gridRect.top > y) { setActiveDecade('decade-0'); return }
      const x = gridRect.left + gridRect.width / 2
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      const row = el?.closest<HTMLElement>('[data-age]')
      if (row) {
        const age = Number(row.dataset.age)
        if (!Number.isNaN(age)) setActiveDecade(`decade-${Math.floor(Math.max(0, age) / 10) * 10}`)
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [gridRef, isCompactMode])

  // Keep the active decade visible when the nav scrolls horizontally (mobile)
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>('.nav-link.active')
    if (!nav || !link) return
    const l = link.offsetLeft, r = l + link.offsetWidth
    if (l < nav.scrollLeft || r > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: l - 24, behavior: 'smooth' })
    }
  }, [activeDecade])

  const decades = getDecadeMilestones(derivedConfig.endYear, derivedConfig.birthYear)

  return (
    <div ref={barRef} className={`sticky-top ${isStuck ? 'is-stuck' : ''}`}>
      <a className="bar-title" href="#weeks-title" aria-label="Back to top">
        <span className="d">Weeks</span>
      </a>
      <nav className="navbar" id="lifeinweeks-navbar" aria-label="Decades">
        <ul className="decades" ref={navRef}>
          {decades.map((decade) => (
            <li key={decade.id} className="nav-item">
              <a
                className={`nav-link ${activeDecade === decade.id ? 'active' : ''}`}
                aria-current={activeDecade === decade.id ? 'location' : undefined}
                href={`#${decade.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(decade.id)
                  if (element) {
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
                  }
                }}
              >
                {decade.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <CompactToggle isCompact={isCompactMode} onToggle={setIsCompactMode} />
    </div>
  )
}
