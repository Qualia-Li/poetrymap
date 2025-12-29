'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import locationsData from '@/data/analyzed_locations.json'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

// 动态导入地图组件以避免SSR问题
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

export interface Location {
  id: string
  name: string
  type: string
  aliases: string[]
  modernName: string
  coordinates: [number, number]
  description: string
  poems: Array<{
    poem_id: number
    title: string
    author: string
    content: string
    relevant_lines: string[]
    keyword: string
  }>
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const locations: Location[] = locationsData.locations

  // 过滤有诗句的地点
  const locationsWithPoems = locations.filter(loc => loc.poems && loc.poems.length > 0)

  // 根据类型和搜索词过滤
  const filteredLocations = locationsWithPoems.filter(loc => {
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
        {/* 地图区域 */}
        <div className="flex-1 relative">
          <MapComponent
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>

        {/* 侧边栏 */}
        <Sidebar
          selectedLocation={selectedLocation}
          locations={filteredLocations}
          onLocationSelect={setSelectedLocation}
        />
      </div>
    </div>
  )
}
