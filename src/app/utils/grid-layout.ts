// Grid Layout Utilities for Life in Weeks
// Implements Gina's complex row-breaking algorithm

export interface GridBox {
  type: 'birthday' | 'event' | 'week'
  label: string
  date: string
  tooltip: string
  borderClass: string
  backgroundClass: string
  age?: number
  year?: number
  eventType?: 'personal' | 'world' | 'president'  // Type of event for styling
  milestone?: boolean                              // Primary event starts a new life phase
  headline?: string                                // Primary event's full headline (tooltip title)
}

export interface RowBreakCalculation {
  currentBoxes: number
  newBoxWidth: number
  totalAfterAdd: number
  shouldBreak: boolean
}

// Responsive layout based on actual measured container widths
export const GRID_CONSTANTS = {
  ultrawide: {
    containerWidth: 1440,     // 1800px × 80% = 1440px available
    basePadding: 8,           
    charWidth: 8,             
    weekBoxMinWidth: 20,      
  },
  wide: {
    containerWidth: 1190,     // 1400px × 85% = 1190px available
    basePadding: 8,           
    charWidth: 8,             
    weekBoxMinWidth: 20,      
  },
  desktop: {
    containerWidth: 668,      // Actual measured width at desktop
    basePadding: 7,           // Slightly reduced from 8 to match tighter spacing
    charWidth: 8,             
    weekBoxMinWidth: 20,      
  },
  tablet: {
    containerWidth: 573,      // Actual measured width at 769px viewport
    basePadding: 4,           // Slightly reduced from 5 to match tighter spacing
    charWidth: 7,             
    weekBoxMinWidth: 17,      
  },
  mobile: {
    containerWidth: 737,      // 768px viewport × 96% = 737px available
    basePadding: 3,           // Slightly reduced from 4 to match tighter spacing  
    charWidth: 6,
    weekBoxMinWidth: 15,
  },
  extraSmall: {
    containerWidth: 307,      // TODO: Measure actual width
    basePadding: 2,           // Slightly reduced from 3 to match tighter spacing
    charWidth: 5,
    weekBoxMinWidth: 12,
  },
  compact: {
    // Compact mode uses same container widths but smaller cell dimensions
    ultrawide: {
      containerWidth: 1440,   // Same as normal ultrawide
      basePadding: 1,
      charWidth: 8,
      weekBoxMinWidth: 8,
    },
    wide: {
      containerWidth: 1190,   // Same as normal wide
      basePadding: 1,
      charWidth: 8,
      weekBoxMinWidth: 8,
    },
    desktop: {
      containerWidth: 668,    // Same as normal desktop
      basePadding: 1,
      charWidth: 8,
      weekBoxMinWidth: 8,
    },
    tablet: {
      containerWidth: 573,    // Same as normal tablet
      basePadding: 1,
      charWidth: 7,
      weekBoxMinWidth: 6,
    },
    mobile: {
      containerWidth: 461,    // Same as normal mobile
      basePadding: 0,
      charWidth: 6,
      weekBoxMinWidth: 5,
    },
    extraSmall: {
      containerWidth: 307,    // Same as normal extraSmall
      basePadding: 0,
      charWidth: 5,
      weekBoxMinWidth: 4,
    }
  }
}

/**
 * Calculate dynamic grid constants based on actual measured container width
 */
export function calculateDynamicConstants(containerWidth: number, compactMode: boolean = false) {
  // Calculate character width based on actual CSS font sizes
  let charWidth: number
  let basePadding: number
  let weekBoxMinWidth: number
  
  // Metrics mirror weeks.css (Archivo, uppercase-free labels). Slight over-estimates are
  // safe: plain week cells flex to absorb any leftover width in a row.
  if (compactMode) {
    charWidth = containerWidth <= 768 ? 6.5 : 7   // emoji ~ 2 UTF-16 units → ~13–14px
    basePadding = 2
    weekBoxMinWidth = 6
  } else {
    if (containerWidth < 350) {
      charWidth = 6     // 10px labels
    } else if (containerWidth < 500) {
      charWidth = 6.5   // 11px labels
    } else if (containerWidth < 650) {
      charWidth = 7     // 12px labels
    } else {
      charWidth = 7.4   // 12.5px labels
    }
    basePadding = containerWidth >= 650 ? 8 : 5
    weekBoxMinWidth = Math.max(12, Math.min(20, Math.floor(containerWidth / 50)))
  }
  
  // Apply safety margin: use 95% of container width to prevent edge-case overflow
  const safeContainerWidth = Math.floor(containerWidth * 0.95)
  
  const baseConstants = {
    containerWidth: safeContainerWidth, // Use safety margin
    basePadding,
    charWidth,
    weekBoxMinWidth
  }
  
  return baseConstants
}

