'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Mesh, Group, MeshStandardMaterial } from 'three'

interface ObjMandibleProps {
  morphFactor: number
  selectedFeature: string | null
}

// For now, let's create a realistic mandible using basic geometries
// until we can properly load the OBJ file
export function ObjMandible({ morphFactor, selectedFeature }: ObjMandibleProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01
    }
  })

  // Scale factors based on sexual dimorphism
  const baseScale = 1 + morphFactor * 0.18
  const widthScale = 1 + morphFactor * 0.28
  const heightScale = 1 + morphFactor * 0.15
  const robusticity = 1 + morphFactor * 0.35

  // Medical imaging colors - orange/red mandible like in CT scans
  const mandibleColor = morphFactor > 0.5 ? '#ff6b47' : '#ff8566'
  const jointColor = morphFactor > 0.5 ? '#e55039' : '#ff6348'
  const selectedColor = '#ff3838'

  // Helper function to get material props with medical imaging style
  const getMaterialProps = (featureId: string, baseColor: string, isJoint = false) => ({
    color: selectedFeature === featureId || hovered === featureId ? selectedColor : baseColor,
    roughness: isJoint ? 0.4 : 0.6,
    metalness: isJoint ? 0.3 : 0.2,
    transparent: true,
    opacity: selectedFeature === featureId ? 1.0 : 0.9,
    emissive: selectedFeature === featureId || hovered === featureId ? baseColor : '#000000',
    emissiveIntensity: selectedFeature === featureId || hovered === featureId ? 0.2 : 0.1
  })

  return (
    <group 
      ref={groupRef} 
      scale={[baseScale, baseScale, baseScale]}
      onPointerOver={() => setHovered('mandible')}
      onPointerOut={() => setHovered(null)}
    >
      {/* Main mandible body - curved horseshoe shape */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[5 * widthScale, 0.6 * robusticity, 1.4]} />
        <meshStandardMaterial {...getMaterialProps('M1', mandibleColor)} />
      </mesh>

      {/* Curved mandible arch */}
      <mesh position={[0, -1.5, 0.3]}>
        <torusGeometry args={[2.2 * widthScale, 0.3 * robusticity, 8, 16, Math.PI]} />
        <meshStandardMaterial color={mandibleColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left ramus */}
      <group position={[-2.4 * widthScale, 0.2, 0]} rotation={[0, 0, Math.PI / 12]}>
        <mesh>
          <boxGeometry args={[0.9 * robusticity, 3.8 * heightScale, 1.3]} />
          <meshStandardMaterial {...getMaterialProps('M7', mandibleColor)} />
        </mesh>
        
        {/* Mandibular angle reinforcement */}
        <mesh position={[0.2, -1.8, 0]}>
          <sphereGeometry args={[0.3 * (1 + morphFactor * 0.6), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M9', jointColor, true)} />
        </mesh>
      </group>

      {/* Right ramus */}
      <group position={[2.4 * widthScale, 0.2, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <mesh>
          <boxGeometry args={[0.9 * robusticity, 3.8 * heightScale, 1.3]} />
          <meshStandardMaterial {...getMaterialProps('M7', mandibleColor)} />
        </mesh>
        
        {/* Mandibular angle reinforcement */}
        <mesh position={[-0.2, -1.8, 0]}>
          <sphereGeometry args={[0.3 * (1 + morphFactor * 0.6), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M9', jointColor, true)} />
        </mesh>
      </group>

      {/* Left condylar process */}
      <group position={[-2.7 * widthScale, 2.0 * heightScale, 0]}>
        <mesh>
          <sphereGeometry args={[0.4 * (1 + morphFactor * 0.4), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor, true)} />
        </mesh>
        
        {/* Condylar neck */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.25, 0.8, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Right condylar process */}
      <group position={[2.7 * widthScale, 2.0 * heightScale, 0]}>
        <mesh>
          <sphereGeometry args={[0.4 * (1 + morphFactor * 0.4), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor, true)} />
        </mesh>
        
        {/* Condylar neck */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.25, 0.8, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Left coronoid process */}
      <group position={[-1.9 * widthScale, 1.2 * heightScale, 0]}>
        <mesh>
          <coneGeometry args={[0.3, 1.6 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor, true)} />
        </mesh>
      </group>

      {/* Right coronoid process */}
      <group position={[1.9 * widthScale, 1.2 * heightScale, 0]}>
        <mesh>
          <coneGeometry args={[0.3, 1.6 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor, true)} />
        </mesh>
      </group>

      {/* Mental protuberance (chin) */}
      <group position={[0, -2.1, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.5 * (1 + morphFactor * 0.8), 12, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.6} metalness={0.2} transparent opacity={0.95} />
        </mesh>
      </group>

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