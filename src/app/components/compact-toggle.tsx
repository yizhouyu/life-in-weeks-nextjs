'use client'

import React from 'react'

interface CompactToggleProps {
  isCompact: boolean
  onToggle: (compact: boolean) => void
}

/** Standard / Compact segmented control in hairline cells. */
export function CompactToggle({ isCompact, onToggle }: CompactToggleProps) {
  return (
    <div className="compact-toggle" role="group" aria-label="Grid view">
      <button
        type="button"
        className={`seg ${!isCompact ? 'on' : ''}`}
        aria-pressed={!isCompact}
        onClick={() => onToggle(false)}
        title="Standard view: every event spelled out"
      >
        Standard
      </button>
      <button
        type="button"
        className={`seg ${isCompact ? 'on' : ''}`}
        aria-pressed={isCompact}
        onClick={() => onToggle(true)}
        title="Compact view: the entire life fits on one screen"
      >
        Compact
      </button>
    </div>
  )
}
