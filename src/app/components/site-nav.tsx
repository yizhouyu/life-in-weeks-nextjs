import React from 'react'
import { YzyMark } from './yzy-mark'
import { ThemeToggle } from './theme-toggle'

const SITE = 'https://yizhouyu.dev/'

/** Top bar in hairline cells, matching the yizhouyu.dev nav. */
export function SiteNav() {
  return (
    <header className="nav">
      <div className="brand">
        <YzyMark />
        <span className="who">Yizhou Yu · <span className="zh" lang="zh-Hans">俞奕舟</span></span>
      </div>
      <nav className="cells" aria-label="Site">
        <a href={SITE}>Home</a>
        <a href={`${SITE}#work`}>Work</a>
        <a href={`${SITE}weeks/`} aria-current="page">Weeks</a>
      </nav>
      <ThemeToggle />
    </header>
  )
}
