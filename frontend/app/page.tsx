"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Users,
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  Award,
  Database,
  FlaskConical,
  Stethoscope,
  TrendingUp,
  AlertCircle,
  Eye,
  Microscope,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIExplanation } from "@/components/ai-explanation";
import { PredictionCharts } from "@/components/prediction-charts";
import { ReportGenerator } from "@/components/report-generator";
import { MandibleWithLabels } from "@/components/mandible-with-labels";
import {
  cn,
  formatConfidence,
  getGenderIcon,
  getConfidenceColor,
} from "@/lib/utils";

const API_BASE_URL = "http://localhost:5000/api";

interface PredictionResult {
  success: boolean;
  prediction?: {
    gender: string;
    gender_full: string;
    confidence: number;
    probabilities: {
      Female: number;
      Male: number;
    };
  };
  ai_explanation?: string;
  error?: string;
}

interface ApiHealth {
  status: string;
  message: string;
  models_loaded: boolean;
}

export default function Home() {
  const [features, setFeatures] = useState<string[]>([]);
  const [measurements, setMeasurements] = useState<string[]>(
    Array(15).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    checkApiHealth();
    loadFeatures();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setApiHealth(response.data);
      if (response.data.models_loaded) {
        toast.success("🔬 AI Models loaded successfully!");
      }
    } catch (error) {
      console.error("API health check failed:", error);
      toast.error("⚠️ Cannot connect to AI backend");
    }
  };

  const loadFeatures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/features`);
      setFeatures(response.data.features);
    } catch (error) {
      console.error("Failed to load features:", error);
      setFeatures([
        "M1 Length",
        "M2 Bicondylar breadth",
        "M3 Mandibular index",
        "M3 Bigonial breadth",
        "M5 URB",
        "M6 LRB",
        "M7 CondRH",
        "M8 CorRH",
        "M9 Gonial angle",
        "M10 Cor length",
        "M11 Cor breadth",
        "M12 C-C distance",
        "M13 Inter cor distance",
        "M14 Cor-Fr distance",
        "M15 Bimental breadth",
      ]);
    }
  };

  const loadSampleData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sample`);
      setMeasurements(
        response.data.measurements.map((m: number) => m.toString())
      );
      toast.success("📊 Sample data loaded!");
    } catch (error) {
      const sampleData = [
        10.5, 12.3, 0.85, 9.8, 3.2, 3.1, 6.5, 5.8, 120, 7.5, 1.2, 11.5, 4.2,
        3.6, 4.8,
      ];
      setMeasurements(sampleData.map((m) => m.toString()));
      toast.success("📊 Fallback sample data loaded!");
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const numericMeasurements = measurements.map((m) => parseFloat(m));

      if (numericMeasurements.some(isNaN)) {
        throw new Error("All measurements must be valid numbers");
      }

      // Validate that not all measurements are zero or empty
      if (numericMeasurements.every((m) => m === 0)) {
        throw new Error("Please enter valid measurements. All values cannot be zero.");
      }

      // Validate that measurements are within reasonable ranges
      const hasInvalidValues = numericMeasurements.some((m) => m < 0);
      if (hasInvalidValues) {
        throw new Error("Measurements cannot be negative values");
      }

      const response = await axios.post(`${API_BASE_URL}/predict`, {
        measurements: numericMeasurements,
      });

      setResult(response.data);
      if (response.data.success) {
        toast.success(
          `🎯 Analysis complete! Predicted: ${response.data.prediction.gender_full}`
        );
      }
    } catch (error: any) {
      const errorResult = {
        success: false,
        error:
          error.response?.data?.error || error.message || "Prediction failed",
      };
      setResult(errorResult);
      toast.error(`❌ ${errorResult.error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = value;
    setMeasurements(newMeasurements);
  };

  const clearForm = () => {
    setMeasurements(Array(15).fill(""));
    setResult(null);
    toast.success("🧹 Form cleared!");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(52, 211, 153, 0.3)",
            borderRadius: "16px",
            color: "#fff",
            fontFamily: "Nunito, sans-serif",
          },
        }}
      />

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
                <div className="w-40 h-40 md:w-48 md:h-48 floating-animation">
                  <Image
                    src="/mandible.png"
                    alt="Mandible Logo"
                    width={192}
                    height={192}
                    className="object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-100 mb-6 ghibli-title"
            >
              Forensic Gender
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {" "}
                Classifier
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto ghibli-text"
            >
              Advanced AI-powered gender classification using mandibular
              morphometric analysis
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <Badge className="px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                <Shield className="w-4 h-4 mr-2" />
                Team Metric Mind
              </Badge>
              <Badge className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
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
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
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
              <div
                className={cn(
                  "glass-card p-4",
                  apiHealth.models_loaded
                    ? "border-green-500/30"
                    : "border-rose-500/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {apiHealth.models_loaded ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-rose-400" />
                    )}
                    <div>
                      <p
                        className={cn(
                          "font-semibold ghibli-text",
                          apiHealth.models_loaded
                            ? "text-green-300"
                            : "text-rose-300"
                        )}
                      >
                        {apiHealth.models_loaded
                          ? "System Ready"
                          : "System Error"}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          apiHealth.models_loaded
                            ? "text-green-400/80"
                            : "text-rose-400/80"
                        )}
                      >
                        {apiHealth.message}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      apiHealth.models_loaded
                        ? "bg-green-500/20 text-green-300 border-green-500/30 pulse-glow"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    )}
                  >
                    {apiHealth.models_loaded ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Cards - Staggered Wave Layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 pt-4"
        >
          {[
            {
              icon: Target,
              title: "Best Model",
              value: "Logistic Regression",
              color: "text-blue-400",
              bg: "bg-blue-500/20",
              offset: "",
            },
            {
              icon: TrendingUp,
              title: "Accuracy",
              value: "75.00%",
              color: "text-green-400",
              bg: "bg-green-500/20",
              offset: "lg:-translate-y-4",
            },
            {
              icon: Database,
              title: "Features",
              value: "15 measurements",
              color: "text-purple-400",
              bg: "bg-purple-500/20",
              offset: "lg:-translate-y-4",
            },
            {
              icon: Users,
              title: "Dataset",
              value: "156 samples",
              color: "text-orange-400",
              bg: "bg-orange-500/20",
              offset: "",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className={cn("cursor-pointer", stat.offset)}
            >
              <Card className="stat-card h-[100px]">
                <CardContent className="p-5 h-full flex items-center">
                  <div className="flex items-center space-x-4 w-full">
                    <div
                      className={cn("p-3 rounded-2xl flex-shrink-0", stat.bg)}
                    >
                      <stat.icon className={cn("w-7 h-7", stat.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-400 ghibli-text">
                        {stat.title}
                      </p>
                      <p className="text-base font-bold text-gray-100 ghibli-title">
                        {stat.value}
                      </p>
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
          <div className="glass-card border-amber-500/30 p-6 rounded-3xl">
            <div className="mb-4">
              <h3 className="flex items-center space-x-2 text-xl font-bold text-gray-100 mb-2 ghibli-title">
                <FlaskConical className="w-6 h-6 text-amber-400" />
                <span>Quick Test Laboratory</span>
              </h3>
              <p className="text-gray-400 ghibli-text">
                Load pre-validated sample measurements to test the AI model
                instantly
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={loadSampleData}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Database className="w-4 h-4" />
                Load Sample Data
              </button>
              <button
                onClick={clearForm}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-medium rounded-full transition-all duration-300"
              >
                <XCircle className="w-4 h-4" />
                Clear Form
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="glass-card p-8 rounded-3xl">
            <div className="mb-8">
              <h2 className="flex items-center space-x-2 text-2xl font-bold text-gray-100 mb-2 ghibli-title">
                <Stethoscope className="w-8 h-8 text-blue-400" />
                <span>Mandibular Measurements Input</span>
              </h2>
              <p className="text-lg text-gray-400 ghibli-text">
                Enter the 15 mandibular measurements for AI-powered gender
                classification
              </p>
            </div>

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
                    <label className="block text-sm font-semibold text-gray-300 ghibli-text">
                      <span className="text-blue-400">M{index + 1}.</span>{" "}
                      {feature}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={measurements[index] || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={`Enter ${feature.toLowerCase()}`}
                      className="ghibli-input"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="min-w-[250px] px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin inline" />
                      Analyzing Measurements...
                    </>
                  ) : (
                    <>
                      <Brain className="w-6 h-6 mr-3 inline" />
                      Predict Gender
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
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
              <div
                className={cn(
                  "overflow-hidden rounded-3xl p-8",
                  result.success ? "result-card-success" : "result-card-error"
                )}
              >
                {result.success && result.prediction ? (
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="text-8xl mb-6"
                    >
                      {result.prediction.gender === "F" ? "👩" : "👨"}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <h2 className="text-4xl font-bold text-white mb-2 ghibli-title">
                        {result.prediction.gender_full}
                      </h2>
                      <p className="text-2xl font-semibold mb-6 text-green-400 ghibli-text">
                        Confidence:{" "}
                        {result.prediction.confidence.toFixed(1)}%
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="grid grid-cols-2 gap-6 max-w-md mx-auto"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-sm font-medium text-gray-300 mb-2 ghibli-text">
                          👩 Female
                        </div>
                        <div className="text-2xl font-bold text-white ghibli-title">
                          {result.prediction.probabilities.Female.toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-sm font-medium text-gray-300 mb-2 ghibli-text">
                          👨 Male
                        </div>
                        <div className="text-2xl font-bold text-white ghibli-title">
                          {result.prediction.probabilities.Male.toFixed(1)}
                          %
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <XCircle className="w-16 h-16 text-rose-400 mx-auto" />
                    <h3 className="text-2xl font-semibold text-rose-300 ghibli-title">
                      Analysis Failed
                    </h3>
                    <p className="text-rose-400 text-lg ghibli-text">
                      {result.error}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Mandible Viewer with Labels */}
        <AnimatePresence>
          {result && result.success && result.prediction && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8"
            >
              <div className="glass-card p-6 rounded-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3 ghibli-title">
                    <Microscope className="w-8 h-8 text-amber-400" />
                    Interactive 3D Mandible Analysis
                  </h2>
                  <p className="text-gray-400 ghibli-text">
                    Click on feature labels to highlight specific measurements
                    on the mandible model
                  </p>
                </div>
                <MandibleWithLabels
                  selectedFeature={selectedFeature}
                  measurements={measurements.map((m) => parseFloat(m) || 0)}
                  onFeatureSelect={setSelectedFeature}
                  predictedGender={result.prediction?.gender_full || "Male"}
                />
              </div>
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
                measurements={measurements.map((m) => parseFloat(m) || 0)}
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
                genderPredicted={result.prediction?.gender_full || ""}
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
                  measurements: measurements.map((m) => parseFloat(m) || 0),
                  featureNames: features,
                  aiExplanation: result.ai_explanation || "",
                  timestamp: new Date().toISOString(),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
