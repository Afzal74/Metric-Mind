'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Activity, Users, Target, Loader2, CheckCircle, XCircle, 
  Microscope, Shield, Award, Database, FlaskConical, Stethoscope,
  TrendingUp, Clock, AlertCircle, Sparkles, BookOpen, ChevronDown, ChevronUp,
  BarChart3, PieChart, Zap, Cpu, Settings
} from 'lucide-react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PredictionCharts } from '@/components/prediction-charts'
import { AIExplanation } from '@/components/ai-explanation'
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

export default function ModernDashboard() {
  const [features, setFeatures] = useState<string[]>([])
  const [measurements, setMeasurements] = useState<string[]>(Array(15).fill(''))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null)

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
      
      {/* Modern Header with Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-12">
            {/* Left side - Text */}
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-6xl font-bold text-white orbitron-font tracking-wider">METRIC MIND</h1>
                <p className="text-blue-300 space-grotesk-font font-medium text-xl mt-3">Advanced AI-Powered Forensic Gender Classification</p>
                <p className="text-gray-400 space-grotesk-font text-sm mt-2">Team Metric Mind • VTU CSE Project 2025</p>
              </div>
              
              {/* System Status */}
              {apiHealth && (
                <Badge 
                  variant={apiHealth.models_loaded ? "success" : "destructive"}
                  className="px-6 py-3 text-sm orbitron-font w-fit"
                >
                  {apiHealth.models_loaded ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      SYSTEM ONLINE
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      SYSTEM OFFLINE
                    </>
                  )}
                </Badge>
              )}
            </div>
            
            {/* Right side - Mandible Image */}
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center">
                <img 
                  src="/mandible.png" 
                  alt="Mandible Logo" 
                  className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { icon: Target, title: "Algorithm", value: "Logistic Regression", color: "text-blue-400", accent: "border-blue-500/20", bg: "bg-blue-500/5" },
              { icon: TrendingUp, title: "Accuracy", value: "75.00%", color: "text-emerald-400", accent: "border-emerald-500/20", bg: "bg-emerald-500/5" },
              { icon: Database, title: "Features", value: "15 measurements", color: "text-purple-400", accent: "border-purple-500/20", bg: "bg-purple-500/5" },
              { icon: Users, title: "Dataset", value: "156 samples", color: "text-orange-400", accent: "border-orange-500/20", bg: "bg-orange-500/5" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="cursor-pointer"
              >
                <Card className={cn("dashboard-card", stat.accent, stat.bg)}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-2 orbitron-font uppercase tracking-wider">{stat.title}</p>
                        <p className="text-2xl font-bold text-white space-grotesk-font">{stat.value}</p>
                      </div>
                      <div className={cn("p-4 rounded-2xl bg-black/30", stat.color)}>
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="dashboard-card border-amber-500/20 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white orbitron-font">
                    <FlaskConical className="w-6 h-6 text-amber-400" />
                    <span>QUICK ACTIONS</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={loadSampleData} variant="secondary" size="lg" className="orbitron-font">
                      <Database className="w-4 h-4 mr-2" />
                      LOAD SAMPLE
                    </Button>
                    <Button onClick={clearForm} variant="outline" size="lg" className="orbitron-font">
                      <XCircle className="w-4 h-4 mr-2" />
                      CLEAR FORM
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white orbitron-font text-xl">
                    <Stethoscope className="w-7 h-7 text-blue-400" />
                    <span>MANDIBULAR MEASUREMENTS</span>
                  </CardTitle>
                  <CardDescription className="space-grotesk-font text-gray-300">
                    Enter the 15 mandibular measurements for AI-powered forensic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePredict} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + index * 0.02, duration: 0.3 }}
                          className="space-y-3"
                        >
                          <label className="block text-sm font-medium text-gray-300 space-grotesk-font">
                            <span className="text-blue-400 orbitron-font">M{index + 1}.</span> {feature}
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={measurements[index] || ''}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={`Enter ${feature.toLowerCase()}`}
                            className="dark-input jetbrains-font"
                            required
                          />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-8">
                      <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="min-w-[250px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg orbitron-font tracking-wider"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            ANALYZING...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 mr-3" />
                            ANALYZE GENDER
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-8">
            
            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="dashboard-card border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white orbitron-font">
                    <Cpu className="w-6 h-6 text-green-400" />
                    <span>SYSTEM STATUS</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 space-grotesk-font">AI Models</span>
                    <Badge variant="success" className="orbitron-font">LOADED</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 space-grotesk-font">API Status</span>
                    <Badge variant="success" className="orbitron-font">ONLINE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 space-grotesk-font">Processing</span>
                    <Badge variant="secondary" className="orbitron-font">READY</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Panel */}
            <AnimatePresence>
              {result && result.success && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="dashboard-card border-emerald-500/20 bg-emerald-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-white orbitron-font">
                        <Target className="w-6 h-6 text-emerald-400" />
                        <span>ANALYSIS RESULTS</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      <div className="text-7xl mb-6">
                        {getGenderIcon(result.prediction?.gender || '')}
                      </div>
                      <h3 className="text-3xl font-bold text-white orbitron-font">
                        {result.prediction?.gender_full}
                      </h3>
                      <p className="text-xl text-emerald-400 space-grotesk-font">
                        {formatConfidence(result.prediction?.confidence || 0)} Confidence
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="text-xs text-gray-400 orbitron-font">FEMALE</div>
                          <div className="text-xl font-bold text-pink-400 jetbrains-font">
                            {result.prediction?.probabilities.Female}%
                          </div>
                        </div>
                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="text-xs text-gray-400 orbitron-font">MALE</div>
                          <div className="text-xl font-bold text-blue-400 jetbrains-font">
                            {result.prediction?.probabilities.Male}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Full Width Results Section */}
        <AnimatePresence>
          {result && result.success && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 space-y-8"
            >
              {/* Charts */}
              <PredictionCharts
                prediction={result.prediction!}
                measurements={measurements.map(m => parseFloat(m) || 0)}
                featureNames={features}
              />

              {/* AI Explanation */}
              {result.ai_explanation && (
                <AIExplanation
                  explanation={result.ai_explanation}
                  genderPredicted={result.prediction?.gender_full || ''}
                  confidence={result.prediction?.confidence || 0}
                />
              )}

              {/* Report Generator */}
              <ReportGenerator
                reportData={{
                  prediction: result.prediction!,
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