'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target, TrendingUp, Shield, Award } from 'lucide-react'

// Enhanced Stat Cards with Advanced Tailwind
export function EnhancedStatCards() {
  const stats = [
    { 
      icon: Brain, 
      label: 'Model Accuracy', 
      value: '75%', 
      change: '+2.3%',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Target, 
      label: 'Predictions Made', 
      value: '1,247', 
      change: '+12%',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: TrendingUp, 
      label: 'Success Rate', 
      value: '94.2%', 
      change: '+5.1%',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Shield, 
      label: 'Reliability', 
      value: '99.8%', 
      change: '+0.2%',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
          
          {/* Main card */}
          <div className="relative glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
            {/* Icon with glow effect */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 font-medium">{stat.change}</div>
              </div>
            </div>
            
            {/* Value */}
            <div className="space-y-1">
              <div className="text-2xl font-bold orbitron-font text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 space-grotesk-font">
                {stat.label}
              </div>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Enhanced Button Components
export function EnhancedButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Primary Action Button */}
      <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
        <span className="relative z-10 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Analyze Sample
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Glass Button */}
      <button className="px-6 py-3 glass-card text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40">
        <span className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          View Results
        </span>
      </button>

      {/* Neon Button */}
      <button className="px-6 py-3 bg-black border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 neon-glow">
        Generate Report
      </button>
    </div>
  )
}

// Enhanced Input Fields
export function EnhancedInputs() {
  return (
    <div className="space-y-6">
      {/* Floating Label Input */}
      <div className="relative">
        <input
          type="text"
          id="floating-input"
          className="peer w-full px-4 py-4 bg-black/30 border-2 border-gray-700/50 rounded-xl text-white placeholder-transparent focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-xl"
          placeholder="Mandibular Length"
        />
        <label
          htmlFor="floating-input"
          className="absolute left-4 -top-2.5 bg-black px-2 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-400 peer-focus:text-sm"
        >
          Mandibular Length (mm)
        </label>
      </div>

      {/* Gradient Border Input */}
      <div className="relative p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
        <input
          type="text"
          className="w-full px-4 py-3 bg-black rounded-xl text-white placeholder-gray-400 focus:outline-none"
          placeholder="Enter measurement value..."
        />
      </div>

      {/* Search Input with Icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Brain className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 dark-input rounded-xl focus:ring-2 focus:ring-blue-400/50 transition-all"
          placeholder="Search measurements..."
        />
      </div>
    </div>
  )
}

// Enhanced Cards
export function EnhancedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Holographic Card */}
      <div className="holographic-border rounded-xl p-6 hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold orbitron-font text-white">AI Analysis</h3>
        </div>
        <p className="text-gray-300 space-grotesk-font">
          Advanced machine learning algorithms analyze mandibular measurements with 75% accuracy.
        </p>
      </div>

      {/* Animated Gradient Card */}
      <div className="relative group overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0.5 bg-black rounded-xl" />
        <div className="relative p-6 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold orbitron-font text-white">Precision Results</h3>
          </div>
          <p className="text-gray-300 space-grotesk-font">
            Get detailed forensic analysis with confidence scores and probability distributions.
          </p>
        </div>
      </div>
    </div>
  )
}

// Enhanced Loading States
export function EnhancedLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      {/* Spinning Brain Icon */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <Brain className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Animated Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold orbitron-font text-white">
          Analyzing Sample
        </h3>
        <p className="text-gray-400 space-grotesk-font">
          Processing mandibular measurements...
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
      </div>
    </div>
  )
}