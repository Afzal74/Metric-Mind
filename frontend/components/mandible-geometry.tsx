'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface MandibleGeometryProps {
  morphFactor: number
  selectedFeature: string | null
}

export function MandibleGeometry({ morphFactor, selectedFeature }: MandibleGeometryProps) {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<Mesh>(null)
  const leftRamusRef = useRef<Mesh>(null)
  const rightRamusRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  // Scale factors based on sexual dimorphism
  const baseScale = 1 + morphFactor * 0.15 // Males typically 10-15% larger
  const widthScale = 1 + morphFactor * 0.2  // Width difference more pronounced
  const heightScale = 1 + morphFactor * 0.1 // Height difference less pronounced

  // Color variations based on bone density (males typically denser)
  const boneColor = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'
  const jointColor = morphFactor > 0.5 ? '#e0d5b7' : '#e8d5b7'

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main mandible body */}
      <mesh ref={bodyRef} position={[0, -1, 0]}>
        <boxGeometry args={[4 * widthScale, 0.8, 1.2]} />
        <meshStandardMaterial 
          color={boneColor} 
          roughness={0.8} 
          metalness={0.1}
          transparent
          opacity={selectedFeature === 'M1' ? 0.9 : 0.8}
        />
      </mesh>
      
      {/* Left ramus */}
      <mesh 
        ref={leftRamusRef} 
        position={[-2.5 * widthScale, 0, 0]} 
        rotation={[0, 0, Math.PI / 6]}
      >
        <boxGeometry args={[0.8, 2.5 * heightScale, 1]} />
        <meshStandardMaterial 
          color={boneColor} 
          roughness={0.8} 
          metalness={0.1}
          transparent
          opacity={selectedFeature === 'M7' ? 0.9 : 0.8}
        />
      </mesh>
      
      {/* Right ramus */}
      <mesh 
        position={[2.5 * widthScale, 0, 0]} 
        rotation={[0, 0, -Math.PI / 6]}
      >
        <boxGeometry args={[0.8, 2.5 * heightScale, 1]} />
        <meshStandardMaterial 
          color={boneColor} 
          roughness={0.8} 
          metalness={0.1}
          transparent
          opacity={selectedFeature === 'M7' ? 0.9 : 0.8}
        />
      </mesh>
      
      {/* Left condyle */}
      <mesh position={[-2.8 * widthScale, 1.5 * heightScale, 0]}>
        <sphereGeometry args={[0.3 * (1 + morphFactor * 0.3), 8, 6]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.6} 
          metalness={0.2}
          transparent
          opacity={selectedFeature === 'M2' ? 0.95 : 0.85}
        />
      </mesh>
      
      {/* Right condyle */}
      <mesh position={[2.8 * widthScale, 1.5 * heightScale, 0]}>
        <sphereGeometry args={[0.3 * (1 + morphFactor * 0.3), 8, 6]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.6} 
          metalness={0.2}
          transparent
          opacity={selectedFeature === 'M2' ? 0.95 : 0.85}
        />
      </mesh>
      
      {/* Left coronoid process */}
      <mesh position={[-2 * widthScale, 0.5 * heightScale, 0]}>
        <coneGeometry args={[0.2, 0.8 * heightScale, 6]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.6} 
          metalness={0.2}
          transparent
          opacity={selectedFeature === 'M12' ? 0.95 : 0.85}
        />
      </mesh>
      
      {/* Right coronoid process */}
      <mesh position={[2 * widthScale, 0.5 * heightScale, 0]}>
        <coneGeometry args={[0.2, 0.8 * heightScale, 6]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.6} 
          metalness={0.2}
          transparent
          opacity={selectedFeature === 'M12' ? 0.95 : 0.85}
        />
      </mesh>

      {/* Gonial angles (corners) - more pronounced in males */}
      <mesh position={[-2.5 * widthScale, -1, 0]}>
        <sphereGeometry args={[0.15 * (1 + morphFactor * 0.4), 6, 4]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.7} 
          metalness={0.15}
          transparent
          opacity={selectedFeature === 'M9' ? 0.95 : 0.8}
        />
      </mesh>
      
      <mesh position={[2.5 * widthScale, -1, 0]}>
        <sphereGeometry args={[0.15 * (1 + morphFactor * 0.4), 6, 4]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.7} 
          metalness={0.15}
          transparent
          opacity={selectedFeature === 'M9' ? 0.95 : 0.8}
        />
      </mesh>

      {/* Mental protuberance (chin) - more prominent in males */}
      <mesh position={[0, -1.8, 0.2]}>
        <sphereGeometry args={[0.3 * (1 + morphFactor * 0.5), 8, 6]} />
        <meshStandardMaterial 
          color={jointColor} 
          roughness={0.7} 
          metalness={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Mandibular foramen (simplified) */}
      <mesh position={[-1.5 * widthScale, -0.2, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      <mesh position={[1.5 * widthScale, -0.2, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  )
}