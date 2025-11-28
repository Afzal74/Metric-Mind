'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial, BufferGeometry, Object3D } from 'three'
import * as THREE from 'three'

interface RealObjMandibleProps {
  morphFactor: number
  selectedFeature: string | null
}

export function RealObjMandible({ morphFactor, selectedFeature }: RealObjMandibleProps) {
  const groupRef = useRef<Group>(null)
  const [objModel, setObjModel] = useState<Object3D | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01
    }
  })

  useEffect(() => {
    const loadObjModel = async () => {
      try {
        setIsLoading(true)
        
        // Dynamically import the OBJ loader
        const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')
        const loader = new OBJLoader()
        
        // Load the OBJ file
        loader.load(
          '/models/mandible.obj',
          (object) => {
            console.log('OBJ model loaded successfully:', object)
            
            // Scale factors based on sexual dimorphism
            const baseScale = 0.1 + morphFactor * 0.02 // Scale down the model
            const widthScale = 1 + morphFactor * 0.28
            const heightScale = 1 + morphFactor * 0.15
            
            // Apply scaling and materials
            object.traverse((child) => {
              if (child instanceof Mesh) {
                // Scale the model appropriately
                child.scale.set(baseScale * widthScale, baseScale * heightScale, baseScale)
                
                // Medical imaging colors
                const mandibleColor = morphFactor > 0.5 ? '#ff6b47' : '#ff8566'
                const selectedColor = '#ff3838'
                const highlightColor = selectedFeature ? selectedColor : mandibleColor
                
                // Create medical-style material
                const material = new MeshStandardMaterial({
                  color: highlightColor,
                  roughness: 0.6,
                  metalness: 0.2,
                  transparent: true,
                  opacity: selectedFeature ? 1.0 : 0.9,
                  emissive: selectedFeature ? mandibleColor : '#000000',
                  emissiveIntensity: selectedFeature ? 0.2 : 0.1
                })
                
                child.material = material
                child.castShadow = true
                child.receiveShadow = true
              }
            })
            
            // Center the model
            const box = new THREE.Box3().setFromObject(object)
            const center = box.getCenter(new THREE.Vector3())
            object.position.sub(center)
            
            setObjModel(object)
            setIsLoading(false)
            setError(null)
          },
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
          },
          (error) => {
            console.error('Error loading OBJ model:', error)
            setError('Failed to load 3D model')
            setIsLoading(false)
          }
        )
      } catch (err) {
        console.error('Error setting up OBJ loader:', err)
        setError('Failed to initialize 3D model loader')
        setIsLoading(false)
      }
    }

    loadObjModel()
  }, [])

  // Update materials when morphFactor or selectedFeature changes
  useEffect(() => {
    if (objModel) {
      objModel.traverse((child) => {
        if (child instanceof Mesh) {
          const mandibleColor = morphFactor > 0.5 ? '#ff6b47' : '#ff8566'
          const selectedColor = '#ff3838'
          const highlightColor = selectedFeature ? selectedColor : mandibleColor
          
          if (child.material instanceof MeshStandardMaterial) {
            child.material.color.set(highlightColor)
            child.material.emissive.set(selectedFeature ? mandibleColor : '#000000')
            child.material.emissiveIntensity = selectedFeature ? 0.2 : 0.1
            child.material.opacity = selectedFeature ? 1.0 : 0.9
          }
        }
      })
    }
  }, [objModel, morphFactor, selectedFeature])

  if (isLoading) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#ff8566" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  if (error || !objModel) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[3, 1.5, 1.5]} />
          <meshStandardMaterial color="#ff6b47" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[1, 0.2, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <primitive object={objModel} />
    </group>
  )
}