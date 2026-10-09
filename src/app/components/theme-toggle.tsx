'use client'

import React, { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

/**
 * Light/dark toggle. Same semantics as yizhouyu.dev (same origin): `data-theme` on <html>,
 * persisted in localStorage 'theme'; with no stored choice it follows the system.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const t = root.getAttribute('data-theme')
      setTheme(t === 'dark' || t === 'light' ? t : (mq.matches ? 'dark' : 'light'))
    }
    sync()
    mq.addEventListener?.('change', sync)
    // Another tab (e.g. the main site) changed the theme
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'theme') return
      if (e.newValue === 'dark' || e.newValue === 'light') root.setAttribute('data-theme', e.newValue)
      else root.removeAttribute('data-theme')
      sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      mq.removeEventListener?.('change', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch { /* private mode */ }
    setTheme(next)
  }

  const shown = theme ?? 'light'
  return (
    <button
      className="tt"
      type="button"
      onClick={toggle}
      data-state={shown}
      aria-label={`Theme: ${shown}. Switch to ${shown === 'dark' ? 'light' : 'dark'}`}
    >
      <svg className="tt-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
      <span className="tt-label">{shown === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
