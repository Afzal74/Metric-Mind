'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MandibleGeometry } from './mandible-geometry'
import { SimpleMandible } from './simple-mandible'
import { ErrorBoundary } from './error-boundary'
import { 
  Eye, RotateCcw, Play, Pause,
  MousePointer, Settings, Camera
} from 'lucide-react'

// Feature definitions with anatomical data
const MANDIBLE_FEATURES = [
  {
    id: 'M1',
    name: 'M1 Length',
    description: 'Maximum mandibular length from gonion to gnathion',
    viewAngle: { position: [0, 0, 5], target: [0, 0, 0] },
    landmarks: [
      { name: 'Gonion', position: [-2.5, -1, 0], color: '#ff6b6b' },
      { name: 'Gnathion', position: [0, -2, 0], color: '#ff6b6b' }
    ],
    measurementLine: {
      points: [[-2.5, -1, 0], [0, -2, 0]],
      color: '#ff6b6b'
    }
  },
  {
    id: 'M2',
    name: 'M2 Bicondylar breadth',
    description: 'Maximum width between the lateral surfaces of the condyles',
    viewAngle: { position: [0, 5, 0], target: [0, 0, 0] },
    landmarks: [
      { name: 'Left Condyle', position: [-3, 1.5, 0], color: '#4ecdc4' },
      { name: 'Right Condyle', position: [3, 1.5, 0], color: '#4ecdc4' }
    ],
    measurementLine: {
      points: [[-3, 1.5, 0], [3, 1.5, 0]],
      color: '#4ecdc4'
    }
  },
  {
    id: 'M9',
    name: 'M9 Gonial angle',
    description: 'Angle between the ramus and body of the mandible',
    viewAngle: { position: [-5, 0, 2], target: [-2, -1, 0] },
    landmarks: [
      { name: 'Gonion', position: [-2.5, -1, 0], color: '#45b7d1' },
      { name: 'Ramus Point', position: [-2.5, 1, 0], color: '#45b7d1' },
      { name: 'Body Point', position: [0, -1, 0], color: '#45b7d1' }
    ],
    measurementLine: {
      points: [[-2.5, 1, 0], [-2.5, -1, 0], [0, -1, 0]],
      color: '#45b7d1'
    }
  },
  {
    id: 'M7',
    name: 'M7 Condylar Ramus Height',
    description: 'Height from condyle to gonion',
    viewAngle: { position: [-3, 0, 3], target: [-2.5, 0, 0] },
    landmarks: [
      { name: 'Condyle', position: [-2.5, 1.5, 0], color: '#96ceb4' },
      { name: 'Gonion', position: [-2.5, -1, 0], color: '#96ceb4' }
    ],
    measurementLine: {
      points: [[-2.5, 1.5, 0], [-2.5, -1, 0]],
      color: '#96ceb4'
    }
  },
  {
    id: 'M12',
    name: 'M12 C-C Distance',
    description: 'Distance between coronoid processes',
    viewAngle: { position: [0, 3, 3], target: [0, 0.5, 0] },
    landmarks: [
      { name: 'Left Coronoid', position: [-2, 0.5, 0], color: '#feca57' },
      { name: 'Right Coronoid', position: [2, 0.5, 0], color: '#feca57' }
    ],
    measurementLine: {
      points: [[-2, 0.5, 0], [2, 0.5, 0]],
      color: '#feca57'
    }
  }
]

// Landmark component
function Landmark({ 
  position, 
  name, 
  color, 
  onClick, 
  isVisible 
}: { 
  position: [number, number, number]
  name: string
  color: string
  onClick: () => void
  isVisible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  
  if (!isVisible) return null

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {hovered && (
        <mesh position={[0, 0.3, 0]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// Measurement line component
function MeasurementLine({ 
  points, 
  color, 
  isVisible 
}: { 
  points: [number, number, number][]
  color: string
  isVisible: boolean
}) {
  if (!isVisible || points.length < 2) return null

  // Simple line representation using cylinders
  const lineElements = []
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]
    const midpoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    ]
    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) +
      Math.pow(end[1] - start[1], 2) +
      Math.pow(end[2] - start[2], 2)
    )
    
    lineElements.push(
      <mesh key={i} position={midpoint as [number, number, number]}>
        <cylinderGeometry args={[0.02, 0.02, distance]} />
        <meshBasicMaterial color={color} />
      </mesh>
    )
  }
  
  return <group>{lineElements}</group>
}

