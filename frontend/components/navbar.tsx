'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Eye, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Classifier',
    href: '/',
    icon: Brain,
    description: 'AI-powered gender prediction'
  },
  {
    name: 'Real 3D Model',
    href: '/viewer',
    icon: Eye,
    description: 'Authentic OBJ mandible model'
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <Image 
                src="/mandible.png" 
                alt="MetricMind Logo" 
                width={40} 
                height={40}
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors ghibli-title">
                MetricMind
              </h1>
              <p className="text-xs text-gray-400 -mt-1 ghibli-text">Forensic AI</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "relative px-4 py-2 transition-all duration-200 rounded-full ghibli-text",
                      isActive 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center space-x-3">
            <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="ghibli-text">System Online</span>
            </Badge>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-amber-500/20 bg-black/90 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <div>
                        <p className="font-medium ghibli-text">{item.name}</p>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
              
              {/* Mobile Status */}
              <div className="pt-4 border-t border-amber-500/20">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-gray-400 ghibli-text">System Status</span>
                  <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
