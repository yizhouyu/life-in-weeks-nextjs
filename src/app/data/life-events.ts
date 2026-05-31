// Life Events Data - Personal Life Timeline (with privacy protection for sensitive dates)

import { APP_CONFIG } from '../config/app-config'

// Sensitive dates interface - these will be provided by server-side configuration
export interface SensitiveDates {
  birthDate: string
}

/**
 * Event Category Type - Categories for personal life events
 */
export type EventCategory = 'personal' | 'education' | 'work' | 'travel' | 'achievement'

/**
 * LifeEvent Interface - Defines the structure for life events
 *
 * FIELD USAGE:
 * - headline: Main text displayed in cells and tooltips (REQUIRED)
 *   In compact mode: emoji extracted and shown in cell
 *   In standard mode: full text shown in cell
 *
 * - description: Additional details shown in rich tooltips
 *   Displayed for events with URLs or detailed text
 *   Supports clickable links in tooltips
 *
 * - milestone: Used for automatic milestone color generation
 *   Events marked as milestones get unique background colors
 *   Colors are auto-generated based on chronological order
 *
 * - category: Event category for filtering
 *   personal: Birth, major life milestones
 *   education: School, graduation, academic achievements
 *   work: Jobs, internships, team changes, professional milestones
 *   travel: Trips, relocations, international moves
 *   achievement: Awards, recognitions, accomplishments
 */
export interface LifeEvent {
  headline: string          // Main text in cells and tooltips
  description?: string      // Additional details in rich tooltips
  milestone?: boolean       // For automatic background colors
  category?: EventCategory  // Event category for filtering
}

export type EventsData = Record<string, LifeEvent[]>

// Weeks configuration interface  
export interface WeeksConfig {
  startDate: string
  endYear: number
  startYear: number
  startMonth: string
  startDay: string
}

