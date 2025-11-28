'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Line, Sphere, Environment, ContactShadows } from '@react-three/drei'
import { Vector3 } from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RealisticMandible } from './realistic-mandible'
import { 
  Eye, RotateCcw, Play, Pause, MousePointer, Settings, Camera,
  Zap, Info, Target, Maximize2
} from 'lucide-react'

// Anatomical features with precise positioning
const MANDIBLE_FEATURES = [
  {
    id: 'M1',
    name: 'M1 Length',
    description: 'Maximum mandibular length from gonion to gnathion',
    viewAngle: { position: [0, 0, 6], target: [0, -1, 0] },
    landmarks: [
      { name: 'Gonion', position: [-2.4, -1.3, 0], color: '#ff6b6b' },
      { name: 'Gnathion', position: [0, -1.9, 0.4], color: '#ff6b6b' }
    ],
    measurementLine: {
      points: [[-2.4, -1.3, 0], [0, -1.9, 0.4]],
      color: '#ff6b6b'
    }
  },
  {
    id: 'M2',
    name: 'M2 Bicondylar breadth',
    description: 'Maximum width between the lateral surfaces of the condyles',
    viewAngle: { position: [0, 6, 0], target: [0, 1.8, 0] },
    landmarks: [
      { name: 'Left Condyle', position: [-2.6, 1.8, 0], color: '#4ecdc4' },
      { name: 'Right Condyle', position: [2.6, 1.8, 0], color: '#4ecdc4' }
    ],
    measurementLine: {
      points: [[-2.6, 1.8, 0], [2.6, 1.8, 0]],
      color: '#4ecdc4'
    }
  },
  {
    id: 'M9',
    name: 'M9 Gonial angle',
    description: 'Angle between the ramus and body of the mandible',
    viewAngle: { position: [-6, 0, 3], target: [-2.4, -1, 0] },
    landmarks: [
      { name: 'Gonion', position: [-2.4, -1.3, 0], color: '#45b7d1' },
      { name: 'Ramus Point', position: [-2.3, 1, 0], color: '#45b7d1' },
      { name: 'Body Point', position: [0, -1.2, 0], color: '#45b7d1' }
    ],
    measurementLine: {
      points: [[-2.3, 1, 0], [-2.4, -1.3, 0], [0, -1.2, 0]],
      color: '#45b7d1'
    }
  },
  {
    id: 'M7',
    name: 'M7 Condylar Ramus Height',
    description: 'Height from condyle to gonion',
    viewAngle: { position: [-4, 0, 4], target: [-2.5, 0.5, 0] },
    landmarks: [
      { name: 'Condyle', position: [-2.6, 1.8, 0], color: '#96ceb4' },
      { name: 'Gonion', position: [-2.4, -1.3, 0], color: '#96ceb4' }
    ],
    measurementLine: {
      points: [[-2.6, 1.8, 0], [-2.4, -1.3, 0]],
      color: '#96ceb4'
    }
  },
  {
    id: 'M12',
    name: 'M12 C-C Distance',
    description: 'Distance between coronoid processes',
    viewAngle: { position: [0, 4, 4], target: [0, 0.8, 0] },
    landmarks: [
      { name: 'Left Coronoid', position: [-1.8, 0.8, 0], color: '#feca57' },
      { name: 'Right Coronoid', position: [1.8, 0.8, 0], color: '#feca57' }
    ],
    measurementLine: {
      points: [[-1.8, 0.8, 0], [1.8, 0.8, 0]],
      color: '#feca57'
    }
  }
]