// Camera controller component
function CameraController({ 
  targetPosition, 
  targetLookAt 
}: { 
  targetPosition: [number, number, number]
  targetLookAt: [number, number, number]
}) {
  const { camera } = useThree()
  
  useEffect(() => {
    // Smooth camera transition
    const startPos = camera.position.clone()
    const endPos = new Vector3(...targetPosition)
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      
      camera.position.lerpVectors(startPos, endPos, eased)
      camera.lookAt(...targetLookAt)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [camera, targetPosition, targetLookAt])

  return null
}

// Main component
export function MandibleViewer({ 
  maleMean = {},
  femaleMean = {},
  className = ""
}: {
  maleMean?: Record<string, number>
  femaleMean?: Record<string, number>
  className?: string
}) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [showVariation, setShowVariation] = useState(false)
  const [morphFactor, setMorphFactor] = useState(0) // 0 = female, 1 = male
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5])
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0])
  const [use3DFallback, setUse3DFallback] = useState(false)

  const currentFeature = MANDIBLE_FEATURES.find(f => f.id === selectedFeature)

  const handleFeatureSelect = (featureId: string) => {
    const feature = MANDIBLE_FEATURES.find(f => f.id === featureId)
    if (feature) {
      setSelectedFeature(featureId)
      setCameraPosition(feature.viewAngle.position as [number, number, number])
      setCameraTarget(feature.viewAngle.target as [number, number, number])
    }
  }

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
    setSelectedFeature(null)
    setCameraPosition([0, 0, 5])
    setCameraTarget([0, 0, 0])
    setSelectedLandmark(null)
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Eye className="w-8 h-8 text-blue-400" />
            <span>Interactive 3D Mandible Viewer</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Explore forensic landmarks and measurements in 3D space
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Feature Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">Measurements</h3>
              <div className="space-y-2">
                {MANDIBLE_FEATURES.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={selectedFeature === feature.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFeatureSelect(feature.id)}
                    className="w-full justify-start text-left"
                  >
                    <MousePointer className="w-4 h-4 mr-2" />
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
              {currentFeature ? (
                <div className="space-y-2">
                  <Badge variant="default" className="w-full justify-center">
                    {currentFeature.name}
                  </Badge>
                  <p className="text-sm text-gray-300 p-3 bg-gray-800/50 rounded-lg">
                    {currentFeature.description}
                  </p>
                  <div className="text-xs text-gray-400">
                    Landmarks: {currentFeature.landmarks.length}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 p-3 bg-gray-800/50 rounded-lg">
                  Select a measurement to view anatomical landmarks and details
                </p>
              )}
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <ErrorBoundary>
              <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
              onCreated={({ gl }) => {
                try {
                  gl.setClearColor('#1a1a2e')
                } catch (error) {
                  console.warn('WebGL setup warning:', error)
                  setUse3DFallback(true)
                }
              }}
            >
              <Suspense fallback={
                <mesh>
                  <boxGeometry args={[2, 1, 1]} />
                  <meshBasicMaterial color="#666666" />
                </mesh>
              }>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />

                {/* Camera Controller */}
                <CameraController 
                  targetPosition={cameraPosition}
                  targetLookAt={cameraTarget}
                />

                {/* Controls */}
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={10}
                  minDistance={2}
                />

                {/* Mandible Model - Use fallback if needed */}
                {use3DFallback ? (
                  <SimpleMandible 
                    morphFactor={morphFactor}
                    selectedFeature={selectedFeature}
                  />
                ) : (
                  <MandibleGeometry 
                    morphFactor={morphFactor}
                    selectedFeature={selectedFeature}
                  />
                )}

                {/* Landmarks and Measurements */}
                {currentFeature && (
                  <>
                    {/* Landmarks */}
                    {currentFeature.landmarks.map((landmark, index) => (
                      <Landmark
                        key={index}
                        position={landmark.position as [number, number, number]}
                        name={landmark.name}
                        color={landmark.color}
                        onClick={() => setSelectedLandmark(landmark.name)}
                        isVisible={true}
                      />
                    ))}

                    {/* Measurement Line */}
                    <MeasurementLine
                      points={currentFeature.measurementLine.points as [number, number, number][]}
                      color={currentFeature.measurementLine.color}
                      isVisible={true}
                    />
                  </>
                )}

                {/* Grid */}
                <gridHelper args={[10, 10, '#444444', '#222222']} />
              </Suspense>
              </Canvas>
            </ErrorBoundary>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Camera className="w-3 h-3 mr-1" />
                Use mouse to orbit, zoom, and pan
              </Badge>
              {isAnimating && (
                <Badge variant="default" className="bg-blue-600/90 text-white animate-pulse">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Morphing geometry...
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
              <span>Click landmarks for details</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Select measurements to focus view</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Toggle variation to see gender differences</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}