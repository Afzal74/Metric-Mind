"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Billboard, Html } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RealObjMandible } from "./real-obj-mandible";
import {
  Eye,
  RotateCcw,
  Play,
  Pause,
  MousePointer,
  Settings,
  Camera,
  Zap,
  Info,
  Target,
  Maximize2,
  Activity,
  Scan,
  Monitor,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// Medical-style orbit controls with smooth camera transitions
function MedicalOrbitControls({
  autoRotate = false,
  cameraDistance = 5.5,
  targetRotation = null,
}: {
  autoRotate?: boolean;
  cameraDistance?: number;
  targetRotation?: { x: number; y: number } | null;
}) {
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: -0.2, y: 0.3 });

  useFrame(() => {
    // Smoothly transition to target rotation when feature is selected
    if (targetRotation) {
      setRotation((prev) => ({
        x: prev.x + (targetRotation.x - prev.x) * 0.1,
        y: prev.y + (targetRotation.y - prev.y) * 0.1,
      }));
    } else if (autoRotate && !isDragging) {
      setRotation((prev) => ({ ...prev, y: prev.y + 0.003 }));
    }

    // Apply rotation to camera with dynamic distance
    camera.position.x =
      Math.cos(rotation.y) * Math.cos(rotation.x) * cameraDistance;
    camera.position.y = Math.sin(rotation.x) * cameraDistance;
    camera.position.z =
      Math.sin(rotation.y) * Math.cos(rotation.x) * cameraDistance;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      setLastMouse({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - lastMouse.x;
      const deltaY = event.clientY - lastMouse.y;

      setRotation((prev) => ({
        x: Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, prev.x - deltaY * 0.008)
        ),
        y: prev.y + deltaX * 0.008,
      }));

      setLastMouse({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (event: WheelEvent) => {
      const factor = event.deltaY > 0 ? 1.08 : 0.92;
      const newDistance = camera.position.length() * factor;
      if (newDistance > 2 && newDistance < 15) {
        camera.position.multiplyScalar(factor);
      }
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("mouseup", handleMouseUp);
    gl.domElement.addEventListener("wheel", handleWheel);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl, isDragging, lastMouse]);

  return null;
}

// Medical measurement line with CT scan style
function MedicalMeasurementLine({
  points,
  color,
  isVisible,
}: {
  points: [number, number, number][];
  color: string;
  isVisible: boolean;
}) {
  if (!isVisible || points.length < 2) return null;

  const lineElements = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const midpoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ];
    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );

    lineElements.push(
      <mesh key={i} position={midpoint as [number, number, number]}>
        <cylinderGeometry args={[0.025, 0.025, distance]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    );
  }

  // Add glowing endpoint markers
  points.forEach((point, index) => {
    lineElements.push(
      <group key={`marker-${index}`} position={point}>
        <mesh>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Glowing halo effect */}
        <mesh>
          <sphereGeometry args={[0.12]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>
    );
  });

  return <group>{lineElements}</group>;
}

