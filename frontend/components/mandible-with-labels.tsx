"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Line } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import * as THREE from "three";

// Feature labels with arrow positions pointing to mandible parts
const FEATURE_LABELS = [
  {
    id: "M1",
    name: "M1 Length",
    position: [-3, 2, 2] as [number, number, number],
    arrowEnd: [-1.5, 0.5, 0] as [number, number, number],
    color: "#ff6b47",
  },
  {
    id: "M2",
    name: "M2 Bicondylar breadth",
    position: [-4, 1, -2] as [number, number, number],
    arrowEnd: [-2, 1, -0.5] as [number, number, number],
    color: "#4ade80",
  },
  {
    id: "M4",
    name: "M4 Bigonial breadth",
    position: [-3, -1, -3] as [number, number, number],
    arrowEnd: [-1.5, -0.5, -1] as [number, number, number],
    color: "#f59e0b",
  },
  {
    id: "M9",
    name: "M9 Gonial angle",
    position: [-4, -2, -2] as [number, number, number],
    arrowEnd: [-2, -1, -1] as [number, number, number],
    color: "#06b6d4",
  },
  {
    id: "M12",
    name: "M12 C-C distance",
    position: [3, 2, 1] as [number, number, number],
    arrowEnd: [1, 1, 0] as [number, number, number],
    color: "#8b5cf6",
  },
  {
    id: "M15",
    name: "M15 Bimental breadth",
    position: [3, -2, 2] as [number, number, number],
    arrowEnd: [1, -1, 0.5] as [number, number, number],
    color: "#ec4899",
  },
];

interface MandibleWithLabelsProps {
  selectedFeature: string | null;
  measurements: number[];
  onFeatureSelect: (feature: string | null) => void;
  predictedGender?: string;
}

function MandibleModel({
  selectedFeature,
  measurements,
  onFeatureSelect,
}: MandibleWithLabelsProps) {
  const groupRef = useRef<Group>(null);
  const [objModel, setObjModel] = useState<THREE.Object3D | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  useEffect(() => {
    const loadObjModel = async () => {
      try {
        const { OBJLoader } = await import(
          "three/examples/jsm/loaders/OBJLoader.js"
        );
        const loader = new OBJLoader();

        loader.load(
          "/models/mandible.obj",
          (object) => {
            const baseScale = 3.0;

            object.traverse((child) => {
              if (child instanceof Mesh) {
                child.scale.set(baseScale, baseScale, baseScale);

                const material = new MeshStandardMaterial({
                  color: "#ff6b47",
                  roughness: 0.4,
                  metalness: 0.3,
                  transparent: true,
                  opacity: 0.9,
                });

                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            setObjModel(object);
          },
          undefined,
          (error) => {
            console.error("Error loading OBJ model:", error);
            // Create fallback mandible
            const fallbackGeometry = new THREE.BoxGeometry(3, 1.5, 1.5);
            const fallbackMaterial = new MeshStandardMaterial({
              color: "#ff6b47",
            });
            const fallbackMesh = new THREE.Mesh(
              fallbackGeometry,
              fallbackMaterial
            );
            setObjModel(fallbackMesh);
          }
        );
      } catch (err) {
        console.error("Error setting up OBJ loader:", err);
        // Create fallback mandible
        const fallbackGeometry = new THREE.BoxGeometry(3, 1.5, 1.5);
        const fallbackMaterial = new MeshStandardMaterial({ color: "#ff6b47" });
        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
        setObjModel(fallbackMesh);
      }
    };

    loadObjModel();
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main mandible model */}
      {objModel && <primitive object={objModel} />}

      {/* Feature labels with arrows */}
      {FEATURE_LABELS.map((label, index) => {
        const isSelected = selectedFeature === label.id;
        const measurementValue = measurements[index] || 0;

        return (
          <group key={label.id}>
            {/* Debug sphere at label position */}
            <mesh position={label.position}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color={label.color} />
            </mesh>

            {/* Arrow line from label to mandible */}
            <Line
              points={[label.position, label.arrowEnd]}
              color={isSelected ? "#ffffff" : label.color}
              lineWidth={isSelected ? 8 : 5}
              transparent
              opacity={0.9}
            />

            {/* Arrow head */}
            <mesh position={label.arrowEnd}>
              <coneGeometry args={[0.1, 0.3, 8]} />
              <meshBasicMaterial color={isSelected ? "#ffffff" : label.color} />
            </mesh>

            {/* Feature label text */}
            <Text
              position={label.position}
              fontSize={isSelected ? 0.25 : 0.2}
              color={isSelected ? "#ffffff" : label.color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
              onClick={() => onFeatureSelect(isSelected ? null : label.id)}
            >
              {label.name}
            </Text>

            {/* Measurement value */}
            {isSelected && (
              <Text
                position={
                  [
                    label.position[0],
                    label.position[1] - 0.2,
                    label.position[2],
                  ] as [number, number, number]
                }
                fontSize={0.1}
                color="#ffff00"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.01}
                outlineColor="#000000"
              >
                {measurementValue.toFixed(1)}mm
              </Text>
            )}

            {/* Highlight circle for selected feature */}
            {isSelected && (
              <mesh position={label.arrowEnd}>
                <ringGeometry args={[0.1, 0.15, 16]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function MandibleWithLabels({
  selectedFeature,
  measurements,
  onFeatureSelect,
}: MandibleWithLabelsProps) {
  return (
    <div className="relative w-full h-[800px] bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-2xl">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
        style={{
          background:
            "radial-gradient(circle at center, #1a1a2e 0%, #0f0f23 100%)",
        }}
      >
        <MandibleModel
          selectedFeature={selectedFeature}
          measurements={measurements}
          onFeatureSelect={onFeatureSelect}
        />

        {/* Enhanced lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 3, 0]} intensity={0.4} color="#ff6b47" />

        {/* Grid */}
        <gridHelper
          args={[20, 20, "#333333", "#1a1a1a"]}
          position={[0, -3, 0]}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Click feature labels to highlight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Arrows point to mandible features</span>
        </div>
      </div>

      {/* Selected feature info */}
      {selectedFeature && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
          <h3 className="font-bold text-orange-400 mb-1">
            {FEATURE_LABELS.find((f) => f.id === selectedFeature)?.name}
          </h3>
          <p className="text-sm text-gray-300">
            Value:{" "}
            {measurements[
              FEATURE_LABELS.findIndex((f) => f.id === selectedFeature)
            ] || 0}
            mm
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click label again to deselect
          </p>
        </div>
      )}
    </div>
  );
}
