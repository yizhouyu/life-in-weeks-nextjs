'use client'

// WeekBox Component - Individual box rendering with three modes
// Matches Gina's helpers/box.html exactly

import React from 'react'
import { GridBox } from '../utils/grid-layout'
import { CustomTooltip } from './custom-tooltip'

interface WeekBoxProps {
  box: GridBox
  className?: string
  style?: React.CSSProperties
  isCompactMode?: boolean
}

export function WeekBox({ box, className = '', style = {}, isCompactMode = false }: WeekBoxProps) {
  const compactClass = isCompactMode ? 'compact-cell' : ''
  const baseClasses = `btn ${box.type} ${box.borderClass} ${box.backgroundClass} ${compactClass}`
  const fullClassName = `${baseClasses} ${className}`.trim()
  
  // Additional classes based on box type
  const typeSpecificClasses = {
    birthday: 'text-nowrap',
    event: 'text-nowrap text-left', 
    week: 'w-100'
  }
  
  const finalClassName = `${fullClassName} ${typeSpecificClasses[box.type]}`.trim()
  
  // Determine if this box has detailed content worth showing in rich tooltip
  // Rich tooltips for events with descriptions (personal events, papers, detailed events)
  const hasDetails = box.type === 'event' && box.tooltip.includes('–')
  
  // In compact mode, show custom tooltip for all events to display full name
  const shouldUseCustomTooltip = hasDetails || (isCompactMode && box.type === 'event')
  
  const buttonElement = (
    <button
      type="button"
      className={finalClassName}
      data-date={box.date}
      style={style}
    >
      {box.label}
    </button>
  )

  // Use custom tooltip for detailed events or compact mode events
  if (shouldUseCustomTooltip) {
    return (
      <CustomTooltip content={box.tooltip} heading={box.headline}>
        {buttonElement}
      </CustomTooltip>
    )
  } else {
    // Simple native tooltip for basic events/dates and empty weeks
    return React.cloneElement(buttonElement, {
      title: box.tooltip
    })
  }
}