// All 15 Anatomical features - NO measurement lines, just camera positions
const MEDICAL_FEATURES = [
  {
    id: "M1",
    name: "Length (M1)",
    description: "Maximum anteroposterior dimension from gonion to gnathion",
    color: "#00ff88",
    cameraPosition: { distance: 3.5, rotation: { x: -0.3, y: 0.5 } },
    medicalNote: "Critical for bite analysis and facial reconstruction",
  },
  {
    id: "M2",
    name: "Bicondylar Breadth (M2)",
    description: "Maximum transverse width between lateral condylar surfaces",
    color: "#00ccff",
    cameraPosition: { distance: 4, rotation: { x: 0.3, y: 0 } },
    medicalNote: "Key indicator of mandibular size and TMJ function",
  },
  {
    id: "M3",
    name: "Mandibular Index (M3)",
    description: "Ratio of mandibular height to length",
    color: "#ff00ff",
    cameraPosition: { distance: 3.5, rotation: { x: 0, y: 1.57 } },
    medicalNote: "Indicates mandibular proportions and robusticity",
  },
  {
    id: "M4",
    name: "Bigonial Breadth (M4)",
    description: "Maximum transverse width between gonial angles",
    color: "#ffff00",
    cameraPosition: { distance: 4, rotation: { x: -0.6, y: 0 } },
    medicalNote: "Sexually dimorphic - wider in males",
  },
  {
    id: "M5",
    name: "Upper Ramus Breadth (M5)",
    description: "Minimum breadth of upper ramus",
    color: "#00ffff",
    cameraPosition: { distance: 3, rotation: { x: 0.1, y: 1.57 } },
    medicalNote: "Indicates ramus robusticity",
  },
  {
    id: "M6",
    name: "Lower Ramus Breadth (M6)",
    description: "Minimum breadth of lower ramus",
    color: "#ff6699",
    cameraPosition: { distance: 3, rotation: { x: -0.1, y: 1.57 } },
    medicalNote: "Related to masticatory muscle attachment",
  },
  {
    id: "M7",
    name: "Condylar Ramus Height (M7)",
    description: "Vertical distance from condylar head to gonial angle",
    color: "#ff6600",
    cameraPosition: { distance: 3.5, rotation: { x: 0, y: 1.57 } },
    medicalNote: "Correlates with masticatory muscle development",
  },
  {
    id: "M8",
    name: "Coronoid Ramus Height (M8)",
    description: "Vertical distance from coronoid tip to gonial angle",
    color: "#9966ff",
    cameraPosition: { distance: 3.5, rotation: { x: 0.1, y: 1.4 } },
    medicalNote: "Indicates temporalis muscle attachment area",
  },
  {
    id: "M9",
    name: "Gonial Angle (M9)",
    description: "Angle between posterior ramus border and mandibular base",
    color: "#ffaa00",
    cameraPosition: { distance: 3, rotation: { x: -0.2, y: 1.57 } },
    medicalNote: "Highly sexually dimorphic - males have more acute angles",
  },
  {
    id: "M10",
    name: "Coronoid Length (M10)",
    description: "Length of coronoid process",
    color: "#66ff99",
    cameraPosition: { distance: 2.8, rotation: { x: 0.2, y: 1.4 } },
    medicalNote: "Related to temporalis muscle leverage",
  },
  {
    id: "M11",
    name: "Coronoid Breadth (M11)",
    description: "Breadth of coronoid process",
    color: "#ff99cc",
    cameraPosition: { distance: 2.8, rotation: { x: 0.3, y: 1.2 } },
    medicalNote: "Indicates muscle attachment surface area",
  },
  {
    id: "M12",
    name: "Condyle-Condyle Distance (M12)",
    description: "Transverse distance between condylar centers",
    color: "#cc00ff",
    cameraPosition: { distance: 4, rotation: { x: 0.4, y: 0 } },
    medicalNote: "Related to TMJ spacing and function",
  },
  {
    id: "M13",
    name: "Inter-Coronoid Distance (M13)",
    description: "Transverse distance between coronoid process tips",
    color: "#ff3366",
    cameraPosition: { distance: 3.5, rotation: { x: 0.3, y: 0 } },
    medicalNote: "Indicates mandibular arch width",
  },
  {
    id: "M14",
    name: "Coronoid-Foramen Distance (M14)",
    description: "Distance from coronoid tip to mental foramen",
    color: "#33ccff",
    cameraPosition: { distance: 3.5, rotation: { x: -0.2, y: 0.8 } },
    medicalNote: "Anatomical landmark relationship",
  },
  {
    id: "M15",
    name: "Bimental Breadth (M15)",
    description: "Breadth between mental foramina",
    color: "#ffcc00",
    cameraPosition: { distance: 3, rotation: { x: -0.5, y: 0 } },
    medicalNote: "Indicates anterior mandibular width",
  },
];

// Loading component for OBJ model
function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color="#ff8566" transparent opacity={0.5} />
    </mesh>
  );
}

// Feature label positions - moderate distance, arrows clearly visible
const LABEL_POSITIONS: Record<
  string,
  { label: [number, number, number]; arrow: [number, number, number] }
