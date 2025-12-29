import locationsData from '@/data/analyzed_locations.json'
import poemsData from '@/data/poems.json'
import type { Location, PoemWithLocations } from '@/types'

export function getLocations(): Location[] {
  return locationsData.locations as Location[]
}

export function getLocationsWithPoems(): Location[] {
  return getLocations().filter(loc => loc.poems && loc.poems.length > 0)
}

export function getLocationById(id: string): Location | undefined {
  return getLocations().find(loc => loc.id === id)
}

export function getLocationByName(name: string): Location | undefined {
  return getLocations().find(
    loc => loc.name === name || loc.aliases.includes(name)
  )
}

export function getPoems(): PoemWithLocations[] {
  return poemsData as PoemWithLocations[]
}

export function getPoemById(id: number): PoemWithLocations | undefined {
  return getPoems().find(poem => poem.id === id)
}

export function getPoemsWithLocations(): PoemWithLocations[] {
  return getPoems().filter(poem => poem.locations && poem.locations.length > 0)
}

export function getLocationStats() {
  const locations = getLocationsWithPoems()
  const poems = getPoemsWithLocations()

  const byType: Record<string, number> = {}
  locations.forEach(loc => {
    byType[loc.type] = (byType[loc.type] || 0) + 1
  })

  const topLocations = [...locations]
    .sort((a, b) => b.poems.length - a.poems.length)
    .slice(0, 10)

  return {
    totalLocations: locations.length,
    totalPoems: poems.length,
    byType,
    topLocations,
  }
}
