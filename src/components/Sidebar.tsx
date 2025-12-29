'use client'

import { useState } from 'react'
import type { Location } from '@/app/page'

interface SidebarProps {
  selectedLocation: Location | null
  locations: Location[]
  onLocationSelect: (location: Location) => void
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
  city: '城市',
  mountain: '山川',
  river: '河流',
  lake: '湖泊',
  region: '地区',
  foreign: '域外',
  landmark: '名胜',
}

export default function Sidebar({
  selectedLocation,
  locations,
  onLocationSelect,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list')
  const [expandedPoem, setExpandedPoem] = useState<number | null>(null)

  // 按诗句数量排序
  const sortedLocations = [...locations].sort((a, b) => b.poems.length - a.poems.length)

  return (
    <aside className="w-96 sidebar flex flex-col h-full overflow-hidden">
      {/* 标签切换 */}
      <div className="flex border-b border-secondary/30">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 text-center font-medium transition ${
            activeTab === 'list'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text/60 hover:text-text'
          }`}
        >
          地点列表
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3 text-center font-medium transition ${
            activeTab === 'detail'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text/60 hover:text-text'
          }`}
        >
          诗句详情
        </button>
      </div>

      {/* 列表视图 */}
      {activeTab === 'list' && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* 图例 */}
          <div className="mb-4 p-3 bg-white/50 rounded-lg">
            <div className="text-sm font-medium text-text/80 mb-2">类型图例</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeNames).map(([type, name]) => (
                <div key={type} className="legend-item text-sm">
                  <div
                    className="legend-dot"
                    style={{ backgroundColor: typeColors[type] }}
                  />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mb-4 text-sm text-text/70">
            共 <span className="font-bold text-primary">{locations.length}</span> 个地点，
            涉及 <span className="font-bold text-primary">
              {new Set(locations.flatMap(l => l.poems.map(p => p.poem_id))).size}
            </span> 首诗
          </div>

          {/* 地点列表 */}
          <div className="space-y-2">
            {sortedLocations.map(location => (
              <button
                key={location.id}
                onClick={() => {
                  onLocationSelect(location)
                  setActiveTab('detail')
                }}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedLocation?.id === location.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: typeColors[location.type] }}
                    />
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-text/50">({location.modernName})</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {location.poems.length}首
                  </span>
                </div>
                {location.aliases.length > 0 && (
                  <div className="text-xs text-text/50 mt-1 ml-5">
                    别称：{location.aliases.slice(0, 3).join('、')}
                    {location.aliases.length > 3 && '...'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 详情视图 */}
      {activeTab === 'detail' && (
        <div className="flex-1 overflow-y-auto p-4">
          {selectedLocation ? (
            <>
              {/* 地点信息 */}
              <div className="mb-4 p-4 bg-gradient-to-br from-white to-accent/10 rounded-lg border border-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: typeColors[selectedLocation.type] }}
                  />
                  <h2 className="text-xl font-bold text-primary">
                    {selectedLocation.name}
                  </h2>
                  <span className="text-sm text-text/50">
                    ({selectedLocation.modernName})
                  </span>
                </div>
                <p className="text-sm text-text/70 mb-2">
                  {selectedLocation.description}
                </p>
                {selectedLocation.aliases.length > 0 && (
                  <div className="text-sm">
                    <span className="text-text/50">诗中别称：</span>
                    <span className="text-secondary font-medium">
                      {selectedLocation.aliases.join('、')}
                    </span>
                  </div>
                )}
              </div>

              {/* 相关诗句 */}
              <div className="text-sm text-text/70 mb-3">
                共有 <span className="font-bold text-primary">{selectedLocation.poems.length}</span> 首诗提及此地
              </div>

              <div className="space-y-3">
                {selectedLocation.poems.map((poem, index) => (
                  <div
                    key={`${poem.poem_id}-${index}`}
                    className="poem-card cursor-pointer"
                    onClick={() => setExpandedPoem(
                      expandedPoem === poem.poem_id ? null : poem.poem_id
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="poem-title">《{poem.title}》</div>
                      <svg
                        className={`w-4 h-4 text-text/50 transition-transform ${
                          expandedPoem === poem.poem_id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <div className="poem-author">{poem.author}</div>

                    {/* 相关诗句高亮 */}
                    {poem.relevant_lines.length > 0 && (
                      <div className="mt-2 text-sm">
                        {poem.relevant_lines.map((line, i) => (
                          <div key={i} className="highlighted-line mb-1">
                            {line}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 展开显示完整诗句 */}
                    {expandedPoem === poem.poem_id && (
                      <div className="mt-3 pt-3 border-t border-secondary/30">
                        <div className="poem-content">
                          {poem.content.split('\n').map((line, i) => {
                            const isHighlighted = poem.relevant_lines.some(rl =>
                              line.includes(rl) || rl.includes(line)
                            )
                            return (
                              <div
                                key={i}
                                className={isHighlighted ? 'highlighted-line' : ''}
                              >
                                {line}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text/50">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>请在地图上选择一个地点</p>
              <p className="text-sm mt-1">或从列表中点击查看</p>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
