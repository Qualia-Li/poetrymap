'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Location } from '@/types'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-text">正在加载地图...</p>
      </div>
    </div>
  ),
})

interface MapPageClientProps {
  locations: Location[]
}

export default function MapPageClient({ locations }: MapPageClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = locations.filter(loc => {
    const typeMatch = filterType === 'all' || loc.type === filterType
    const searchMatch = searchQuery === '' ||
      loc.name.includes(searchQuery) ||
      loc.aliases.some(a => a.includes(searchQuery)) ||
      loc.modernName.includes(searchQuery)
    return typeMatch && searchMatch
  })

  return (
    <div className="h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <MapComponent
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>

        <Sidebar
          selectedLocation={selectedLocation}
          locations={filteredLocations}
          onLocationSelect={setSelectedLocation}
        />
      </div>
    </div>
  )
}
