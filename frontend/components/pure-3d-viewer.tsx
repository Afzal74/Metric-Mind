'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, RotateCcw, Play, Pause, MousePointer, Settings, Camera,
  Zap, Info, Target, Maximize2
} from 'lucide-react'

// Pure Three.js orbit controls
function PureOrbitControls({ autoRotate = false }: { autoRotate?: boolean }) {
  const { camera, gl } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useFrame(() => {
    if (autoRotate && !isDragging) {
      setRotation(prev => ({ ...prev, y: prev.y + 0.005 }))
    }
    
    // Apply rotation to camera
    const radius = camera.position.length()
    camera.position.x = Math.cos(rotation.y) * Math.cos(rotation.x) * radius
    camera.position.y = Math.sin(rotation.x) * radius
    camera.position.z = Math.sin(rotation.y) * Math.cos(rotation.x) * radius
    camera.lookAt(0, 0, 0)
  })

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true)
      setLastMouse({ x: event.clientX, y: event.clientY })
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = event.clientX - lastMouse.x
      const deltaY = event.clientY - lastMouse.y
      
      setRotation(prev => ({
        x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x - deltaY * 0.01)),
        y: prev.y + deltaX * 0.01
      }))
      
      setLastMouse({ x: event.clientX, y: event.clientY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleWheel = (event: WheelEvent) => {
      const factor = event.deltaY > 0 ? 1.1 : 0.9
      camera.position.multiplyScalar(Math.max(0.5, Math.min(10, factor)))
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('wheel', handleWheel)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
    }
  }, [camera, gl, isDragging, lastMouse])

  return null
}

