'use client'

import React from 'react'
import { EventsData, WeeksConfig } from '../data/life-events'

interface IntroContentProps {
  lifeEvents: EventsData
  weeksConfig: WeeksConfig
  now: number
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const fmt = (n: number) => n.toLocaleString('en-US')

export function IntroContent({ lifeEvents, weeksConfig, now }: IntroContentProps) {
  const start = parseLocalDate(weeksConfig.startDate).getTime()

  const weeksLived = Math.max(0, Math.floor((now - start) / WEEK_MS))
  const trips = Object.entries(lifeEvents).reduce(
    (n, [date, events]) => n + (parseLocalDate(date).getTime() <= now ? events.filter(e => e.category === 'travel').length : 0),
    0
  )
  const milestonesPassed = Object.entries(lifeEvents).filter(
    ([date, events]) => parseLocalDate(date).getTime() <= now && events.some(e => e.milestone)
  ).length
  const chapters = milestonesPassed + 1 // the first chapter starts at birth

  return (
    <section className="hero" aria-labelledby="weeks-title">
      <div className="hero-main">
        <div className="sec-top"><span className="n">01</span><span className="cap">Life in weeks</span></div>
        <h1 className="d" id="weeks-title">
          <span className="row">My life</span>
          <span className="row">in weeks<span className="dot">.</span></span>
        </h1>
        <p className="lede">
          Each week of my life is a little box. <b>{fmt(weeksLived)}</b> of them are filled in so far. The shade
          deepens at every milestone, so each tone is a chapter.
        </p>
        <p className="credits">
          Inspired by <a className="lnk" href="https://waitbutwhy.com/2014/05/life-weeks.html">Wait But Why</a>.
          Adapted from <a className="lnk" href="https://github.com/ginatrapani/life-in-weeks">Gina&apos;s work</a>.
          Built on <a className="lnk" href="https://rd.me/weeks">Ran Ding&apos;s version</a>; my code
          is <a className="lnk" href="https://github.com/yizhouyu/life-in-weeks-nextjs">here</a>.
        </p>
        <div className="btns">
          <a className="btn primary" href="#decade-0">See the weeks <span className="arrow" aria-hidden="true">↓</span></a>
          <a className="btn" href="https://yizhouyu.dev/">Main site <span className="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>

      <aside className="rail" aria-label="By the numbers">
        <span className="cap">By the numbers</span>
        <ul className="proof">
          <li>
            <span className="i">01</span>
            <span className="v" data-weeks-live>{fmt(weeksLived)}</span>
            <span className="l">Weeks lived, counted live</span>
          </li>
          <li>
            <span className="i">02</span>
            <span className="v">{trips}</span>
            <span className="l">Trips logged on the grid</span>
          </li>
          <li>
            <span className="i">03</span>
            <span className="v">{chapters}</span>
            <span className="l">Chapters so far, one shade each</span>
          </li>
        </ul>
        <p className="now"><i aria-hidden="true" /> This week is the outlined square in the grid.</p>
      </aside>
    </section>
  )
}
