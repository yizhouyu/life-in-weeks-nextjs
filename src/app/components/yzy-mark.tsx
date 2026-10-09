'use client'

import React, { useEffect, useRef } from 'react'

const HOME = 'https://yizhouyu.dev/'

/**
 * YZY palindrome wordmark (same as yizhouyu.dev). On load and hover the two Ys trade
 * places, one over the Z and one under, and land identical.
 */
export function YzyMark({ className = '', label = 'YZY — Yizhou Yu, home' }: { className?: string; label?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const m = ref.current
    if (!m) return
    const a = m.querySelector<HTMLElement>('.y1')
    const b = m.querySelector<HTMLElement>('.y2')
    if (!a || !b) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer: ReturnType<typeof setTimeout> | undefined
    const measure = () => m.style.setProperty('--d', `${b.offsetLeft - a.offsetLeft}px`)
    const done = () => m.classList.remove('swap')
    const play = () => {
      if (reduce || m.classList.contains('swap')) return
      measure()
      m.classList.add('swap')
    }
    b.addEventListener('animationend', done)
    m.addEventListener('mouseenter', play)
    m.addEventListener('focus', play)
    measure()
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { measure(); timer = setTimeout(play, 500) })
    } else {
      timer = setTimeout(play, 800)
    }
    return () => {
      if (timer) clearTimeout(timer)
      b.removeEventListener('animationend', done)
      m.removeEventListener('mouseenter', play)
      m.removeEventListener('focus', play)
    }
  }, [])

  return (
    <a ref={ref} className={`yzy ${className}`.trim()} href={HOME} aria-label={label}>
      <span className="y1">Y</span><span className="z">Z</span><span className="y2">Y</span>
    </a>
  )
}
