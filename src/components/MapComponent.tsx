'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Location } from '@/types'

interface MapComponentProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location | null) => void
}

const typeColors: Record<string, string> = {
  city: '#DC143C',
  mountain: '#228B22',
  river: '#4169E1',
  lake: '#00CED1',
  region: '#9370DB',
  foreign: '#FF8C00',
  landmark: '#FFD700',
}

const typeNames: Record<string, string> = {
  city: '城',
  mountain: '山',
  river: '河',
  lake: '湖',
  region: '域',
  foreign: '外',
  landmark: '胜',
}

function createCustomIcon(type: string, isSelected: boolean) {
  const color = typeColors[type] || '#888888'
  const size = isSelected ? 40 : 32
  const typeName = typeNames[type] || '?'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${isSelected ? '3px solid white' : '2px solid rgba(255,255,255,0.7)'};
        transition: all 0.2s;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: ${isSelected ? '14px' : '12px'};
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">${typeName}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

export default function MapComponent({
  locations,
  selectedLocation,
  onLocationSelect,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [mapReady, setMapReady] = useState(false)

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [35, 108],
      zoom: 5,
      minZoom: 3,
      maxZoom: 12,
    })

    // 使用古典风格的地图
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    mapInstanceRef.current = map
    setMapReady(true)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 更新标记
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return

    const map = mapInstanceRef.current

    // 清除旧标记
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current.clear()

    // 添加新标记
    locations.forEach(location => {
      if (!location.coordinates || location.coordinates.length !== 2) return

      const isSelected = selectedLocation?.id === location.id
      const marker = L.marker(
        [location.coordinates[1], location.coordinates[0]],
        { icon: createCustomIcon(location.type, isSelected) }
      )

      // 创建弹出窗口内容
      const poemsHtml = location.poems.slice(0, 3).map(poem => `
        <div class="poem-card">
          <div class="poem-title">《${poem.title}》</div>
          <div class="poem-author">${poem.author}</div>
          <div class="poem-content">${
            poem.relevant_lines.length > 0
              ? poem.relevant_lines.slice(0, 2).map(line =>
                  `<span class="highlighted-line">${line}</span>`
                ).join('<br>')
              : poem.content.split('\n').slice(0, 2).join('<br>')
          }</div>
        </div>
      `).join('')

      const popupContent = `
        <div class="poem-popup">
          <h3>${location.name}（${location.modernName}）</h3>
          <p style="color: #666; font-size: 12px; margin-bottom: 12px;">
            ${location.description}
            ${location.aliases.length > 0 ? `<br>别称：${location.aliases.join('、')}` : ''}
          </p>
          <div style="font-size: 13px; color: #8B4513; margin-bottom: 8px;">
            共有 <strong>${location.poems.length}</strong> 首诗提及此地
          </div>
          ${poemsHtml}
          ${location.poems.length > 3 ? `
            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 8px;">
              点击右侧查看更多...
            </div>
          ` : ''}
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 400,
        className: 'poem-popup-container',
      })

      marker.on('click', () => {
        onLocationSelect(location)
        // On mobile, don't open popup - let sidebar handle it
        const isMobile = window.innerWidth < 768
        if (isMobile) {
          marker.closePopup()
        }
      })

      marker.addTo(map)
      markersRef.current.set(location.id, marker)
    })
  }, [locations, selectedLocation, mapReady, onLocationSelect])

  // 选中位置时移动地图
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return

    const marker = markersRef.current.get(selectedLocation.id)
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 7, { animate: true })
      // Only open popup on desktop
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        marker.openPopup()
      }
    }
  }, [selectedLocation])

  return (
    <div ref={mapRef} className="w-full h-full" />
  )
}
