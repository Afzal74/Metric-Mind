'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, RotateCcw, Play, Pause,
  MousePointer, Settings, Camera, AlertCircle, Info
} from 'lucide-react'

// SVG-based mandible representation
function SVGMandible({ morphFactor = 0 }: { morphFactor: number }) {
  const scale = 1 + morphFactor * 0.2
  const strokeWidth = morphFactor > 0.5 ? 3 : 2
  const color = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'
  const strokeColor = morphFactor > 0.5 ? '#e0d5b7' : '#e8d5b7'

  return (
    <svg 
      viewBox="0 0 400 300" 
      className="w-full h-full"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Background gradient */}
      <defs>
        <radialGradient id="boneGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={strokeColor} />
        </radialGradient>
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="200" cy="280" rx="180" ry="15" fill="url(#shadowGradient)" opacity="0.5" />

      {/* Main mandible body */}
      <path
        d="M 80 200 Q 200 220 320 200 Q 320 180 300 160 Q 200 170 100 160 Q 80 180 80 200"
        fill="url(#boneGradient)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Left ramus */}
      <path
        d="M 100 160 L 90 80 Q 95 70 105 75 L 120 150"
        fill="url(#boneGradient)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Right ramus */}
      <path
        d="M 300 160 L 310 80 Q 305 70 295 75 L 280 150"
        fill="url(#boneGradient)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Left condyle */}
      <circle
        cx="95"
        cy="75"
        r={8 + morphFactor * 3}
        fill={strokeColor}
        stroke={color}
        strokeWidth="2"
      />

      {/* Right condyle */}
      <circle
        cx="305"
        cy="75"
        r={8 + morphFactor * 3}
        fill={strokeColor}
        stroke={color}
        strokeWidth="2"
      />

      {/* Left coronoid process */}
      <path
        d="M 110 120 L 105 100 Q 108 95 115 100 L 120 120"
        fill={strokeColor}
        stroke={color}
        strokeWidth="2"
      />

      {/* Right coronoid process */}
      <path
        d="M 290 120 L 295 100 Q 292 95 285 100 L 280 120"
        fill={strokeColor}
        stroke={color}
        strokeWidth="2"
      />

      {/* Gonial angles */}
      <circle cx="90" cy="190" r={4 + morphFactor * 2} fill={strokeColor} />
      <circle cx="310" cy="190" r={4 + morphFactor * 2} fill={strokeColor} />

      {/* Mental protuberance (chin) */}
      <ellipse
        cx="200"
        cy="210"
        rx={12 + morphFactor * 4}
        ry={8 + morphFactor * 2}
        fill={strokeColor}
        stroke={color}
        strokeWidth="1"
      />

      {/* Measurement indicators */}
      <g opacity="0.7">
        {/* M1 Length line */}
        <line x1="90" y1="190" x2="200" y2="210" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* M2 Bicondylar breadth line */}
        <line x1="95" y1="75" x2="305" y2="75" stroke="#4ecdc4" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* M7 Ramus height line */}
        <line x1="95" y1="75" x2="90" y2="190" stroke="#96ceb4" strokeWidth="2" strokeDasharray="5,5" />
      </g>

      {/* Labels */}
      <text x="200" y="30" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
        {morphFactor > 0.5 ? 'Male' : 'Female'} Mandible
      </text>
      <text x="200" y="50" textAnchor="middle" fill="#cccccc" fontSize="12">
        Morphing: {Math.round(morphFactor * 100)}%
      </text>
    </svg>
  )
}

export function FallbackViewer({ className = "" }: { className?: string }) {
  const [morphFactor, setMorphFactor] = useState(0)
  const [showVariation, setShowVariation] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const features = [
    { id: 'M1', name: 'M1 Length', color: '#ff6b6b', description: 'Maximum mandibular length' },
    { id: 'M2', name: 'M2 Bicondylar breadth', color: '#4ecdc4', description: 'Width between condyles' },
    { id: 'M7', name: 'M7 Ramus Height', color: '#96ceb4', description: 'Height from condyle to gonion' },
    { id: 'M9', name: 'M9 Gonial angle', color: '#45b7d1', description: 'Angle of mandibular corner' },
    { id: 'M12', name: 'M12 C-C Distance', color: '#feca57', description: 'Distance between coronoids' }
  ]

  const handleMorphToggle = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setShowVariation(!showVariation)
      
      const targetMorph = showVariation ? 0 : 1
      const startMorph = morphFactor
      const duration = 2000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        
        setMorphFactor(startMorph + (targetMorph - startMorph) * eased)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      animate()
    }
  }

  const resetView = () => {
    setMorphFactor(0)
    setShowVariation(false)
    setSelectedFeature(null)
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Eye className="w-8 h-8 text-blue-400" />
            <span>2D Mandible Viewer</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Educational visualization of mandibular anatomy and measurements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WebGL Notice */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <Info className="w-5 h-5" />
              <span className="font-semibold">2D Fallback Mode</span>
            </div>
            <p className="text-sm text-amber-300">
              This is a 2D representation of the mandible. For the full 3D experience, ensure WebGL is enabled in your browser.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Feature Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">Measurements</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={selectedFeature === feature.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFeature(feature.id)}
                    className="w-full justify-start text-left"
                    style={{ 
                      borderColor: selectedFeature === feature.id ? feature.color : undefined,
                      backgroundColor: selectedFeature === feature.id ? `${feature.color}20` : undefined
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: feature.color }}
                    />
                    {feature.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Controls */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">View Controls</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset View
                </Button>
                <Button
                  variant={showVariation ? "default" : "outline"}
                  size="sm"
                  onClick={handleMorphToggle}
                  disabled={isAnimating}
                  className="w-full"
                >
                  {isAnimating ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {showVariation ? 'Show Female' : 'Show Male'} Variation
                </Button>
              </div>
            </div>

            {/* Feature Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">Feature Info</h3>
              {selectedFeature ? (
                <div className="space-y-2">
                  <Badge 
                    variant="default" 
                    className="w-full justify-center"
                    style={{ backgroundColor: features.find(f => f.id === selectedFeature)?.color }}
                  >
                    {features.find(f => f.id === selectedFeature)?.name}
                  </Badge>
                  <p className="text-sm text-gray-300 p-3 bg-gray-800/50 rounded-lg">
                    {features.find(f => f.id === selectedFeature)?.description}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 p-3 bg-gray-800/50 rounded-lg">
                  Select a measurement to view details and highlight it on the diagram
                </p>
              )}
            </div>
          </div>

          {/* 2D Viewer */}
          <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <div className="w-full h-full flex items-center justify-center p-8">
              <SVGMandible morphFactor={morphFactor} />
            </div>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Camera className="w-3 h-3 mr-1" />
                2D Educational Diagram
              </Badge>
              {isAnimating && (
                <Badge variant="default" className="bg-blue-600/90 text-white animate-pulse">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Morphing anatomy...
                </Badge>
              )}
            </div>

            {/* Morph Progress */}
            {showVariation && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between text-sm text-white mb-2">
                    <span>Female</span>
                    <span>{Math.round(morphFactor * 100)}% Male</span>
                    <span>Male</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${morphFactor * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4" />
              <span>Click measurements to highlight</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Educational 2D representation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Toggle to see gender differences</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}