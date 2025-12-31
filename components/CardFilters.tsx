'use client'

import { useState, useEffect, useRef } from 'react'

interface CardFiltersProps {
  onFilterChange: (filters: FilterState) => void
  showAdvanced?: boolean
  onToggleAdvanced?: () => void
  initialFilters?: FilterState
}

export interface FilterState {
  name: string
  type: string
  race: string
  attribute: string
}

export default function CardFilters({ onFilterChange, showAdvanced = false, onToggleAdvanced, initialFilters }: CardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    name: '',
    type: '',
    race: '',
    attribute: '',
  })
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const latestFiltersRef = useRef<FilterState>(filters)
  const onFilterChangeRef = useRef(onFilterChange)
  const urlNameRef = useRef<string>(initialFilters?.name || '')
  const isUserTypingRef = useRef(false)

  // Keep ref updated with latest callback
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange
  }, [onFilterChange])

  // Sync with initialFilters when URL changes (but not when user is typing)
  useEffect(() => {
    if (initialFilters) {
      const urlName = initialFilters.name || ''
      const urlChanged = urlName !== urlNameRef.current
      
      // Only sync if URL changed and user isn't actively typing
      if (urlChanged && !isUserTypingRef.current) {
        setFilters(initialFilters)
        latestFiltersRef.current = initialFilters
        urlNameRef.current = urlName
      } else if (!isUserTypingRef.current) {
        // Update ref even if we don't sync (to track URL state)
        urlNameRef.current = urlName
      }
    }
  }, [initialFilters?.name, initialFilters?.type, initialFilters?.race, initialFilters?.attribute])

  // Update ref whenever filters change
  useEffect(() => {
    latestFiltersRef.current = filters
  }, [filters])

  // Debounced effect for name search only
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Only debounce name changes (when name differs from URL)
    const nameChanged = filters.name !== urlNameRef.current
    
    if (nameChanged) {
      // Debounce name search
      debounceTimer.current = setTimeout(() => {
        // Read the absolute latest value from ref
        const currentLatest = latestFiltersRef.current
        if (currentLatest.name !== urlNameRef.current) {
          onFilterChangeRef.current(currentLatest)
          isUserTypingRef.current = false
        }
      }, 500)
    }

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [filters.name])

  const handleChange = (key: keyof FilterState, value: string) => {
    // Update state immediately - never blocked
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    latestFiltersRef.current = newFilters
    
    // For non-name filters, trigger search immediately
    if (key !== 'name') {
      onFilterChangeRef.current(newFilters)
    } else {
      // Mark that user is typing for name field
      isUserTypingRef.current = true
    }
    // For name, the useEffect above will handle debounced search
  }

  const clearFilters = () => {
    const emptyFilters = { name: '', type: '', race: '', attribute: '' }
    setFilters(emptyFilters)
    latestFiltersRef.current = emptyFilters
    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    onFilterChangeRef.current(emptyFilters)
  }

  return (
    <>
      {/* Text Search Only - Always Visible */}
      <div className="bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Search Cards
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                id="name"
                value={filters.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Text Search"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {showAdvanced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Filter Cards</h2>
                <button
                  onClick={onToggleAdvanced}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    id="type"
                    value={filters.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Normal Monster">Normal Monster</option>
                    <option value="Effect Monster">Effect Monster</option>
                    <option value="Spell Card">Spell Card</option>
                    <option value="Trap Card">Trap Card</option>
                    <option value="Fusion Monster">Fusion Monster</option>
                    <option value="Synchro Monster">Synchro Monster</option>
                    <option value="XYZ Monster">XYZ Monster</option>
                    <option value="Link Monster">Link Monster</option>
                    <option value="Pendulum Monster">Pendulum Monster</option>
                  </select>
                </div>

                {/* Race Filter */}
                <div>
                  <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-2">
                    Race
                  </label>
                  <select
                    id="race"
                    value={filters.race}
                    onChange={(e) => handleChange('race', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Races</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Spellcaster">Spellcaster</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Fiend">Fiend</option>
                    <option value="Fairy">Fairy</option>
                    <option value="Beast">Beast</option>
                    <option value="Machine">Machine</option>
                    <option value="Aqua">Aqua</option>
                    <option value="Pyro">Pyro</option>
                    <option value="Rock">Rock</option>
                    <option value="Winged Beast">Winged Beast</option>
                    <option value="Plant">Plant</option>
                    <option value="Insect">Insect</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Fish">Fish</option>
                    <option value="Sea Serpent">Sea Serpent</option>
                    <option value="Thunder">Thunder</option>
                    <option value="Dinosaur">Dinosaur</option>
                    <option value="Beast-Warrior">Beast-Warrior</option>
                    <option value="Zombie">Zombie</option>
                    <option value="Psychic">Psychic</option>
                    <option value="Divine-Beast">Divine-Beast</option>
                    <option value="Wyrm">Wyrm</option>
                    <option value="Cyberse">Cyberse</option>
                  </select>
                </div>

                {/* Attribute Filter */}
                <div>
                  <label htmlFor="attribute" className="block text-sm font-medium text-gray-700 mb-2">
                    Attribute
                  </label>
                  <select
                    id="attribute"
                    value={filters.attribute}
                    onChange={(e) => handleChange('attribute', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Attributes</option>
                    <option value="DARK">DARK</option>
                    <option value="LIGHT">LIGHT</option>
                    <option value="EARTH">EARTH</option>
                    <option value="WATER">WATER</option>
                    <option value="FIRE">FIRE</option>
                    <option value="WIND">WIND</option>
                    <option value="DIVINE">DIVINE</option>
                  </select>
                </div>
              </div>

              {/* Clear Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}