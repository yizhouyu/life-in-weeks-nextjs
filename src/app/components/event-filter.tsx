'use client'

import React from 'react'

export interface EventFilters {
  showPersonalEvents: boolean
  showWorldEvents: boolean
  showPresidents: boolean
  personalCategories: {
    personal: boolean
    education: boolean
    work: boolean
    travel: boolean
    achievement: boolean
  }
}

interface EventFilterProps {
  filters: EventFilters
  setFilters: (filters: EventFilters) => void
}

export function EventFilter({ filters, setFilters }: EventFilterProps) {
  const toggleMainFilter = (key: 'showPersonalEvents' | 'showWorldEvents' | 'showPresidents') => {
    setFilters({
      ...filters,
      [key]: !filters[key]
    })
  }

  const toggleCategoryFilter = (category: keyof EventFilters['personalCategories']) => {
    setFilters({
      ...filters,
      personalCategories: {
        ...filters.personalCategories,
        [category]: !filters.personalCategories[category]
      }
    })
  }

  const allPersonalCategoriesEnabled = Object.values(filters.personalCategories).every(v => v)
  const toggleAllPersonalCategories = () => {
    const newValue = !allPersonalCategoriesEnabled
    setFilters({
      ...filters,
      personalCategories: {
        personal: newValue,
        education: newValue,
        work: newValue,
        travel: newValue,
        achievement: newValue
      }
    })
  }

  const mainChips: Array<{ key: 'showPersonalEvents' | 'showWorldEvents' | 'showPresidents'; label: string }> = [
    { key: 'showPersonalEvents', label: 'Personal events' },
    { key: 'showWorldEvents', label: 'World events' },
    { key: 'showPresidents', label: 'US presidents' },
  ]
  const categoryChips: Array<{ key: keyof EventFilters['personalCategories']; label: string }> = [
    { key: 'personal', label: 'Personal' },
    { key: 'education', label: 'Education' },
    { key: 'work', label: 'Work' },
    { key: 'travel', label: 'Travel' },
    { key: 'achievement', label: 'Achievements' },
  ]

  return (
    <section className="event-filter" aria-labelledby="filters-h">
      <div className="sec-top"><span className="n">02</span><span className="cap" id="filters-h">Filter the overlays</span></div>

      <div className="filter-rows">
        {/* Main event type toggles */}
        <div className="filter-row">
          <span className="filter-label">Show</span>
          <div className="filter-buttons">
            {mainChips.map(({ key, label }) => (
              <label key={key} className={`filter-chip ${filters[key] ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={() => toggleMainFilter(key)}
                  className="filter-checkbox"
                />
                <i className="sq" aria-hidden="true" />
                <span className="filter-chip-text">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Personal event category filters - only show when personal events are enabled */}
        {filters.showPersonalEvents && (
          <div className="filter-row category-section">
            <span className="filter-label">Categories</span>
            <div className="filter-buttons">
              {categoryChips.map(({ key, label }) => (
                <label key={key} className={`filter-chip category-chip ${filters.personalCategories[key] ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={filters.personalCategories[key]}
                    onChange={() => toggleCategoryFilter(key)}
                    className="filter-checkbox"
                  />
                  <i className="sq" aria-hidden="true" />
                  <span className="filter-chip-text">{label}</span>
                </label>
              ))}
              <button
                type="button"
                onClick={toggleAllPersonalCategories}
                className="select-all-btn"
              >
                {allPersonalCategoriesEnabled ? 'Deselect all' : 'Select all'}
              </button>
            </div>
          </div>
        )}

        {/* Key */}
        <div className="filter-row legend-row">
          <span className="filter-label">Key</span>
          <ul className="legend">
            <li className="legend-item legend-ramp">
              <span className="ramp" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ background: `var(--phase-${i})` }} />)}
              </span>
              Chapters, deepening at each milestone
            </li>
            <li className="legend-item"><i className="k k-now" aria-hidden="true" />This week</li>
            <li className="legend-item"><i className="k k-future" aria-hidden="true" />Still ahead</li>
            <li className="legend-item"><i className="k k-ms" aria-hidden="true" />Milestone</li>
            <li className="legend-item"><i className="k k-world" aria-hidden="true" />World event</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
