'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ObjMedicalViewer = dynamic(() => import('@/components/obj-medical-viewer').then(mod => ({ default: mod.ObjMedicalViewer })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[750px] bg-gradient-to-b from-black/60 to-black/40 rounded-3xl flex items-center justify-center border border-amber-500/30">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-20 w-20 border-b-3 border-amber-400 mx-auto"></div>
        <p className="text-amber-300 text-xl font-semibold ghibli-title">Loading Real 3D Model...</p>
        <p className="text-amber-500/80 text-sm ghibli-text">Loading authentic OBJ mandible geometry...</p>
        <div className="flex items-center justify-center space-x-2 text-amber-400">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  )
})
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, Database, TrendingUp, 
  Users, Target, BookOpen, Sparkles, Microscope
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SAMPLE_DATA = {
  maleMean: {
    M1: 10.8, M2: 12.5, M3: 0.87, M4: 10.2, M5: 3.4,
    M6: 3.2, M7: 6.8, M8: 6.1, M9: 122, M10: 7.8,
    M11: 1.3, M12: 11.8, M13: 4.4, M14: 3.8, M15: 5.1
  },
  femaleMean: {
    M1: 10.2, M2: 11.8, M3: 0.83, M4: 9.4, M5: 3.0,
    M6: 2.9, M7: 6.2, M8: 5.5, M9: 118, M10: 7.2,
    M11: 1.1, M12: 11.2, M13: 4.0, M14: 3.4, M15: 4.5
  }
}

export default function ViewerPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 floating-animation">
                  <Image 
                    src="/mandible.png" 
                    alt="Mandible Logo" 
                    width={96} 
                    height={96}
                    className="object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-100 mb-6 ghibli-title"
            >
              Real 3D
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent"> Mandible Model</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto ghibli-text"
            >
              Authentic 3D mandible model loaded from OBJ file for precise forensic analysis and sexual dimorphism studies
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <Badge className="px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Real OBJ Model
              </Badge>
              <Badge className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Educational Tool
              </Badge>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Feature Overview - Staggered Wave Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 pt-4"
        >
          {[
            { 
              icon: Target, 
              title: "Precise Landmarks", 
              value: "15 measurements", 
              color: "text-blue-400", 
              bg: "bg-blue-500/20",
              description: "Anatomically accurate positioning",
              offset: ""
            },
            { 
              icon: TrendingUp, 
              title: "Gender Variation", 
              value: "Morphing", 
              color: "text-green-400", 
              bg: "bg-green-500/20",
              description: "Visualize dimorphism in real-time",
              offset: "lg:-translate-y-4"
            },
            { 
              icon: Database, 
              title: "Research Data", 
              value: "156 samples", 
              color: "text-purple-400", 
              bg: "bg-purple-500/20",
              description: "Based on validated forensic dataset",
              offset: "lg:-translate-y-4"
            },
            { 
              icon: Users, 
              title: "Interactive", 
              value: "3D Controls", 
              color: "text-orange-400", 
              bg: "bg-orange-500/20",
              description: "Orbit, zoom, and explore freely",
              offset: ""
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className={cn("cursor-pointer", feature.offset)}
            >
              <Card className="stat-card h-[120px]">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-2xl flex-shrink-0", feature.bg)}>
                      <feature.icon className={cn("w-7 h-7", feature.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-400 ghibli-text">{feature.title}</p>
                      <p className="text-base font-bold text-gray-100 ghibli-title">{feature.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ghibli-text line-clamp-2">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mb-8"
        >
          <Card className="glass-card border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100 ghibli-title">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span>How to Use the 3D Viewer</span>
              </CardTitle>
              <CardDescription className="text-gray-400 ghibli-text">
                Interactive guide to exploring mandibular anatomy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <h4 className="font-semibold text-gray-200 ghibli-title">1. Select Measurements</h4>
                  <p className="text-sm text-gray-400 ghibli-text">
                    Choose from M1-M15 measurements to focus the camera on specific anatomical regions
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <h4 className="font-semibold text-gray-200 ghibli-title">2. Explore Landmarks</h4>
                  <p className="text-sm text-gray-400 ghibli-text">
                    Click on colored spheres to learn about anatomical landmarks and their forensic significance
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <h4 className="font-semibold text-gray-200 ghibli-title">3. View Gender Variation</h4>
                  <p className="text-sm text-gray-400 ghibli-text">
                    Toggle the variation switch to see how mandibular morphology differs between sexes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {isLoaded && (
            <ObjMedicalViewer 
              maleMean={SAMPLE_DATA.maleMean}
              femaleMean={SAMPLE_DATA.femaleMean}
            />
          )}
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100 ghibli-title">
                <Microscope className="w-6 h-6 text-green-400" />
                <span>Forensic Significance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 ghibli-text">
                Mandibular morphology exhibits significant sexual dimorphism, making it a valuable tool 
                in forensic identification. The measurements visualized here represent key osteometric 
                points used in gender classification algorithms.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-200 ghibli-title">Key Measurements:</h4>
                <ul className="text-sm text-gray-400 space-y-1 ghibli-text">
                  <li>• <strong className="text-green-400">Bicondylar breadth (M2):</strong> Width between condyles</li>
                  <li>• <strong className="text-green-400">Gonial angle (M9):</strong> Angle of mandibular corner</li>
                  <li>• <strong className="text-green-400">Ramus height (M7):</strong> Vertical dimension of ramus</li>
                  <li>• <strong className="text-green-400">Mandibular length (M1):</strong> Overall jaw length</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100 ghibli-title">
                <Brain className="w-6 h-6 text-purple-400" />
                <span>AI Classification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 ghibli-text">
                Our machine learning model analyzes these 15 measurements to predict gender with 75% accuracy. 
                The 3D visualization helps understand which anatomical features contribute most to the classification.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-200 ghibli-title">Model Features:</h4>
                <ul className="text-sm text-gray-400 space-y-1 ghibli-text">
                  <li>• <strong className="text-purple-400">Logistic Regression:</strong> Best performing algorithm</li>
                  <li>• <strong className="text-purple-400">15 Features:</strong> Comprehensive measurement set</li>
                  <li>• <strong className="text-purple-400">75% Accuracy:</strong> Validated on 156 samples</li>
                  <li>• <strong className="text-purple-400">Real-time:</strong> Instant predictions via API</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
