'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

interface CustomTooltipProps {
  content: string
  heading?: string      // Event headline, shown as the tooltip title
  hasDetails?: boolean  // Optional for backward compatibility
  children: React.ReactNode
}

const GAP = 10      // distance between cell and tooltip
const MARGIN = 10   // keep this far from the viewport edges

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Split "Aug 2016 – text\n🌍 more" into a date line and one entry per event. */
function parseContent(text: string): { date: string | null; entries: string[] } {
  const i = text.indexOf(' – ')
  if (i === -1) return { date: text, entries: [] }
  return {
    date: text.slice(0, i),
    entries: text.slice(i + 3).split('\n').filter(Boolean),
  }
}

// Format text with clickable links
function formatContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="lnk"
          onClick={(e) => e.stopPropagation()}
        >
          {part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

/** Tag for an entry, from the prefix added in weeks-grid (🌍 world, 🇺🇸 president). */
function entryKind(entry: string): { kind: 'world' | 'president' | 'personal'; text: string } {
  if (entry.startsWith('🌍 ')) return { kind: 'world', text: entry.slice(3) }
  if (entry.startsWith('🇺🇸 ')) return { kind: 'president', text: entry.slice(5) }
  return { kind: 'personal', text: entry }
}

const KIND_LABEL = { world: 'World', president: 'US president', personal: 'Personal' } as const

export function CustomTooltip({ content, heading, children }: CustomTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [anchor, setAnchor] = useState<DOMRect | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number; ax: number; below: boolean } | null>(null)
  const triggerRef = useRef<HTMLElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).slice(2, 11)}`)

  const isVisible = isHovered || isSticky

  // Measure the rendered tooltip, then place it centred above the cell (or below if
  // there is no room), clamped to the viewport.
  useIsoLayoutEffect(() => {
    if (!isVisible || !anchor || !tipRef.current) { setPosition(null); return }
    const w = tipRef.current.offsetWidth
    const h = tipRef.current.offsetHeight
    const cx = anchor.left + anchor.width / 2
    let x = cx - w / 2
    x = Math.max(MARGIN, Math.min(x, window.innerWidth - w - MARGIN))
    let y = anchor.top - h - GAP
    let below = false
    if (y < MARGIN) { y = anchor.bottom + GAP; below = true }
    const ax = Math.max(12, Math.min(w - 12, cx - x))
    setPosition({ x, y, ax, below })
  }, [isVisible, anchor, content])

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setAnchor(rect)
  }

  const handleMouseEnter = () => {
    if (!content) return
    // Dismiss any existing sticky tooltips globally
    document.dispatchEvent(new CustomEvent('dismissAllTooltips', {
      detail: { except: tooltipId.current }
    }))
    show()
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (!isSticky) {
      setIsHovered(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!content) return
    e.preventDefault()
    e.stopPropagation()
    document.dispatchEvent(new CustomEvent('dismissAllTooltips', {
      detail: { except: tooltipId.current }
    }))
    show()
    setIsSticky(true)
    setIsHovered(true)
  }

  // Global event listeners for closing sticky tooltips
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSticky) {
        setIsSticky(false)
        setIsHovered(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isSticky && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        const tooltip = document.getElementById(tooltipId.current)
        if (!tooltip || !tooltip.contains(e.target as Node)) {
          setIsSticky(false)
          setIsHovered(false)
        }
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSticky, isVisible])

  // Dismiss tooltip when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isSticky) {
        setIsSticky(false)
        setIsHovered(false)
      }
    }

    if (isSticky) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      document.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [isSticky])

  // Listen for global dismiss event from other tooltips
  useEffect(() => {
    const handleGlobalDismiss = (event: CustomEvent) => {
      const { except } = event.detail
      if (except !== tooltipId.current) {
        setIsSticky(false)
        setIsHovered(false)
      }
    }

    document.addEventListener('dismissAllTooltips', handleGlobalDismiss as EventListener)

    return () => {
      document.removeEventListener('dismissAllTooltips', handleGlobalDismiss as EventListener)
    }
  }, [])

  const renderTooltip = () => {
    if (!isVisible || !content || typeof window === 'undefined') return null
    const { date, entries } = parseContent(content)

    return createPortal(
      <div
        id={tooltipId.current}
        ref={tipRef}
        role="tooltip"
        className={`wk-tip ${isSticky ? 'is-sticky' : ''} ${position?.below ? 'is-below' : ''}`}
        style={{
          left: position?.x ?? -9999,
          top: position?.y ?? -9999,
          visibility: position ? 'visible' : 'hidden',
          '--ax': `${position?.ax ?? 0}px`,
        } as React.CSSProperties}
      >
        {date && <div className="wk-tip-date">{date}</div>}
        {heading && <div className="wk-tip-title">{heading}</div>}
        {entries.length > 0 && <ul className="wk-tip-list">
          {entries.map((entry, i) => {
            const { kind, text } = entryKind(entry)
            return (
              <li key={i} className={`wk-tip-entry k-${kind}`}>
                {entries.length > 1 || kind !== 'personal' ? <span className="wk-tip-kind">{KIND_LABEL[kind]}</span> : null}
                <span className="wk-tip-text">{formatContent(text)}</span>
              </li>
            )
          })}
        </ul>}
        {isSticky && <div className="wk-tip-hint">Pinned · Esc to close</div>}
      </div>,
      document.body
    )
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="tip-trigger"
      >
        {children}
      </span>
      {renderTooltip()}
    </>
  )
}