// Function to create life events with sensitive dates and derived config
export function createLifeEvents(sensitiveDates: SensitiveDates, derivedConfig: { lifeExpectancyDate: string; japanLifeExpectancyDate: string; lifeExpectancyLabel: string; japanLifeExpectancyLabel: string }): EventsData {
  return {
    [sensitiveDates.birthDate]: [
      {
        headline: "🐣 Born in Shanghai",
        category: "personal"
      }
    ],
    "2009-09-01": [
      {
        headline: "🎓 Started at Shanghai Foreign Language School",
        milestone: true,
        category: "education"
      }
    ],
    "2016-08-01": [
      {
        headline: "✈️ Came to US for College",
        milestone: true,
        description: "Started at Cornell University",
        category: "education"
      }
    ],
    "2018-05-01": [
      {
        headline: "💼 Meta Internship",
        description: "Interned at Meta's New York City Office",
        category: "work"
      }
    ],
    "2020-05-01": [
      {
        headline: "🎓 Graduated from Cornell University",
        milestone: true,
        description: "Bachelor's and Master's degrees",
        category: "education"
      }
    ],
    "2020-07-01": [
      {
        headline: "💼 Started at Meta full-time as a Software Engineer",
        milestone: true,
        description: "Joined Applied Privacy Technology Team",
        category: "work"
      }
    ],
    "2021-05-01": [
      {
        headline: "👨‍🏫 Hosted Kensal Ramos",
        description: "As intern manager at Meta",
        category: "work"
      }
    ],
    "2022-05-01": [
      {
        headline: "👨‍🏫 Hosted Elizabeth Ke",
        description: "As intern manager at Meta",
        category: "work"
      }
    ],
    "2022-08-01": [
      {
        headline: "🔬 Joined Experimentation Platform Team",
        milestone: true,
        description: "Switched to the Experimentation Platform team at Meta",
        category: "work"
      }
    ],
    "2022-09-02": [
      {
        headline: "😴 Long Island",
        description: "Travel to Long Island",
        category: "travel"
      }
    ],
    "2022-10-19": [
      {
        headline: "🍂 Boston",
        description: "Travel to Boston",
        category: "travel"
      }
    ],
    "2022-11-23": [
      {
        headline: "🏖️ Miami",
        description: "Travel to Miami",
        category: "travel"
      }
    ],
    "2022-12-30": [
      {
        headline: "🏂 Vermont Snowboarding",
        description: "Snowboarding at Stowe and Killington",
        category: "travel"
      }
    ],
    "2023-02-18": [
      {
        headline: "🎨 Beacon",
        description: "Travel to Beacon, NY",
        category: "travel"
      }
    ],
    "2023-04-07": [
      {
        headline: "🌳 Charleston & Savannah",
        description: "Travel to Charleston and Savannah",
        category: "travel"
      }
    ],
    "2023-04-26": [
      {
        headline: "🐻 Ithaca",
        description: "Travel to Ithaca, NY",
        category: "travel"
      }
    ],
    "2023-06-10": [
      {
        headline: "💼 Bay Area",
        description: "Travel to Bay Area",
        category: "travel"
      }
    ],
    "2023-09-02": [
      {
        headline: "🏔️ Seattle & Portland",
        description: "Travel to Seattle and Portland",
        category: "travel"
      }
    ],
    "2023-10-20": [
      {
        headline: "🍁 DC & Shenandoah National Park",
        description: "Travel to DC and Shenandoah National Park",
        category: "travel"
      }
    ],
    "2023-11-11": [
      {
        headline: "💼 Boston",
        description: "Travel to Boston",
        category: "travel"
      }
    ],
    "2023-12-17": [
      {
        headline: "🍹 Hollywood / Fort Lauderdale",
        description: "Travel to Hollywood and Fort Lauderdale, Florida",
        category: "travel"
      }
    ],
    "2024-03-15": [
      {
        headline: "🤠 Texas",
        description: "Travel to Texas",
        category: "travel"
      }
    ],
    "2024-05-01": [
      {
        headline: "👨‍🏫 Hosted Yuzhou Jiang",
        description: "As intern manager at Meta",
        category: "work"
      }
    ],
    "2024-07-03": [
      {
        headline: "🚣 Adirondack",
        description: "Travel to Adirondack",
        category: "travel"
      }
    ],
    "2024-10-12": [
      {
        headline: "📒 New Haven",
        description: "Travel to New Haven, CT",
        category: "travel"
      }
    ],
    "2024-11-28": [
      {
        headline: "🐠 Puerto Rico",
        description: "Travel to Puerto Rico",
        category: "travel"
      }
    ],
    "2024-12-30": [
      {
        headline: "🌵 Arizona",
        description: "Travel to Arizona",
        category: "travel"
      }
    ],
    "2025-05-01": [
      {
        headline: "👨‍🏫 Hosted Aiden Mizhen",
        description: "As intern manager at Meta",
        category: "work"
      }
    ],
    "2025-04-04": [
      {
        headline: "🪨 Utah",
        description: "Travel to Utah",
        category: "travel"
      }
    ],
    "2025-07-04": [
      {
        headline: "🏔️ Colorado",
        description: "Travel to Colorado",
        category: "travel"
      }
    ],
    "2025-08-29": [
      {
        headline: "🧊 Alaska",
        description: "Travel to Alaska",
        category: "travel"
      }
    ],
    "2025-10-11": [
      {
        headline: "🤖 Created this page using Claude Code",
        description: "Built this Life in Weeks visualization with Claude Code: https://claude.com/claude-code",
        category: "achievement"
      }
    ],
    "2025-11-26": [
      {
        headline: "🦭 Tampa",
        description: "Travel to Tampa, Florida",
        category: "travel"
      }
    ],
    "2025-12-12": [
      {
        headline: "🌮 New Mexico",
        description: "Travel to New Mexico",
        category: "travel"
      }
    ],
    "2025-12-21": [
      {
        headline: "⛲ Southern California",
        description: "Travel to Southern California (San Diego, Palm Springs, LA)",
        category: "travel"
      }
    ],
    "2026-03-15": [
      {
        headline: "🏝️ US Virgin Islands",
        description: "Travel to the US Virgin Islands",
        category: "travel"
      }
    ],
    "2026-05-15": [
      {
        headline: "🌺 Hawaii",
        description: "Travel to Hawaii",
        category: "travel"
      }
    ],
    ...(APP_CONFIG.showLifeExpectancy ? {
      [derivedConfig.lifeExpectancyDate]: [
        {
          headline: derivedConfig.lifeExpectancyLabel,
          description: `Based on US male life expectancy data from Worldometers`,
          milestone: true  // Mark as milestone to show it's a significant marker
        }
      ]
    } : {}),
    ...(APP_CONFIG.showJapanLifeExpectancy ? {
      [derivedConfig.japanLifeExpectancyDate]: [
        {
          headline: derivedConfig.japanLifeExpectancyLabel,
          description: `Japan has one of the highest life expectancies globally`,
          milestone: true  // Mark as milestone for comparison
        }
      ]
    } : {})
  }
}

// Function to create weeks config with sensitive birth date
export function createWeeksConfig(birthDate: string, derivedConfig: { endYear: number }): WeeksConfig {
  return {
    startDate: birthDate,
    endYear: derivedConfig.endYear,
    startYear: parseInt(birthDate.split('-')[0]),
    startMonth: birthDate.split('-')[1],
    startDay: birthDate.split('-')[2]
  }
}