// Enhanced landmark component
function EnhancedLandmark({ 
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
      <Sphere
        args={[0.08]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.4 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {/* Pulsing ring effect */}
      {hovered && (
        <mesh>
          <ringGeometry args={[0.12, 0.15, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
      
      {hovered && (
        <mesh position={[0, 0.25, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// Enhanced measurement line
function EnhancedMeasurementLine({ 
  points, 
  color, 
  isVisible 
}: { 
  points: [number, number, number][]
  color: string
  isVisible: boolean
}) {
  if (!isVisible || points.length < 2) return null

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={4}
        dashed={false}
      />
      
      {/* Endpoint markers */}
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

// Camera controller with smooth transitions
function SmoothCameraController({ 
  targetPosition, 
  targetLookAt 
}: { 
  targetPosition: [number, number, number]
  targetLookAt: [number, number, number]
}) {
  const { camera } = useThree()
  
  useEffect(() => {
    const startPos = camera.position.clone()
    const endPos = new Vector3(...targetPosition)
    const duration = 2000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
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

export function Advanced3DViewer({ 
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
  const [morphFactor, setMorphFactor] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 2, 5])
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0])
  const [autoRotate, setAutoRotate] = useState(true)

  const currentFeature = MANDIBLE_FEATURES.find(f => f.id === selectedFeature)

  const handleFeatureSelect = (featureId: string) => {
    const feature = MANDIBLE_FEATURES.find(f => f.id === featureId)
    if (feature) {
      setSelectedFeature(featureId)
      setCameraPosition(feature.viewAngle.position as [number, number, number])
      setCameraTarget(feature.viewAngle.target as [number, number, number])
      setAutoRotate(false)
    }
  }

  const handleMorphToggle = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setShowVariation(!showVariation)
      
      const targetMorph = showVariation ? 0 : 1
      const startMorph = morphFactor
      const duration = 2500
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4) // Smooth ease-out
        
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
    setCameraPosition([5, 2, 5])
    setCameraTarget([0, 0, 0])
    setSelectedLandmark(null)
    setAutoRotate(true)
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Eye className="w-8 h-8 text-blue-400" />
            <span>Advanced 3D Mandible Viewer</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              WebGL
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg">
            Realistic 3D visualization of forensic mandibular anatomy with interactive measurements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Feature Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                Measurements
              </h3>
              <div className="space-y-2">
                {MANDIBLE_FEATURES.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={selectedFeature === feature.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFeatureSelect(feature.id)}
                    className="w-full justify-start text-left transition-all duration-200 hover:scale-105"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: feature.measurementLine.color }}
                    />
                    {feature.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Controls */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-green-400" />
                Controls
              </h3>
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
                  variant={autoRotate ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="w-full"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Auto Rotate
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
              <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                <Info className="w-5 h-5 mr-2 text-purple-400" />
                Feature Info
              </h3>
              {currentFeature ? (
                <div className="space-y-2">
                  <Badge 
                    variant="default" 
                    className="w-full justify-center"
                    style={{ backgroundColor: currentFeature.measurementLine.color }}
                  >
                    {currentFeature.name}
                  </Badge>
                  <p className="text-sm text-gray-300 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    {currentFeature.description}
                  </p>
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>Landmarks: {currentFeature.landmarks.length}</span>
                    <span>Forensic ID: {currentFeature.id}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Select a measurement to view anatomical landmarks and details
                  </p>
                  <div className="text-xs text-gray-500">
                    Current morph: {Math.round(morphFactor * 100)}% male characteristics
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="relative w-full h-[700px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
            <Canvas
              camera={{ position: [5, 2, 5], fov: 45 }}
              shadows
              style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f23 100%)' }}
            >
              <Suspense fallback={null}>
                {/* Enhanced Lighting */}
                <ambientLight intensity={0.3} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={1.2} 
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4ecdc4" />
                <spotLight 
                  position={[0, 10, 0]} 
                  intensity={0.8} 
                  angle={0.3} 
                  penumbra={0.5}
                  castShadow
                />

                {/* Environment and atmosphere */}
                <Environment preset="studio" />
                <fog attach="fog" args={['#0f0f23', 8, 20]} />

                {/* Camera Controller */}
                <SmoothCameraController 
                  targetPosition={cameraPosition}
                  targetLookAt={cameraTarget}
                />

                {/* Enhanced Controls */}
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={12}
                  minDistance={3}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.5}
                  enableDamping={true}
                  dampingFactor={0.05}
                />

                {/* Realistic Mandible Model */}
                <RealisticMandible 
                  morphFactor={morphFactor}
                  selectedFeature={selectedFeature}
                />

                {/* Landmarks and Measurements */}
                {currentFeature && (
                  <>
                    {/* Enhanced Landmarks */}
                    {currentFeature.landmarks.map((landmark, index) => (
                      <EnhancedLandmark
                        key={index}
                        position={landmark.position as [number, number, number]}
                        name={landmark.name}
                        color={landmark.color}
                        onClick={() => setSelectedLandmark(landmark.name)}
                        isVisible={true}
                      />
                    ))}

                    {/* Enhanced Measurement Line */}
                    <EnhancedMeasurementLine
                      points={currentFeature.measurementLine.points as [number, number, number][]}
                      color={currentFeature.measurementLine.color}
                      isVisible={true}
                    />
                  </>
                )}

                {/* Ground plane with shadows */}
                <ContactShadows 
                  position={[0, -3, 0]} 
                  opacity={0.4} 
                  scale={10} 
                  blur={2} 
                  far={4} 
                />

                {/* Grid */}
                <gridHelper args={[12, 12, '#333333', '#1a1a1a']} position={[0, -3, 0]} />
              </Suspense>
            </Canvas>

            {/* Enhanced Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
                <Camera className="w-3 h-3 mr-1" />
                Drag to orbit • Scroll to zoom • Click landmarks
              </Badge>
              {isAnimating && (
                <Badge variant="default" className="bg-blue-600/90 text-white animate-pulse backdrop-blur-sm">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Morphing anatomy...
                </Badge>
              )}
              {autoRotate && (
                <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30 backdrop-blur-sm">
                  <Maximize2 className="w-3 h-3 mr-1" />
                  Auto rotating
                </Badge>
              )}
            </div>

            {/* Enhanced Morph Progress */}
            {showVariation && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between text-sm text-white mb-3">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                      Female
                    </span>
                    <span className="font-mono text-blue-400">
                      {Math.round(morphFactor * 100)}% Male Characteristics
                    </span>
                    <span className="flex items-center">
                      Male
                      <span className="w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${morphFactor * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-blue-400" />
              <span>Click landmarks for details</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span>Select measurements to focus</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4 text-purple-400" />
              <span>Toggle gender variation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Realistic 3D anatomy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}