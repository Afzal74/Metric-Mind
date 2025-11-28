'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group, Shape, ExtrudeGeometry, Vector3 } from 'three'

interface RealisticMandibleProps {
  morphFactor: number
  selectedFeature: string | null
}

export function RealisticMandible({ morphFactor, selectedFeature }: RealisticMandibleProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  // Scale factors based on sexual dimorphism
  const baseScale = 1 + morphFactor * 0.15 // Males typically larger
  const widthScale = 1 + morphFactor * 0.25 // Width difference more pronounced
  const heightScale = 1 + morphFactor * 0.12 // Height difference
  const robusticity = 1 + morphFactor * 0.3 // Bone thickness

  // Color variations based on bone density and gender
  const boneColor = morphFactor > 0.5 ? '#f0e6d2' : '#f4e4bc'
  const jointColor = morphFactor > 0.5 ? '#e0d5b7' : '#e8d5b7'
  const highlightColor = '#4ecdc4'

  // Helper function to get material props
  const getMaterialProps = (featureId: string, baseColor: string) => ({
    color: selectedFeature === featureId || hovered === featureId ? highlightColor : baseColor,
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: selectedFeature === featureId ? 0.95 : 0.85
  })

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main mandible body - anatomically shaped */}
      <mesh 
        position={[0, -1.2, 0]}
        onPointerOver={() => setHovered('body')}
        onPointerOut={() => setHovered(null)}
      >
        {/* U-shaped mandible body */}
        <boxGeometry args={[5 * widthScale, 0.6 * robusticity, 1.4]} />
        <meshStandardMaterial {...getMaterialProps('M1', boneColor)} />
      </mesh>

      {/* Curved mandible arch */}
      <mesh position={[0, -1.5, 0.3]}>
        <torusGeometry args={[2.2 * widthScale, 0.3 * robusticity, 8, 16, Math.PI]} />
        <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left ramus - more anatomically correct */}
      <group position={[-2.3 * widthScale, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <mesh 
          onPointerOver={() => setHovered('leftRamus')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[0.8 * robusticity, 3.2 * heightScale, 1.2]} />
          <meshStandardMaterial {...getMaterialProps('M7', boneColor)} />
        </mesh>
        
        {/* Ramus curvature */}
        <mesh position={[0.2, -1.5, 0]}>
          <cylinderGeometry args={[0.4 * robusticity, 0.6 * robusticity, 1.5, 8]} />
          <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.1} />
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
        
        {/* Ramus curvature */}
        <mesh position={[-0.2, -1.5, 0]}>
          <cylinderGeometry args={[0.4 * robusticity, 0.6 * robusticity, 1.5, 8]} />
          <meshStandardMaterial color={boneColor} roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Left condylar process - more realistic shape */}
      <group position={[-2.6 * widthScale, 1.8 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('leftCondyle')}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.35 * (1 + morphFactor * 0.4), 12, 8]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor)} />
        </mesh>
        
        {/* Condylar neck */}
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
        
        {/* Condylar neck */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.6, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.6} metalness={0.2} />
        </mesh>
      </group>

      {/* Left coronoid process - sharp, triangular */}
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

      {/* Gonial angles - more pronounced in males */}
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

      {/* Mental protuberance (chin) - more prominent in males */}
      <mesh 
        position={[0, -1.9, 0.4]}
        onPointerOver={() => setHovered('chin')}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.4 * (1 + morphFactor * 0.6), 10, 8]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Mental foramen - small holes */}
      <mesh position={[-1.2 * widthScale, -1.4, 0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      <mesh position={[1.2 * widthScale, -1.4, 0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Mandibular foramen - larger openings on inner side */}
      <mesh position={[-1.8 * widthScale, -0.3, -0.4]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      <mesh position={[1.8 * widthScale, -0.3, -0.4]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Alveolar process - tooth sockets */}
      <group position={[0, -1.6, 0.6]}>
        {/* Tooth socket indentations */}
        {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((x, i) => (
          <mesh key={i} position={[x * widthScale, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
            <meshStandardMaterial color="#d4c4a8" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {/* Mylohyoid line - ridge on inner surface */}
      <mesh position={[0, -0.8, -0.3]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2 * widthScale, 0.05, 4, 16, Math.PI]} />
        <meshStandardMaterial color={boneColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Submandibular fossa - depressions */}
      <mesh position={[-1.5 * widthScale, -1.1, -0.2]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[1.5 * widthScale, -1.1, -0.2]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.7} />
      </mesh>

      {/* Lingula - small projections */}
      <mesh position={[-1.8 * widthScale, -0.1, -0.2]}>
        <coneGeometry args={[0.08, 0.2, 6]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      <mesh position={[1.8 * widthScale, -0.1, -0.2]}>
        <coneGeometry args={[0.08, 0.2, 6]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}