/**
 * Get appropriate constants based on current viewport width and compact mode
 * Now supports dynamic container width measurement
 */
export function getResponsiveConstants(compactMode: boolean = false, measuredWidth?: number) {
  // If we have a measured width, use dynamic calculation
  if (measuredWidth && measuredWidth > 0) {
    return calculateDynamicConstants(measuredWidth, compactMode)
  }
  
  // Fallback to static breakpoint system
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return compactMode ? GRID_CONSTANTS.compact.desktop : GRID_CONSTANTS.desktop
  }
  
  const width = window.innerWidth
  
  // Determine which breakpoint we're in (matching CSS media queries)
  let breakpoint: 'ultrawide' | 'wide' | 'desktop' | 'tablet' | 'mobile' | 'extraSmall'
  if (width < 480) {
    breakpoint = 'extraSmall'
  } else if (width <= 768) {  // Changed from < to <= to match CSS
    breakpoint = 'mobile'
  } else if (width < 1024) {
    breakpoint = 'tablet'
  } else if (width < 1400) {
    breakpoint = 'desktop'
  } else if (width < 1800) {
    breakpoint = 'wide'
  } else {
    breakpoint = 'ultrawide'
  }
  
  // Return compact or normal constants for the same breakpoint
  if (compactMode) {
    return GRID_CONSTANTS.compact[breakpoint]
  } else {
    return GRID_CONSTANTS[breakpoint]
  }
}

/**
 * Calculate the absolute pixel width for empty week cells
 */
export function calculateWeekCellWidth(compactMode: boolean = false): number {
  if (compactMode) {
    // Compact: 6px cell + 1px gap — the whole life fits on one screen
    return 7
  }
  // Standard: near-square cells. Use viewport width to match CSS media queries.
  // Desktop: 22px cell + 2px gap; mobile (≤768px viewport): 16px cell + 2px gap.
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  return viewportWidth <= 768 ? 18 : 24
}

/**
 * Calculate the absolute pixel width a text box will take up
 */
export function calculateBoxWidth(label: string, compactMode: boolean = false, measuredWidth?: number): number {
  const constants = getResponsiveConstants(compactMode, measuredWidth)
  const labelLength = label.length
  
  // Calculate width as: padding + (characters * char width) + padding + border + gap
  const textWidth = labelLength * constants.charWidth
  const totalPadding = constants.basePadding * 2  // Left + right padding
  const borderWidth = 2                  // 1px hairline on each side
  const gapWidth = compactMode ? 1 : 2   // matches .row-cells gap in weeks.css
  
  return Math.ceil(textWidth + totalPadding + borderWidth + gapWidth)
}

/**
 * Simple greedy row breaking using absolute pixel widths
 * Break when adding next box would exceed container width
 */
function shouldBreakBeforeBox(currentRowWidth: number, nextBoxLabel: string, compactMode: boolean = false, measuredWidth?: number): boolean {
  const constants = getResponsiveConstants(compactMode, measuredWidth)
  const nextBoxWidth = nextBoxLabel ? 
    calculateBoxWidth(nextBoxLabel, compactMode, measuredWidth) : 
    calculateWeekCellWidth(compactMode)  // Use new week cell width function
  const totalAfterAdd = currentRowWidth + nextBoxWidth
  
  return totalAfterAdd >= constants.containerWidth
}

/**
 * Determine if adding a new box would exceed the container width
 * Uses absolute pixel calculations
 */
export function shouldBreakRow(currentWidth: number, newBoxLabel: string, compactMode: boolean = false, measuredWidth?: number): RowBreakCalculation {
  const constants = getResponsiveConstants(compactMode, measuredWidth)
  const newBoxWidth = calculateBoxWidth(newBoxLabel, compactMode, measuredWidth)
  const totalAfterAdd = currentWidth + newBoxWidth
  
  return {
    currentBoxes: currentWidth,  // Now represents pixels, not box count
    newBoxWidth,
    totalAfterAdd,
    shouldBreak: totalAfterAdd >= constants.containerWidth
  }
}

/**
 * Process boxes into rows using absolute pixel width calculations
 * Break when adding next box would exceed container width
 */
