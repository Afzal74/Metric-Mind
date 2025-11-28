'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group, Shape, ExtrudeGeometry, CatmullRomCurve3, Vector3 } from 'three'

interface MedicalMandibleProps {
  morphFactor: number
  selectedFeature: string | null
}

export function MedicalMandible({ morphFactor, selectedFeature }: MedicalMandibleProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01
    }
  })

  // Scale factors based on sexual dimorphism
  const baseScale = 1 + morphFactor * 0.18 // Males typically larger
  const widthScale = 1 + morphFactor * 0.28 // Width difference more pronounced
  const heightScale = 1 + morphFactor * 0.15 // Height difference
  const robusticity = 1 + morphFactor * 0.35 // Bone thickness

  // Medical imaging colors - orange/red mandible like in CT scans
  const mandibleColor = morphFactor > 0.5 ? '#ff6b47' : '#ff8566' // Orange-red gradient
  const highlightColor = '#ffaa88'
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

  // Create curved mandible body using spline
  const createMandibleBody = () => {
    const points = [
      new Vector3(-2.8 * widthScale, -1.4, 0.8),
      new Vector3(-2.0 * widthScale, -1.6, 0.6),
      new Vector3(-1.0 * widthScale, -1.8, 0.4),
      new Vector3(0, -1.9, 0.3),
      new Vector3(1.0 * widthScale, -1.8, 0.4),
      new Vector3(2.0 * widthScale, -1.6, 0.6),
      new Vector3(2.8 * widthScale, -1.4, 0.8)
    ]
    
    return points
  }

  return (
    <group ref={groupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main mandible body - curved horseshoe shape */}
      <group>
        {/* Central body segments */}
        {createMandibleBody().slice(0, -1).map((point, index) => {
          const nextPoint = createMandibleBody()[index + 1]
          const midPoint = new Vector3().addVectors(point, nextPoint).multiplyScalar(0.5)
          const length = point.distanceTo(nextPoint)
          
          return (
            <mesh 
              key={index}
              position={[midPoint.x, midPoint.y, midPoint.z]}
              onPointerOver={() => setHovered('body')}
              onPointerOut={() => setHovered(null)}
            >
              <boxGeometry args={[length, 0.7 * robusticity, 1.2]} />
              <meshStandardMaterial {...getMaterialProps('M1', mandibleColor)} />
            </mesh>
          )
        })}
      </group>

      {/* Alveolar process - tooth-bearing part */}
      <mesh position={[0, -1.7, 0.5]}>
        <boxGeometry args={[4.5 * widthScale, 0.4, 0.8]} />
        <meshStandardMaterial color={mandibleColor} roughness={0.7} metalness={0.2} transparent opacity={0.9} />
      </mesh>

      {/* Individual tooth sockets */}
      <group position={[0, -1.6, 0.7]}>
        {[-2.2, -1.6, -1.0, -0.4, 0, 0.4, 1.0, 1.6, 2.2].map((x, i) => (
          <mesh key={i} position={[x * widthScale, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
            <meshStandardMaterial color="#d4c4a8" roughness={0.9} metalness={0.05} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Left ramus - more anatomically correct */}
      <group position={[-2.4 * widthScale, 0.2, 0]} rotation={[0, 0, Math.PI / 12]}>
        <mesh 
          onPointerOver={() => setHovered('leftRamus')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[0.9 * robusticity, 3.8 * heightScale, 1.3]} />
          <meshStandardMaterial {...getMaterialProps('M7', mandibleColor)} />
        </mesh>
        
        {/* Ramus posterior border - more pronounced in males */}
        <mesh position={[-0.3, 0, -0.2]}>
          <boxGeometry args={[0.2, 3.8 * heightScale, 0.3 * robusticity]} />
          <meshStandardMaterial color={jointColor} roughness={0.5} metalness={0.3} />
        </mesh>
        
        {/* Mandibular angle reinforcement */}
        <mesh position={[0.2, -1.8, 0]}>
          <sphereGeometry args={[0.3 * (1 + morphFactor * 0.6), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M9', jointColor, true)} />
        </mesh>
      </group>

      {/* Right ramus */}
      <group position={[2.4 * widthScale, 0.2, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <mesh 
          onPointerOver={() => setHovered('rightRamus')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[0.9 * robusticity, 3.8 * heightScale, 1.3]} />
          <meshStandardMaterial {...getMaterialProps('M7', mandibleColor)} />
        </mesh>
        
        {/* Ramus posterior border */}
        <mesh position={[0.3, 0, -0.2]}>
          <boxGeometry args={[0.2, 3.8 * heightScale, 0.3 * robusticity]} />
          <meshStandardMaterial color={jointColor} roughness={0.5} metalness={0.3} />
        </mesh>
        
        {/* Mandibular angle reinforcement */}
        <mesh position={[-0.2, -1.8, 0]}>
          <sphereGeometry args={[0.3 * (1 + morphFactor * 0.6), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M9', jointColor, true)} />
        </mesh>
      </group>

      {/* Left condylar process - more realistic shape */}
      <group position={[-2.7 * widthScale, 2.0 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('leftCondyle')}
          onPointerOut={() => setHovered(null)}
        >
          {/* Condylar head - elliptical shape */}
          <sphereGeometry args={[0.4 * (1 + morphFactor * 0.4), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor, true)} />
        </mesh>
        
        {/* Condylar neck */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.25, 0.8, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.4} metalness={0.3} />
        </mesh>
        
        {/* Pterygoid fovea - muscle attachment */}
        <mesh position={[0.1, -0.2, -0.2]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshStandardMaterial color="#cc4125" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* Right condylar process */}
      <group position={[2.7 * widthScale, 2.0 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('rightCondyle')}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.4 * (1 + morphFactor * 0.4), 8, 6]} />
          <meshStandardMaterial {...getMaterialProps('M2', jointColor, true)} />
        </mesh>
        
        {/* Condylar neck */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.25, 0.8, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.4} metalness={0.3} />
        </mesh>
        
        {/* Pterygoid fovea */}
        <mesh position={[-0.1, -0.2, -0.2]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshStandardMaterial color="#cc4125" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* Left coronoid process - sharp, blade-like */}
      <group position={[-1.9 * widthScale, 1.2 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('leftCoronoid')}
          onPointerOut={() => setHovered(null)}
        >
          <coneGeometry args={[0.3, 1.6 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor, true)} />
        </mesh>
        
        {/* Coronoid process anterior border */}
        <mesh position={[0.15, -0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.1, 1.2, 0.2]} />
          <meshStandardMaterial color={jointColor} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* Right coronoid process */}
      <group position={[1.9 * widthScale, 1.2 * heightScale, 0]}>
        <mesh 
          onPointerOver={() => setHovered('rightCoronoid')}
          onPointerOut={() => setHovered(null)}
        >
          <coneGeometry args={[0.3, 1.6 * heightScale, 6]} />
          <meshStandardMaterial {...getMaterialProps('M12', jointColor, true)} />
        </mesh>
        
        {/* Coronoid process anterior border */}
        <mesh position={[-0.15, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.1, 1.2, 0.2]} />
          <meshStandardMaterial color={jointColor} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* Mental protuberance (chin) - highly variable by gender */}
      <group position={[0, -2.1, 0.6]}>
        <mesh 
          onPointerOver={() => setHovered('chin')}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[0.5 * (1 + morphFactor * 0.8), 12, 8]} />
          <meshStandardMaterial color={jointColor} roughness={0.6} metalness={0.2} transparent opacity={0.95} />
        </mesh>
        
        {/* Mental tubercles - more prominent in males */}
        <mesh position={[-0.3, 0.1, 0]}>
          <sphereGeometry args={[0.15 * (1 + morphFactor * 0.5), 6, 4]} />
          <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0.3, 0.1, 0]}>
          <sphereGeometry args={[0.15 * (1 + morphFactor * 0.5), 6, 4]} />
          <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Mental foramen - nerve exits */}
      <mesh position={[-1.3 * widthScale, -1.5, 0.6]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1.3 * widthScale, -1.5, 0.6]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Mandibular foramen - larger openings on medial side */}
      <mesh position={[-2.0 * widthScale, -0.2, -0.5]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[2.0 * widthScale, -0.2, -0.5]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Lingula - small spines near mandibular foramen */}
      <mesh position={[-2.0 * widthScale, -0.1, -0.3]}>
        <coneGeometry args={[0.06, 0.25, 6]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[2.0 * widthScale, -0.1, -0.3]}>
        <coneGeometry args={[0.06, 0.25, 6]} />
        <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Mylohyoid line - ridge for muscle attachment */}
      <mesh position={[0, -0.9, -0.4]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.2 * widthScale, 0.06, 4, 16, Math.PI]} />
        <meshStandardMaterial color={mandibleColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Submandibular fossa - depressions for glands */}
      <mesh position={[-1.6 * widthScale, -1.2, -0.3]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.6 * widthScale, -1.2, -0.3]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.6} />
      </mesh>

      {/* Sublingual fossa - smaller depressions */}
      <mesh position={[-0.8 * widthScale, -1.4, -0.2]}>
        <sphereGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.8 * widthScale, -1.4, -0.2]}>
        <sphereGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#e8d5b7" roughness={0.9} metalness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* Genial tubercles - muscle attachment points */}
      <group position={[0, -1.8, -0.2]}>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshStandardMaterial color={jointColor} roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* Mandibular notch - between coronoid and condylar processes */}
      <mesh position={[-2.3 * widthScale, 1.6 * heightScale, 0]}>
        <torusGeometry args={[0.2, 0.1, 4, 8, Math.PI]} />
        <meshStandardMaterial color={mandibleColor} roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[2.3 * widthScale, 1.6 * heightScale, 0]}>
        <torusGeometry args={[0.2, 0.1, 4, 8, Math.PI]} />
        <meshStandardMaterial color={mandibleColor} roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}