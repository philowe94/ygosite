'use client'

import { useState } from 'react'

interface CardFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  name: string
  type: string
  race: string
  attribute: string
}

export default function CardFilters({ onFilterChange }: CardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    type: '',
    race: '',
    attribute: '',
  })

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { name: '', type: '', race: '', attribute: '' }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        {/* Name Search */}
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Card Name
          </label>
          <input
            type="text"
            id="name"
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div className="md:w-48">
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
        <div className="md:w-48">
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
        <div className="md:w-48">
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

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