// Realistic mandible with pure Three.js
function PureMandible({ morphFactor = 0, selectedFeature }: { morphFactor: number, selectedFeature: string | null }) {
  const groupRef = useRef<any>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    }
  })

  const baseScale = 1 + morphFactor * 0.15
  const widthScale = 1 + morphFactor * 0.25
  const heightScale = 1 + morphFactor * 0.12
  const robusticity = 1 + morphFactor * 0.3

  const boneColor = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'
  const jointColor = morphFactor > 0.5 ? '#e0d5b7' : '#e8d5b7'
  const highlightColor = '#4ecdc4'

  const getMaterialProps = (featureId: string, baseColor: string) => ({
    color: selectedFeature === featureId || hovered === featureId ? highlightColor : baseColor,
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: selectedFeature === featureId ? 0.95 : 0.85
  })

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main mandible body */}
      <mesh 
        position={[0, -1.2, 0]}
        onPointerOver={() => setHovered('body')}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[5 * widthScale, 0.6 * robusticity, 1.4]} />
        <meshStandardMaterial {...getMaterialProps('M1', boneColor)} />
      </mesh>

      {/* Curved mandible arch */}
      <mesh position={[0, -1.5, 0.3]}>
        <torusGeometry args={[2.2 * widthScale, 0.3 * robusticity, 8, 16, Math.PI]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left ramus */}
      <group position={[-2.3 * widthScale, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <mesh 
          onPointerOver={() => setHovered('leftRamus')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[0.8 * robusticity, 3.2 * heightScale, 1.2]} />
          <meshStandardMaterial {...getMaterialProps('M7', boneColor)} />
        </mesh>
      </group>

      {/* Right ramus */}
      <group position={[2.3 * widthScale, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <mesh 
          onPointerOver={() => setHovered('rightRamus')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[0.8 * robusticity, 3.2 * heightScale, 1.2]} />
          <meshStandardMaterial {...getMaterialProps('M7', boneColor)} />
        </mesh>
      </group>

      {/* Left condylar process */}
      <group position={[-2.6 * widthScale, 1.8 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('leftCondyle')}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.35 * (1 + morphFactor * 0.4), 12, 8]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor)} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.6, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.6} metalness={0.2} />
        </mesh>
      </group>

      {/* Right condylar process */}
      <group position={[2.6 * widthScale, 1.8 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('rightCondyle')}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.35 * (1 + morphFactor * 0.4), 12, 8]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor)} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.6, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.6} metalness={0.2} />
        </mesh>
      </group>

      {/* Left coronoid process */}
      <group position={[-1.8 * widthScale, 0.8 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('leftCoronoid')}
          onPointerOut={() => setHovered(null)}
        >
          <coneGeometry args={[0.25, 1.2 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor)} />
        </mesh>
      </group>

      {/* Right coronoid process */}
      <group position={[1.8 * widthScale, 0.8 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('rightCoronoid')}
          onPointerOut={() => setHovered(null)}
        >
          <coneGeometry args={[0.25, 1.2 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor)} />
        </mesh>
      </group>

      {/* Gonial angles */}
      <mesh 
        position={[-2.4 * widthScale, -1.3, 0]}
        onPointerOver={() => setHovered('leftGonion')}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.2 * (1 + morphFactor * 0.5), 8, 6]} />
        <meshStandardMaterial {...getMaterialProps('M9', jointColor)} />
      </mesh>
      
      <mesh 
        position={[2.4 * widthScale, -1.3, 0]}
        onPointerOver={() => setHovered('rightGonion')}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.2 * (1 + morphFactor * 0.5), 8, 6]} />
        <meshStandardMaterial {...getMaterialProps('M9', jointColor)} />
      </mesh>

      {/* Mental protuberance (chin) */}
      <mesh 
        position={[0, -1.9, 0.4]}
        onPointerOver={() => setHovered('chin')}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.4 * (1 + morphFactor * 0.6), 10, 8]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Alveolar process - tooth sockets */}
      <group position={[0, -1.6, 0.6]}>
        {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((x, i) => (
          <mesh key={i} position={[x * widthScale, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
            <meshStandardMaterial color="#d4c4a8" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// Simple measurement line
function SimpleMeasurementLine({ 
  points, 
  color, 
  isVisible 
}: { 
  points: [number, number, number][]
  color: string
  isVisible: boolean
}) {
  if (!isVisible || points.length < 2) return null

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
        <cylinderGeometry args={[0.03, 0.03, distance]} />
        <meshBasicMaterial color={color} />
      </mesh>
    )
  }
  
  // Add endpoint markers
  points.forEach((point, index) => {
    lineElements.push(
      <mesh key={`marker-${index}`} position={point}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color={color} />
      </mesh>
    )
  })
  
  return <group>{lineElements}</group>
}

// Anatomical features
const MANDIBLE_FEATURES = [
  {
    id: 'M1',
    name: 'M1 Length',
    description: 'Maximum mandibular length from gonion to gnathion',
    measurementLine: {
      points: [[-2.4, -1.3, 0], [0, -1.9, 0.4]],
      color: '#ff6b6b'
    }
  },
  {
    id: 'M2',
    name: 'M2 Bicondylar breadth',
    description: 'Maximum width between the lateral surfaces of the condyles',
    measurementLine: {
      points: [[-2.6, 1.8, 0], [2.6, 1.8, 0]],
      color: '#4ecdc4'
    }
  },
  {
    id: 'M9',
    name: 'M9 Gonial angle',
    description: 'Angle between the ramus and body of the mandible',
    measurementLine: {
      points: [[-2.3, 1, 0], [-2.4, -1.3, 0], [0, -1.2, 0]],
      color: '#45b7d1'
    }
  },
  {
    id: 'M7',
    name: 'M7 Condylar Ramus Height',
    description: 'Height from condyle to gonion',
    measurementLine: {
      points: [[-2.6, 1.8, 0], [-2.4, -1.3, 0]],
      color: '#96ceb4'
    }
  },
  {
    id: 'M12',
    name: 'M12 C-C Distance',
    description: 'Distance between coronoid processes',
    measurementLine: {
      points: [[-1.8, 0.8, 0], [1.8, 0.8, 0]],
      color: '#feca57'
    }
  }
]

export function Pure3DViewer({ 
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
  const [autoRotate, setAutoRotate] = useState(true)

  const currentFeature = MANDIBLE_FEATURES.find(f => f.id === selectedFeature)

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
        const eased = 1 - Math.pow(1 - progress, 4)
        
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
    setAutoRotate(true)
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Eye className="w-8 h-8 text-blue-400" />
            <span>Pure 3D Mandible Viewer</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              WebGL
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg">
            Realistic 3D visualization of forensic mandibular anatomy
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
                    onClick={() => setSelectedFeature(feature.id)}
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
                    <span>Forensic ID: {currentFeature.id}</span>
                    <span>{Math.round(morphFactor * 100)}% Male</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Select a measurement to view anatomical details
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
              style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f23 100%)' }}
            >
              {/* Enhanced Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[-10, -10, -5]} intensity={0.6} color="#4ecdc4" />
              <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={0.5} />

              {/* Controls */}
              <PureOrbitControls autoRotate={autoRotate} />

              {/* Mandible Model */}
              <PureMandible 
                morphFactor={morphFactor}
                selectedFeature={selectedFeature}
              />

              {/* Measurement Lines */}
              {currentFeature && (
                <SimpleMeasurementLine
                  points={currentFeature.measurementLine.points as [number, number, number][]}
                  color={currentFeature.measurementLine.color}
                  isVisible={true}
                />
              )}

              {/* Grid */}
              <gridHelper args={[12, 12, '#333333', '#1a1a1a']} position={[0, -3, 0]} />
            </Canvas>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
                <Camera className="w-3 h-3 mr-1" />
                Drag to orbit • Scroll to zoom
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

            {/* Morph Progress */}
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

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-blue-400" />
              <span>Drag to rotate view</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span>Select measurements</span>
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