> = {
  M1: { label: [-1.2, 0.6, 0.8], arrow: [-0.15, 0.05, 0.1] },
  M2: { label: [1.2, 0.6, -0.8], arrow: [0.2, 0.15, -0.05] },
  M3: { label: [1.0, -0.3, 0.8], arrow: [0.1, -0.1, 0.15] },
  M4: { label: [-1.2, -0.3, -0.8], arrow: [-0.2, -0.1, -0.15] },
  M5: { label: [-1.0, 0.6, -0.8], arrow: [-0.15, 0.2, -0.1] },
  M6: { label: [-1.2, 0.3, -0.7], arrow: [-0.18, 0.05, -0.12] },
  M7: { label: [1.2, 0.5, -0.7], arrow: [0.18, 0.18, -0.08] },
  M8: { label: [1.0, 0.6, 0.6], arrow: [0.12, 0.2, 0.05] },
  M9: { label: [-1.2, -0.5, 0.7], arrow: [-0.2, -0.15, 0.08] },
  M10: { label: [1.2, 0.3, 0.7], arrow: [0.15, 0.1, 0.1] },
  M11: { label: [1.0, 0.5, 0.7], arrow: [0.1, 0.18, 0.12] },
  M12: { label: [1.2, 0.6, 0.2], arrow: [0.18, 0.2, 0] },
  M13: { label: [-1.0, 0.5, 0.7], arrow: [-0.1, 0.15, 0.12] },
  M14: { label: [-1.2, 0.1, 0.7], arrow: [-0.15, 0, 0.15] },
  M15: { label: [1.0, -0.6, 0.6], arrow: [0.08, -0.2, 0.1] },
};

// Feature Labels Component - ONLY shows selected feature with HTML overlay
function FeatureLabels({
  selectedFeature,
}: {
  selectedFeature: string | null;
  onFeatureSelect: (id: string | null) => void;
}) {
  if (!selectedFeature) return null;

  const feature = MEDICAL_FEATURES.find((f) => f.id === selectedFeature);
  const positions = LABEL_POSITIONS[selectedFeature];

  if (!feature || !positions) return null;

  return (
    <group>
      {/* Arrow line from label position to mandible - thick and visible */}
      <Line
        points={[positions.label, positions.arrow]}
        color={feature.color}
        lineWidth={4}
      />

      {/* Dot at mandible connection point */}
      <mesh position={positions.arrow}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color={feature.color} />
      </mesh>

      {/* Glow effect at connection point */}
      <mesh position={positions.arrow}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color={feature.color} transparent opacity={0.4} />
      </mesh>

      {/* HTML Label - fixed size, positioned far behind mandible */}
      <Html
        position={positions.label}
        center
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            color: feature.color,
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            border: `2px solid ${feature.color}`,
            boxShadow: `0 0 10px ${feature.color}40`,
          }}
        >
          {feature.name}
        </div>
      </Html>
    </group>
  );
}

