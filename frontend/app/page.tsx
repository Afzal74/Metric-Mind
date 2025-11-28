'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Activity, Users, Target, Loader2, CheckCircle, XCircle, 
  Microscope, Shield, Award, Database, FlaskConical, Stethoscope,
  TrendingUp, Clock, AlertCircle, Sparkles, BookOpen, ChevronDown, ChevronUp, Eye
} from 'lucide-react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AIExplanation } from '@/components/ai-explanation'
import { PredictionCharts } from '@/components/prediction-charts'
import { ReportGenerator } from '@/components/report-generator'
import { cn, formatConfidence, getGenderIcon, getConfidenceColor } from '@/lib/utils'

const API_BASE_URL = 'http://localhost:5000/api'

interface PredictionResult {
  success: boolean
  prediction?: {
    gender: string
    gender_full: string
    confidence: number
    probabilities: {
      Female: number
      Male: number
    }
  }
  ai_explanation?: string
  error?: string
}

interface ApiHealth {
  status: string
  message: string
  models_loaded: boolean
}

export default function Home() {
  const [features, setFeatures] = useState<string[]>([])
  const [measurements, setMeasurements] = useState<string[]>(Array(15).fill(''))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    checkApiHealth()
    loadFeatures()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      setApiHealth(response.data)
      if (response.data.models_loaded) {
        toast.success('🔬 AI Models loaded successfully!')
      }
    } catch (error) {
      console.error('API health check failed:', error)
      toast.error('⚠️ Cannot connect to AI backend')
    }
  }

  const loadFeatures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/features`)
      setFeatures(response.data.features)
    } catch (error) {
      console.error('Failed to load features:', error)
      setFeatures([
        "M1 Length", "M2 Bicondylar breadth", "M3 Mandibular index",
        "M3 Bigonial breadth", "M5 URB", "M6 LRB", "M7 CondRH",
        "M8 CorRH", "M9 Gonial angle", "M10 Cor length",
        "M11 Cor breadth", "M12 C-C distance", "M13 Inter cor distance",
        "M14 Cor-Fr distance", "M15 Bimental breadth"
      ])
    }
  }

  const loadSampleData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sample`)
      setMeasurements(response.data.measurements.map((m: number) => m.toString()))
      toast.success('📊 Sample data loaded!')
    } catch (error) {
      const sampleData = [10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2, 3.6, 4.8]
      setMeasurements(sampleData.map(m => m.toString()))
      toast.success('📊 Fallback sample data loaded!')
    }
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const numericMeasurements = measurements.map(m => parseFloat(m))
      
      if (numericMeasurements.some(isNaN)) {
        throw new Error('All measurements must be valid numbers')
      }

      const response = await axios.post(`${API_BASE_URL}/predict`, {
        measurements: numericMeasurements
      })

      setResult(response.data)
      if (response.data.success) {
        toast.success(`🎯 Analysis complete! Predicted: ${response.data.prediction.gender_full}`)
      }
    } catch (error: any) {
      const errorResult = {
        success: false,
        error: error.response?.data?.error || error.message || 'Prediction failed'
      }
      setResult(errorResult)
      toast.error(`❌ ${errorResult.error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (index: number, value: string) => {
    const newMeasurements = [...measurements]
    newMeasurements[index] = value
    setMeasurements(newMeasurements)
  }

  const clearForm = () => {
    setMeasurements(Array(15).fill(''))
    setResult(null)
    toast.success('🧹 Form cleared!')
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 medical-gradient opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative">
                <Microscope className="w-20 h-20 text-blue-600 floating-animation" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-100 mb-6"
            >
              Forensic Gender
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Classifier</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto"
            >
              Advanced AI-powered gender classification using mandibular morphometric analysis
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <Badge variant="default" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Team Metric Mind
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                VTU CSE Project 2024
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mb-8"
            >
              <a href="/viewer">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Explore Real 3D Model
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* API Status */}
        <AnimatePresence>
          {apiHealth && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <Card className={cn(
                "border-2",
                apiHealth.models_loaded 
                  ? "border-green-200 bg-green-50" 
                  : "border-red-200 bg-red-50"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {apiHealth.models_loaded ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className={cn(
                          "font-semibold",
                          apiHealth.models_loaded ? "text-green-800" : "text-red-800"
                        )}>
                          {apiHealth.models_loaded ? "System Ready" : "System Error"}
                        </p>
                        <p className={cn(
                          "text-sm",
                          apiHealth.models_loaded ? "text-green-600" : "text-red-600"
                        )}>
                          {apiHealth.message}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={apiHealth.models_loaded ? "success" : "destructive"}
                      className="pulse-glow"
                    >
                      {apiHealth.models_loaded ? "ONLINE" : "OFFLINE"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Target, title: "Best Model", value: "Logistic Regression", color: "text-blue-400", bg: "bg-blue-900/20" },
            { icon: TrendingUp, title: "Accuracy", value: "75.00%", color: "text-green-400", bg: "bg-green-900/20" },
            { icon: Database, title: "Features", value: "15 measurements", color: "text-purple-400", bg: "bg-purple-900/20" },
            { icon: Users, title: "Dataset", value: "156 samples", color: "text-orange-400", bg: "bg-orange-900/20" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer"
            >
              <Card className={cn("stat-card", stat.bg)}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-full", stat.bg)}>
                      <stat.icon className={cn("w-8 h-8", stat.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Sample Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mb-8"
        >
          <Card className="glass-card border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100">
                <FlaskConical className="w-6 h-6 text-amber-400" />
                <span>Quick Test Laboratory</span>
              </CardTitle>
              <CardDescription>
                Load pre-validated sample measurements to test the AI model instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={loadSampleData}
                  variant="secondary"
                  className="flex-1"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Load Sample Data
                </Button>
                <Button 
                  onClick={clearForm}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-gray-100">
                <Stethoscope className="w-8 h-8 text-blue-400" />
                <span>Mandibular Measurements Input</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Enter the 15 mandibular measurements for AI-powered gender classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePredict} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 + index * 0.05, duration: 0.4 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300">
                        <span className="text-blue-400">M{index + 1}.</span> {feature}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={measurements[index] || ''}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={`Enter ${feature.toLowerCase()}`}
                        className="transition-all duration-300 focus:scale-105"
                        required
                      />
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.6 }}
                  className="text-center pt-8"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="min-w-[250px] text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Analyzing Measurements...
                      </>
                    ) : (
                      <>
                        <Brain className="w-6 h-6 mr-3" />
                        Predict Gender
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <Card className={cn(
                "overflow-hidden",
                result.success ? "result-card-success" : "result-card-error"
              )}>
                <CardContent className="p-8">
                  {result.success && result.prediction ? (
                    <div className="text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-8xl mb-6"
                      >
                        {getGenderIcon(result.prediction.gender)}
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                          {result.prediction.gender_full}
                        </h2>
                        <p className={cn(
                          "text-2xl font-semibold mb-6",
                          getConfidenceColor(result.prediction.confidence)
                        )}>
                          Confidence: {formatConfidence(result.prediction.confidence)}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-2 gap-6 max-w-md mx-auto"
                      >
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                          <div className="text-sm font-medium text-gray-600 mb-2">👩 Female</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatConfidence(result.prediction.probabilities.Female)}
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                          <div className="text-sm font-medium text-gray-600 mb-2">👨 Male</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatConfidence(result.prediction.probabilities.Male)}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                      <h3 className="text-2xl font-semibold text-red-800">Analysis Failed</h3>
                      <p className="text-red-600 text-lg">{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prediction Charts */}
        <AnimatePresence>
          {result && result.success && result.prediction && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <PredictionCharts
                prediction={result.prediction}
                measurements={measurements.map(m => parseFloat(m) || 0)}
                featureNames={features}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Explanation Section */}
        <AnimatePresence>
          {result && result.success && result.ai_explanation && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6"
            >
              <AIExplanation
                explanation={result.ai_explanation}
                genderPredicted={result.prediction?.gender_full || ''}
                confidence={result.prediction?.confidence || 0}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Generator Section */}
        <AnimatePresence>
          {result && result.success && result.prediction && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6"
            >
              <ReportGenerator
                reportData={{
                  prediction: result.prediction,
                  measurements: measurements.map(m => parseFloat(m) || 0),
                  featureNames: features,
                  aiExplanation: result.ai_explanation || '',
                  timestamp: new Date().toISOString()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}