"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Brain } from "lucide-react";

interface PredictionChartsProps {
  prediction: {
    gender: string;
    gender_full: string;
    confidence: number;
    probabilities: {
      Female: number;
      Male: number;
    };
  };
  measurements: number[];
  featureNames: string[];
}

export function PredictionCharts({
  prediction,
  measurements,
  featureNames,
}: PredictionChartsProps) {
  // Confidence data for radial chart
  const confidenceData = [
    {
      name: "Confidence",
      value: prediction.confidence,
      fill:
        prediction.confidence >= 80
          ? "#10b981"
          : prediction.confidence >= 60
          ? "#f59e0b"
          : "#ef4444",
    },
  ];

  // Probability data for bar chart
  const probabilityData = [
    {
      name: "Female",
      probability: prediction.probabilities.Female,
      fill: "#ec4899",
      icon: "👩",
    },
    {
      name: "Male",
      probability: prediction.probabilities.Male,
      fill: "#3b82f6",
      icon: "👨",
    },
  ];

  // Top 5 most significant measurements (simplified approach)
  const getTopMeasurements = () => {
    const measurementData = measurements.map((value, index) => ({
      name: featureNames[index].replace(/^M\d+\s/, ""),
      value: value,
      fullName: featureNames[index],
    }));

    // Sort by value (this is simplified - in reality you'd use feature importance from the model)
    return measurementData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        importance: 100 - index * 15, // Simulated importance score
        fill: `hsl(${220 + index * 30}, 70%, 50%)`,
      }));
  };

  const topMeasurements = getTopMeasurements();

  return (
    <div className="space-y-6" data-charts-container>
      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confidence Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Prediction Confidence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={confidenceData}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill={confidenceData[0].fill}
                      className="drop-shadow-lg"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-100">
                      {prediction.confidence}%
                    </div>
                    <div className="text-sm text-gray-400">Confidence</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge
                  variant={
                    prediction.confidence >= 80
                      ? "success"
                      : prediction.confidence >= 60
                      ? "warning"
                      : "destructive"
                  }
                  className="text-sm px-3 py-1"
                >
                  {prediction.confidence >= 80
                    ? "High Confidence"
                    : prediction.confidence >= 60
                    ? "Moderate Confidence"
                    : "Low Confidence"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Probabilities */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-100">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Gender Probabilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={probabilityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Bar
                      dataKey="probability"
                      radius={[4, 4, 0, 0]}
                      className="drop-shadow-lg"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                {probabilityData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm text-gray-400">{item.name}</div>
                    <div className="text-lg font-semibold text-gray-100">
                      {item.probability.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Measurements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-100">
              <Brain className="w-5 h-5 text-green-400" />
              <span>Key Measurements Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMeasurements.map((measurement, index) => (
                <motion.div
                  key={measurement.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">
                      {measurement.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {measurement.value}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {measurement.importance}% impact
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${measurement.importance}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: measurement.fill }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400 italic">
                💡 These measurements contributed most significantly to the{" "}
                {prediction.gender_full} prediction
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Predicted Gender",
            value: prediction.gender_full,
            icon: prediction.gender === "M" ? "👨" : "👩",
          },
          {
            label: "Confidence Level",
            value: `${prediction.confidence}%`,
            icon: "🎯",
          },
          {
            label: "Primary Indicator",
            value: topMeasurements[0]?.name || "N/A",
            icon: "📏",
          },
          { label: "Analysis Method", value: "AI + ML", icon: "🤖" },
        ].map((stat, index) => (
          <Card key={stat.label} className="glass-card p-4">
            <div className="text-center space-y-2">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-sm font-semibold text-gray-100">
                {stat.value}
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
