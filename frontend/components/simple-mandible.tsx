'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface SimpleMandibleProps {
  morphFactor: number
  selectedFeature: string | null
}

export function SimpleMandible({ morphFactor, selectedFeature }: SimpleMandibleProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const scale = 1 + morphFactor * 0.2
  const color = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Simple mandible body */}
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
    </group>
  )
}