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
  home?: boolean            // Also show on the yizhouyu.dev home ruler (served by /api/milestones)
  homeLabel?: string        // Short label for the home ruler; defaults to the headline without its emoji
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
        home: true,
        homeLabel: "Born in Shanghai",
        category: "personal"
      }
    ],
    "2009-09-01": [
      {
        headline: "🎓 Started at Shanghai Foreign Language School",
        home: true,
        homeLabel: "Shanghai Foreign Language School",
        milestone: true,
        category: "education"
      }
    ],
    "2016-08-01": [
      {
        headline: "✈️ Came to US for College",
        home: true,
        homeLabel: "Came to the US for college · Cornell",
        milestone: true,
        description: "Started at Cornell University",
        category: "education"
      }
    ],
    "2018-05-01": [
      {
        headline: "💼 Meta Internship",
        home: true,
        homeLabel: "Meta intern",
        description: "Interned at Meta's New York City Office",
        category: "work"
      }
    ],
    "2019-06-01": [
      {
        headline: "💼 Point72 Internship",
        home: true,
        homeLabel: "Point72 intern",
        description: "Summer intern on the Market Intelligence team.",
        category: "work"
      }
    ],
    "2020-05-01": [
      {
        headline: "🎓 Graduated from Cornell University",
        home: true,
        homeLabel: "Cornell M.Eng.",
        milestone: true,
        description: "Bachelor's and Master's degrees",
        category: "education"
      }
    ],
    "2020-07-01": [
      {
        headline: "💼 Started at Meta full-time as a Software Engineer",
        home: true,
        homeLabel: "Meta, full-time",
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
    "2022-01-01": [
      {
        headline: "🏂 Belleayre",
        description: "Snowboarding at Belleayre Mountain in the Catskills.",
        category: "travel"
      }
    ],
    "2022-01-06": [
      {
        headline: "🎬 Started a YouTube channel",
        home: true,
        homeLabel: "Started a YouTube channel",
        description: "Yizhou的一周. The first video was about my job at Meta; it slowly became mostly travel vlogs: https://www.youtube.com/@yizhou8888",
        category: "personal"
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
        home: true,
        homeLabel: "Experimentation Platform",
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
    "2022-09-27": [
      {
        headline: "💕 Started dating my future wife",
        home: true,
        homeLabel: "Started dating my future wife",
        category: "personal"
      }
    ],
    "2022-10-19": [
      {
        headline: "🍂 Boston",
        description: "Walked all 16 stops of the Freedom Trail.",
        category: "travel"
      }
    ],
    "2022-11-23": [
      {
        headline: "🏖️ Miami",
        description: "Took the 28-hour Amtrak sleeper down from New York, then tried wakeboarding for the first time.",
        category: "travel"
      }
    ],
    "2022-12-30": [
      {
        headline: "🏂 Vermont Snowboarding",
        description: "Stowe and Killington over New Year's.",
        category: "travel"
      }
    ],
    "2023-02-18": [
      {
        headline: "🎨 Beacon",
        description: "Dia Beacon and Main Street.",
        category: "travel"
      }
    ],
    "2023-04-07": [
      {
        headline: "🌳 Charleston & Savannah",
        description: "Rainbow Row, Magnolia Plantation, and lunch at Mrs. Wilkes'.",
        category: "travel"
      }
    ],
    "2023-04-26": [
      {
        headline: "🐻 Back to Ithaca",
        description: "Back at Cornell: the dining halls, North Campus, waterfalls and wineries.",
        category: "travel"
      }
    ],
    "2023-06-10": [
      {
        headline: "💼 Bay Area",
        description: "Meta and Apple HQs, Lake Tahoe, and the Golden Gate at sunset.",
        category: "travel"
      }
    ],
    "2023-09-02": [
      {
        headline: "🏔️ Seattle & Portland",
        description: "Wild orcas off San Juan Island and a sunrise hike at Mount Rainier.",
        category: "travel"
      }
    ],
    "2023-10-20": [
      {
        headline: "🍁 DC & Shenandoah National Park",
        description: "Fall foliage in Shenandoah and Luray Caverns.",
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
        description: "The guitar-shaped Hard Rock Hotel and its light show.",
        category: "travel"
      }
    ],
    "2024-03-15": [
      {
        headline: "🤠 Texas",
        description: "Dallas, San Antonio, Austin",
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
        headline: "🚣 Adirondacks",
        description: "Lake Placid on July 4th, a 7-hour hike to Indian Head, and a day rafting the Hudson River Gorge.",
        category: "travel"
      }
    ],
    "2024-08-02": [
      {
        headline: "🐱 Adopted Humi",
        home: true,
        homeLabel: "Adopted Humi",
        description: "A tabby kitten, now with her own Instagram: https://www.instagram.com/little.humi/",
        category: "personal"
      }
    ],
    "2024-10-12": [
      {
        headline: "📒 New Haven",
        description: "Toured Yale",
        category: "travel"
      }
    ],
    "2024-11-28": [
      {
        headline: "🐠 Puerto Rico",
        description: "El Yunque, Flamenco Beach on Culebra, and the bioluminescent bay on Vieques.",
        category: "travel"
      }
    ],
    "2024-12-30": [
      {
        headline: "🌵 Arizona",
        description: "New Year's in Sedona, then Antelope Canyon, Meteor Crater and the saguaros around Tucson.",
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
        description: "Arches, Canyonlands, Bryce and Zion in five days, ending in Las Vegas.",
        category: "travel"
      }
    ],
    "2025-06-05": [
      {
        headline: "🐻 Cornell Reunion",
        description: "Back in Ithaca for my 5-year reunion.",
        category: "personal"
      }
    ],
    "2025-07-04": [
      {
        headline: "🏔️ Colorado",
        description: "Sky Pond in Rocky Mountain National Park, Trail Ridge Road and Pikes Peak.",
        category: "travel"
      }
    ],
    "2025-07-30": [
      {
        headline: "💍 Married at City Hall",
        home: true,
        homeLabel: "Married",
        category: "personal"
      }
    ],
    "2025-08-29": [
      {
        headline: "🧊 Alaska",
        description: "Landed on a glacier by helicopter, watched bears catch salmon at Brooks Falls, and fished for halibut out of Seward.",
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
    "2025-10-18": [
      {
        headline: "🐺 Princeton and a wolfdog farm",
        description: "Howling Woods Farm, then Princeton in the fall.",
        category: "travel"
      }
    ],
    "2025-11-26": [
      {
        headline: "🦭 Tampa",
        description: "Wild manatees at Crystal River and the Ringling in Sarasota.",
        category: "travel"
      }
    ],
    "2025-12-12": [
      {
        headline: "🌮 New Mexico",
        description: "Cliff dwellings at Bandelier, Chaco Canyon, White Sands, Carlsbad Caverns and Roswell.",
        category: "travel"
      }
    ],
    "2025-12-21": [
      {
        headline: "⛲ Southern California",
        description: "Christmas in Joshua Tree, sea lions in La Jolla, and a last sunset in Malibu.",
        category: "travel"
      }
    ],
    "2026-03-15": [
      {
        headline: "🏝️ US Virgin Islands",
        description: "Snorkeled with sea turtles off St. John.",
        category: "travel"
      }
    ],
    "2026-05-15": [
      {
        headline: "🌺 Hawaii",
        description: "Borrowed a shelter dog for a day on Kauai.",
        category: "travel"
      }
    ],
    "2025-01-01": [
      {
        headline: "📊 Joined AI for Analytics",
        home: true,
        homeLabel: "AI for Analytics",
        milestone: true,
        description: "Built AI agents to boost productivity in analytics at Meta",
        category: "work"
      }
    ],
    "2025-06-01": [
      {
        headline: "🧪 Joined AI for Experimentation",
        home: true,
        homeLabel: "AI for Experimentation",
        milestone: true,
        description: "Using AI to help Meta make better and faster decisions through experimentation",
        category: "work"
      }
    ],
    "2026-02-01": [
      {
        headline: "🧭 Became Agent Captain",
        home: true,
        homeLabel: "Agent Captain",
        milestone: true,
        description: "Leading the shift to AI-native workflows at Meta",
        category: "work"
      }
    ],
    "2026-06-01": [
      {
        headline: "🌉 San Francisco",
        description: "Extended stay in San Francisco",
        category: "travel"
      }
    ],
    "2026-07-03": [
      {
        headline: "🌲 Sequoia & Kings Canyon",
        description: "General Sherman, a drive through Tunnel Log, and Cat Haven on the way.",
        category: "travel"
      }
    ],
    "2026-09-01": [
      {
        headline: "✨ Joined New AI Bets · AIGC",
        home: true,
        homeLabel: "AIGC · New AI Bets",
        milestone: true,
        description: "Working on AI-generated content (AIGC) in Meta's New AI Bets group",
        category: "work"
      }
    ],
    "2026-09-05": [
      {
        headline: "🇲🇽 Mexico City",
        category: "travel"
      }
    ],
    "2026-10-10": [
      {
        headline: "🏜️ Orange County, Death Valley & Las Vegas",
        description: "Orange County and the coast at Laguna Niguel, then a drive through Death Valley to Las Vegas.",
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

