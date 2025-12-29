export interface Poem {
  poem_id: number
  title: string
  author: string
  content: string
  relevant_lines: string[]
  keyword: string
}

export interface Location {
  id: string
  name: string
  type: string
  aliases: string[]
  modernName: string
  coordinates: number[]
  description: string
  poems: Poem[]
}

export interface PoemWithLocations {
  id: number
  title: string
  author: string
  contents: string
  type: string
  locations: string[]
}
