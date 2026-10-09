/**
 * Life in Weeks - Main Application Page (Server Component)
 * 
 * A visual representation of life where each week is displayed as a box in a grid.
 * This server component loads sensitive data from environment variables safely
 * and passes the processed data to the client component.
 * 
 * Key Features:
 * - Server-side loading of sensitive dates from environment variables
 * - Privacy protection - sensitive data never exposed to client bundle
 * - Responsive grid layout with pixel-perfect calculations
 * - Interactive tooltips and decade navigation
 * 
 * @author Ran Ding
 * @version 1.0.0
 * @since 2024
 */

import { SERVER_CONFIG } from './lib/server-config'
import { createLifeEvents, createWeeksConfig, SensitiveDates } from './data/life-events'
import { createDerivedConfig } from './config/app-config'
import { LifeWeeksClient } from './components/life-weeks-client'
import './weeks.css'

/**
 * Main HomePage Server Component
 * 
 * Loads sensitive data server-side and passes processed data to client
 * 
 * @returns The complete Life in Weeks application
 */
export default function HomePage() {
  // Load sensitive dates from server-side environment variables
  const sensitiveDates: SensitiveDates = {
    birthDate: SERVER_CONFIG.BIRTH_DATE
  }

  // Create derived configuration from birth date
  const derivedConfig = createDerivedConfig(sensitiveDates.birthDate)
  
  // Create life events with sensitive dates
  const lifeEvents = createLifeEvents(sensitiveDates, derivedConfig)
  
  // Create weeks configuration
  const weeksConfig = createWeeksConfig(sensitiveDates.birthDate, derivedConfig)

  // The client swaps this for the visitor's clock right after hydration
  const renderedAt = Date.now()

  return (
    <LifeWeeksClient 
      lifeEvents={lifeEvents}
      weeksConfig={weeksConfig}
      derivedConfig={derivedConfig}
      renderedAt={renderedAt}
    />
  )
}