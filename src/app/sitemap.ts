import { MetadataRoute } from 'next'
import { getLocationsWithPoems, getPoems } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://poetrymap.quanl.ai'

  const locations = getLocationsWithPoems()
  const poems = getPoems()

  // Get unique authors
  const authors = Array.from(new Set(poems.map((p) => p.author)))

  // Location types
  const locationTypes = ['city', 'mountain', 'river', 'lake', 'region', 'foreign', 'landmark']

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/poems`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Location type pages
  const locationTypePages: MetadataRoute.Sitemap = locationTypes.map((type) => ({
    url: `${baseUrl}/locations/type/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Author pages
  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/poems/author/${encodeURIComponent(author)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Location pages
  const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/locations/${location.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Poem pages
  const poemPages: MetadataRoute.Sitemap = poems.map((poem) => ({
    url: `${baseUrl}/poems/${poem.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...locationTypePages, ...authorPages, ...locationPages, ...poemPages]
}
