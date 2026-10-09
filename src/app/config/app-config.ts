// Application Configuration
// Central configuration file for Life in Weeks app settings

export interface AppConfig {
  // Display Settings
  maxAge: number                    // Maximum age to display (years)
  
  // Default Overlay States
  defaultShowWorldEvents: boolean   // Show world events overlay by default
  defaultShowPresidents: boolean    // Show US presidents overlay by default
  
  // Personal Timeline Settings (birthDate will be provided by server-side config)
  name: string                      // User's display name
  website?: string                  // User's personal website
  
  // Grid Display Settings
  showRowNumbers: boolean           // Display row numbers in grid
  showBirthdayMarkers: boolean      // Show birthday markers
  
  // Life Expectancy Settings
  showLifeExpectancy: boolean       // Show life expectancy marker
  lifeExpectancyAge: number         // Age for life expectancy marker
  showJapanLifeExpectancy: boolean  // Show Japan male life expectancy marker
  japanLifeExpectancyAge: number    // Japan male life expectancy age
  
  // Layout Settings
  defaultCompactMode: boolean       // Start in compact view (fits entire life on screen)
  
  // Privacy Settings
  showPersonalEventDates: boolean   // Show full dates for personal events (false = month/year only)
  
  // Responsive Settings
  debounceResizeMs: number          // Debounce time for window resize events
}

// Default configuration
export const APP_CONFIG: AppConfig = {
  // Display Settings
  maxAge: 85,                       // Show until 85 years old
  
  // Default Overlay States 
  defaultShowWorldEvents: true,     // Show world events for historical context
  defaultShowPresidents: false,     // US presidents off by default (can be enabled if needed)
  
  // Personal Timeline Settings
  name: "Yizhou Yu",
  website: "https://yizhouyu.github.io",
  
  // Grid Display Settings
  showRowNumbers: false,            // Clean look without row numbers
  showBirthdayMarkers: true,        // Keep birthday markers for navigation
  
  // Layout Settings
  defaultCompactMode: false,        // Start with standard view, user can toggle
  
  // Privacy Settings
  showPersonalEventDates: false,    // Hide specific dates for personal events (month/year only)
  
  // Life Expectancy Settings
  showLifeExpectancy: false,        // Off: no countdown framing (owner preference, 2026-10)
  lifeExpectancyAge: 77,            // US male life expectancy
  showJapanLifeExpectancy: false,   // Off: no countdown framing
  japanLifeExpectancyAge: 82,       // Japan male life expectancy
  // Source: https://www.worldometers.info/demographics/life-expectancy/
  // US Life Expectancy 2024: Total 79.25, Male 76.94, Female 81.65
  // Japan Life Expectancy 2024: Total 84.95, Male 82+ (from updated data)
  // Using rounded values: US 77, Japan 82
  
  // Responsive Settings
  debounceResizeMs: 150,            // Smooth resize handling
}

// Derived configuration interface
export interface DerivedConfig {
  birthYear: number
  birthMonth: string
  birthDay: string
  endYear: number
  lifeExpectancyYear: number
  japanLifeExpectancyYear: number
  lifeExpectancyDate: string
  japanLifeExpectancyDate: string
  lifeExpectancyLabel: string
  japanLifeExpectancyLabel: string
  title: string
  description: string
}

// Function to create derived configuration from birth date
export function createDerivedConfig(birthDate: string): DerivedConfig {
  const birthYear = parseInt(birthDate.split('-')[0])
  const birthMonth = birthDate.split('-')[1]
  const birthDay = birthDate.split('-')[2]
  
  return {
    // Extract birth date components
    birthYear,
    birthMonth,
    birthDay,
    
    // Calculate derived years
    endYear: birthYear + APP_CONFIG.maxAge,
    lifeExpectancyYear: birthYear + APP_CONFIG.lifeExpectancyAge,
    japanLifeExpectancyYear: birthYear + APP_CONFIG.japanLifeExpectancyAge,
    
    // Calculate life expectancy dates
    lifeExpectancyDate: `${birthYear + APP_CONFIG.lifeExpectancyAge}-${birthMonth}-${birthDay}`,
    japanLifeExpectancyDate: `${birthYear + APP_CONFIG.japanLifeExpectancyAge}-${birthMonth}-${birthDay}`,
    
    // Generate life expectancy labels
    lifeExpectancyLabel: `🇺🇸 US Male Life Expectancy (${APP_CONFIG.lifeExpectancyAge} years)`,
    japanLifeExpectancyLabel: `🇯🇵 Japan Male Life Expectancy (${APP_CONFIG.japanLifeExpectancyAge} years)`,
    
    // App metadata
    title: `${APP_CONFIG.name}'s Life in Weeks`,
    description: `This is a map of ${APP_CONFIG.name}'s life, where each week I've been alive is a little box.`,
  }
}

// Placeholder for static access (will be replaced by server-side config)
export const DERIVED_CONFIG = {
  endYear: 2071, // placeholder
  lifeExpectancyLabel: `🇺🇸 US Male Life Expectancy (${APP_CONFIG.lifeExpectancyAge} years)`,
  japanLifeExpectancyLabel: `🇯🇵 Japan Male Life Expectancy (${APP_CONFIG.japanLifeExpectancyAge} years)`,
}