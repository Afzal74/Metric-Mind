'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, RotateCcw, Play, Pause,
  MousePointer, Settings, Camera, ZoomIn, ZoomOut
} from 'lucide-react'

// Basic mandible component without drei dependencies
function BasicMandible({ morphFactor = 0 }: { morphFactor: number }) {
  const meshRef = useRef<any>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const baseScale = 5 // Much larger base scale for bigger model
  const scale = baseScale * (1 + morphFactor * 0.2)
  const color = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'

  return (
    <group ref={meshRef} scale={[scale, scale, scale]}>
      {/* Main mandible body */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[4, 0.8, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Left ramus */}
      <mesh position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.8, 2.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Right ramus */}
      <mesh position={[2.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.8, 2.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Condyles */}
      <mesh position={[-2.8, 1.5, 0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>
      
      <mesh position={[2.8, 1.5, 0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>
      
      {/* Coronoid processes */}
      <mesh position={[-2, 0.5, 0]}>
        <coneGeometry args={[0.2, 0.8, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>
      
      <mesh position={[2, 0.5, 0]}>
        <coneGeometry args={[0.2, 0.8, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>
    </group>
  )
}

// Basic camera controls without OrbitControls
function BasicControls({ cameraDistance }: { cameraDistance: number }) {
  const { camera, gl } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    camera.position.z = cameraDistance
  }, [camera, cameraDistance])

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true)
      setLastMouse({ x: event.clientX, y: event.clientY })
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = event.clientX - lastMouse.x
      const deltaY = event.clientY - lastMouse.y
      
      camera.position.x += deltaX * 0.01
      camera.position.y -= deltaY * 0.01
      
      setLastMouse({ x: event.clientX, y: event.clientY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleWheel = (event: WheelEvent) => {
      const factor = event.deltaY > 0 ? 1.1 : 0.9
      camera.position.multiplyScalar(factor)
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

export function Basic3DViewer({ className = "" }: { className?: string }) {
  const [morphFactor, setMorphFactor] = useState(0)
  const [showVariation, setShowVariation] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cameraDistance, setCameraDistance] = useState(12)
  const canvasRef = useRef<any>(null)

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
    setCameraDistance(12)
    window.location.reload() // Simple reset
  }

  const handleZoomIn = () => {
    setCameraDistance(prev => Math.max(prev - 2, 4))
  }

  const handleZoomOut = () => {
    setCameraDistance(prev => Math.min(prev + 2, 30))
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Eye className="w-8 h-8 text-blue-400" />
            <span>Basic 3D Mandible Viewer</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Simplified 3D visualization of mandibular anatomy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* View Controls */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">View Controls</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="flex-1"
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Zoom In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="flex-1"
                  >
                    <ZoomOut className="w-4 h-4 mr-2" />
                    Zoom Out
                  </Button>
                </div>
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

            {/* Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">Instructions</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Drag to rotate the model</p>
                <p>• Scroll or use buttons to zoom in/out</p>
                <p>• Toggle variation to see gender differences</p>
                <p>• Use reset to return to original view</p>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <Canvas
              ref={canvasRef}
              camera={{ position: [0, 0, cameraDistance], fov: 50 }}
              style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />

              {/* Basic Controls */}
              <BasicControls cameraDistance={cameraDistance} />

              {/* Mandible Model */}
              <BasicMandible morphFactor={morphFactor} />

              {/* Grid */}
              <gridHelper args={[10, 10, '#444444', '#222222']} />
            </Canvas>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Camera className="w-3 h-3 mr-1" />
                Drag to rotate, scroll to zoom
              </Badge>
              {isAnimating && (
                <Badge variant="default" className="bg-blue-600/90 text-white animate-pulse">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Morphing geometry...
                </Badge>
              )}
            </div>

            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
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
              <span>Drag to rotate model</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Scroll wheel to zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Toggle to see gender variation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}