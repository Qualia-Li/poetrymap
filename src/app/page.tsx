import { getLocationsWithPoems } from '@/lib/data'
import MapPageClient from '@/components/MapPageClient'

export default function Home() {
  const locations = getLocationsWithPoems()

  return <MapPageClient locations={locations} />
}