export function ObjMedicalViewer({
  maleMean = {},
  femaleMean = {},
  className = "",
}: {
  maleMean?: Record<string, number>;
  femaleMean?: Record<string, number>;
  className?: string;
}) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showVariation, setShowVariation] = useState(false);
  const [morphFactor, setMorphFactor] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(5.5);

  const currentFeature = MEDICAL_FEATURES.find((f) => f.id === selectedFeature);

  const handleMorphToggle = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setShowVariation(!showVariation);

      const targetMorph = showVariation ? 0 : 1;
      const startMorph = morphFactor;
      const duration = 3000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        setMorphFactor(startMorph + (targetMorph - startMorph) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      animate();
    }
  };

  const resetView = () => {
    setSelectedFeature(null);
    setAutoRotate(true);
    setCameraDistance(5.5);
  };

  const handleZoomIn = () => {
    setCameraDistance((prev) => Math.max(prev - 0.8, 2.5));
  };

  const handleZoomOut = () => {
    setCameraDistance((prev) => Math.min(prev + 0.8, 18));
  };

  const getGenderAnalysis = () => {
    const characteristics = [];
    if (morphFactor > 0.7) {
      characteristics.push("Robust mandibular architecture");
      characteristics.push("Pronounced gonial angles");
      characteristics.push("Prominent mental protuberance");
      characteristics.push("Increased bicondylar breadth");
    } else if (morphFactor < 0.3) {
      characteristics.push("Gracile mandibular structure");
      characteristics.push("Obtuse gonial angles");
      characteristics.push("Subtle mental protuberance");
      characteristics.push("Narrower bicondylar breadth");
    } else {
      characteristics.push("Intermediate morphology");
      characteristics.push("Mixed sexual characteristics");
    }
    return characteristics;
  };

  return (
    <div className={`w-full ${className}`}>
      <Card className="glass-card border-orange-500/30 bg-gradient-to-br from-gray-900/95 to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
            <Monitor className="w-8 h-8 text-orange-400" />
            <span>Real 3D Mandible Model</span>
            <Badge
              variant="secondary"
              className="ml-2 bg-orange-900/30 text-orange-400 border-orange-500/30"
            >
              <Scan className="w-3 h-3 mr-1" />
              OBJ Model
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg">
            Authentic 3D mandible model loaded from OBJ file for precise
            forensic analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Medical Analysis Panel */}
          <div className="bg-gray-800/50 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-200">
                3D Model Analysis
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Model Type:</strong> Authentic OBJ 3D Model
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Sexual Dimorphism:</strong>{" "}
                  {Math.round(morphFactor * 100)}%
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Classification:</strong>{" "}
                  {morphFactor > 0.6
                    ? "Male-typical"
                    : morphFactor < 0.4
                    ? "Female-typical"
                    : "Indeterminate"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Key Characteristics:
                </p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {getGenderAnalysis().map((char, index) => (
                    <li key={index}>• {char}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Feature Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-400" />
                Osteometric Points
              </h3>
              <div className="space-y-2">
                {MEDICAL_FEATURES.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={
                      selectedFeature === feature.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedFeature(feature.id);
                      setAutoRotate(false); // Turn off auto-rotate when feature is selected
                    }}
                    className="w-full justify-start text-left transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor:
                        selectedFeature === feature.id
                          ? feature.color + "20"
                          : undefined,
                      borderColor:
                        selectedFeature === feature.id
                          ? feature.color
                          : undefined,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: feature.color }}
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
                Model Controls
              </h3>
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
                  {showVariation ? "Female Morph" : "Male Morph"}
                </Button>
              </div>
            </div>

            {/* Clinical Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Clinical Data
              </h3>
              {currentFeature ? (
                <div className="space-y-2">
                  <Badge
                    variant="default"
                    className="w-full justify-center text-black font-semibold"
                    style={{ backgroundColor: currentFeature.color }}
                  >
                    {currentFeature.name}
                  </Badge>
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Definition:</strong> {currentFeature.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong>Clinical Note:</strong>{" "}
                      {currentFeature.medicalNote}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    Select an osteometric point to view clinical details and
                    measurement guidelines
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>3D Model:</strong> Authentic OBJ mandible geometry
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real 3D Model Canvas */}
          <div className="relative w-full h-[750px] bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-2xl">
            <Canvas
              camera={{ position: [cameraDistance, 2, 4], fov: 50 }}
              style={{
                background:
                  "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%, #1a0a00 100%)",
              }}
            >
<<<<<<< HEAD
              {/* Enhanced focused lighting for 3D model */}
              <ambientLight intensity={0.5} color="#ffffff" />
              
              {/* Main key light - front top */}
              <directionalLight 
                position={[5, 8, 5]} 
                intensity={2.0} 
                color="#ffffff"
                castShadow
              />
              
              {/* Fill light - front bottom to reduce shadows */}
              <directionalLight 
                position={[3, -3, 5]} 
                intensity={1.2} 
                color="#ffddcc"
=======
              {/* Medical imaging lighting */}
              <ambientLight intensity={0.3} color="#ff8866" />
              <directionalLight
                position={[8, 8, 4]}
                intensity={1.5}
                color="#ffffff"
                castShadow
              />
              <pointLight
                position={[-8, -8, -4]}
                intensity={0.8}
                color="#ff6644"
              />
              <spotLight
                position={[0, 12, 0]}
                intensity={1.2}
                angle={0.4}
                penumbra={0.6}
                color="#ffaa88"
>>>>>>> 014b2366cabbab74c12388b5598ee9f46253ab0a
              />
              
              {/* Back light for rim lighting effect */}
              <directionalLight 
                position={[-5, 5, -5]} 
                intensity={1.5} 
                color="#ffeedd"
              />
              
              {/* Focused spotlight on model center */}
              <spotLight 
                position={[0, 10, 0]} 
                intensity={2.5} 
                angle={0.6} 
                penumbra={0.5}
                color="#ffffff"
                castShadow
                target-position={[0, 0, 0]}
              />
              
              {/* Side accent lights for depth */}
              <pointLight position={[8, 2, 0]} intensity={1.0} color="#ffaa88" />
              <pointLight position={[-8, 2, 0]} intensity={1.0} color="#ffaa88" />
              
              {/* Bottom fill light */}
              <pointLight position={[0, -5, 0]} intensity={0.8} color="#ff9977" />

              {/* Medical Controls */}
              <MedicalOrbitControls
                autoRotate={autoRotate && !selectedFeature}
                cameraDistance={
                  selectedFeature && currentFeature
                    ? currentFeature.cameraPosition.distance
                    : cameraDistance
                }
                targetRotation={
                  selectedFeature && currentFeature
                    ? currentFeature.cameraPosition.rotation
                    : null
                }
              />

              {/* Real OBJ Mandible Model */}
              <Suspense fallback={<ModelLoader />}>
                <RealObjMandible
                  morphFactor={morphFactor}
                  selectedFeature={selectedFeature}
                />
              </Suspense>

              {/* Feature Labels with Arrows */}
              <FeatureLabels
                selectedFeature={selectedFeature}
                onFeatureSelect={setSelectedFeature}
              />

              {/* Medical grid - only show when no feature is selected */}
              {!selectedFeature && (
                <gridHelper
                  args={[15, 15, "#333333", "#1a1a1a"]}
                  position={[0, -4, 0]}
                />
              )}
            </Canvas>

            {/* Medical Overlay Interface */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge
                variant="secondary"
                className="bg-black/90 text-orange-400 backdrop-blur-sm border border-orange-500/30"
              >
                <Monitor className="w-3 h-3 mr-1" />
                Real OBJ Model
              </Badge>
              <Badge
                variant="outline"
                className="bg-black/80 text-white backdrop-blur-sm"
              >
                <Camera className="w-3 h-3 mr-1" />
                Drag • Scroll • Click
              </Badge>
              {selectedFeature && currentFeature && (
                <Badge
                  variant="default"
                  className="bg-black/90 text-white backdrop-blur-sm animate-pulse"
                  style={{ borderColor: currentFeature.color }}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Viewing: {currentFeature.name}
                </Badge>
              )}
              {isAnimating && (
                <Badge
                  variant="default"
                  className="bg-orange-600/90 text-white animate-pulse backdrop-blur-sm"
                >
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  Morphological analysis...
                </Badge>
              )}
              {autoRotate && !selectedFeature && (
                <Badge
                  variant="outline"
                  className="bg-green-900/30 text-green-400 border-green-500/30 backdrop-blur-sm"
                >
                  <Maximize2 className="w-3 h-3 mr-1" />
                  Auto rotation active
                </Badge>
              )}
            </div>

            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                className="bg-black/90 hover:bg-orange-600/90 text-orange-400 hover:text-white border border-orange-500/30"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                className="bg-black/90 hover:bg-orange-600/90 text-orange-400 hover:text-white border border-orange-500/30"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Medical Morph Progress */}
            {showVariation && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-orange-500/30">
                  <div className="flex justify-between text-sm text-white mb-3">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                      Female Morphology
                    </span>
                    <span className="font-mono text-orange-400 bg-orange-900/30 px-2 py-1 rounded">
                      {Math.round(morphFactor * 100)}% Male Characteristics
                    </span>
                    <span className="flex items-center">
                      Male Morphology
                      <span className="w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-600">
                    <div
                      className="bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 h-4 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${morphFactor * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    Real 3D Model • Sexual Dimorphism Analysis • Forensic
                    Osteometry
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-4 h-4 text-orange-400" />
              <span>Interactive 3D model</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span>Authentic OBJ geometry</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Sexual dimorphism</span>
            </div>
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-purple-400" />
              <span>Medical precision</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