export function processBoxesIntoRows(boxes: GridBox[], compactMode: boolean = false, measuredWidth?: number): GridBox[][] {
  const rows: GridBox[][] = []
  let currentRow: GridBox[] = []
  let currentRowWidth = 0
  
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]
    const boxWidth = box.type === 'week' ? 
      calculateWeekCellWidth(compactMode) :  // Use new week cell width function
      calculateBoxWidth(box.label, compactMode, measuredWidth)
    
    // Check if we need to break before adding this box (width-based only)
    const shouldBreakWidth = shouldBreakBeforeBox(currentRowWidth, box.label, compactMode, measuredWidth)
    
    if (shouldBreakWidth && currentRow.length > 0) {
      // Finish current row and start new one
      rows.push([...currentRow])
      currentRow = []
      currentRowWidth = 0
    }
    
    // Add box to current row
    currentRow.push(box)
    currentRowWidth += boxWidth
  }
  
  // Add final row if it has content
  if (currentRow.length > 0) {
    rows.push(currentRow)
  }
  
  return rows
}

/**
 * Group boxes by decade for navigation anchors
 * Matches Gina's decade section logic
 */
export interface DecadeSection {
  decadeId: string
  age: number
  boxes: GridBox[]
}

export function groupBoxesByDecade(boxes: GridBox[]): DecadeSection[] {
  const decades: Map<number, GridBox[]> = new Map()
  
  for (const box of boxes) {
    if (box.age !== undefined) {
      const decade = Math.floor(box.age / 10) * 10
      
      if (!decades.has(decade)) {
        decades.set(decade, [])
      }
      
      decades.get(decade)!.push(box)
    }
  }
  
  // Convert to sorted array
  return Array.from(decades.entries())
    .sort(([a], [b]) => a - b)
    .map(([decade, boxes]) => ({
      decadeId: `decade-${decade}`,
      age: decade,
      boxes
    }))
}

/**
 * Create tooltip text with support for event dates and privacy settings
 */
export function createTooltip(
  weekStartDate: string,
  description?: string,
  eventDate?: string,
  eventType?: 'personal' | 'world' | 'president',
  showPersonalEventDates: boolean = true
): string {
  // Use event date if available and appropriate
  const dateToShow = eventDate || weekStartDate

  // Determine if we should show full date based on event type and privacy setting
  const showFullDate = eventType !== 'personal' || showPersonalEventDates

  const formattedDate = formatTooltipDateLocal(dateToShow, showFullDate)

  if (description) {
    return `${formattedDate} – ${description}`
  }

  // For empty weeks, show just the month and year
  // This provides useful context when hovering over cells
  return formattedDate
}

/**
 * Parse date string (YYYY-MM-DD) without timezone issues
 * Avoids UTC conversion that causes 1-day offset in some timezones
 */
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

/**
 * Format date for tooltip display (Jan 2, 2006 format)
 */
function formatTooltipDateLocal(dateString: string, showFullDate: boolean = true): string {
  const date = parseLocalDate(dateString)
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  if (showFullDate) {
    const day = date.getDate()
    return `${month} ${day}, ${year}`
  } else {
    return `${month} ${year}`
  }
}

/**
 * Create birthday box label matching Gina's format
 */
export function createBirthdayLabel(age: number, year: number, compactMode: boolean = false): string {
  // Rendered as a black-boxed age marker; the calendar year sits in the row gutter
  // (and in the tooltip), so the label stays short.
  if (compactMode) {
    return `${age}`
  }
  return `Age ${age}`
}

/**
 * Create birthday tooltip matching Gina's format
 */
export function createBirthdayTooltip(date: string, age: number): string {
  const formattedDate = formatTooltipDateLocal(date, true)
  const yearText = age === 1 ? "year" : "years"
  return `${formattedDate} – Turned ${age} ${yearText} old`
}

/**
 * Extract first emoji from a string
 */
export function extractFirstEmoji(text: string): string | null {
  // More comprehensive emoji regex covering all major Unicode emoji blocks
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]{2}|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]/u
  
  const match = text.match(emojiRegex)
  if (match) {
    // Handle flag emojis (which are 2 characters)
    if (match[0].length === 1 && match.index !== undefined) {
      const nextChar = text.charAt(match.index + 1)
      if (nextChar && /[\u{1F1E0}-\u{1F1FF}]/u.test(nextChar)) {
        return match[0] + nextChar // Return the full flag emoji
      }
    }
    return match[0]
  }
  return null
}

/**
 * Create compact event label (emoji only, or empty if no emoji)
 */
export function createCompactEventLabel(headline: string): string {
  const emoji = extractFirstEmoji(headline)
  return emoji || '' // Return emoji or empty string
}

/**
 * Determine if event should be shown in compact mode
 */
export function shouldShowInCompact(headline: string): boolean {
  return extractFirstEmoji(headline) !== null
}

