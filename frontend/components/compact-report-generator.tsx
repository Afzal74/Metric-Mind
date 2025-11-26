'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

interface ReportData {
  prediction: {
    gender: string
    gender_full: string
    confidence: number
    probabilities: {
      Female: number
      Male: number
    }
  }
  measurements: number[]
  featureNames: string[]
  aiExplanation: string
  timestamp: string
}

interface CompactReportGeneratorProps {
  reportData: ReportData
}

export function CompactReportGenerator({ reportData }: CompactReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCompactPDF = async () => {
    setIsGenerating(true)
    toast.loading('Generating compact report...', { id: 'pdf-generation' })

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPos = 15

      // Compact header
      pdf.setFillColor(30, 41, 59)
      pdf.rect(0, 0, pageWidth, 25, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('METRIC MIND', 15, 12)
      
      pdf.setFontSize(9)
      pdf.text('Forensic Gender Classification Report', 15, 18)
      pdf.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 60, 18)

      yPos = 35

      // Compact prediction results in a box
      pdf.setFillColor(248, 250, 252)
      pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'F')
      pdf.setDrawColor(203, 213, 225)
      pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'S')

      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('PREDICTION RESULTS', 20, yPos + 3)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Gender: ${reportData.prediction.gender_full}`, 20, yPos + 10)
      pdf.text(`Confidence: ${reportData.prediction.confidence}%`, 80, yPos + 10)
      pdf.text(`Female: ${reportData.prediction.probabilities.Female}%`, 20, yPos + 16)
      pdf.text(`Male: ${reportData.prediction.probabilities.Male}%`, 80, yPos + 16)

      yPos += 35

      // Compact charts section
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('VISUALIZATION ANALYSIS', 15, yPos)
      yPos += 8

      // Draw compact confidence gauge
      const drawCompactGauge = (x: number, y: number, size: number, confidence: number) => {
        const centerX = x + size/2
        const centerY = y + size/2
        const radius = size/2 - 2
        
        // Background circle
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(3)
        pdf.circle(centerX, centerY, radius, 'S')
        
        // Confidence arc
        const angle = (confidence / 100) * 360
        const color = confidence >= 80 ? [34, 197, 94] : confidence >= 60 ? [245, 158, 11] : [239, 68, 68]
        pdf.setDrawColor(color[0], color[1], color[2])
        pdf.setLineWidth(3)
        
        // Simplified arc drawing
        const steps = Math.floor(angle / 10)
        for (let i = 0; i <= steps; i++) {
          const currentAngle = (i * 10 * Math.PI) / 180 - Math.PI / 2
          const nextAngle = ((i + 1) * 10 * Math.PI) / 180 - Math.PI / 2
          const x1 = centerX + Math.cos(currentAngle) * radius
          const y1 = centerY + Math.sin(currentAngle) * radius
          const x2 = centerX + Math.cos(nextAngle) * radius
          const y2 = centerY + Math.sin(nextAngle) * radius
          pdf.line(x1, y1, x2, y2)
        }
        
        // Center text
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${confidence}%`, centerX - 6, centerY + 1)
        pdf.setFontSize(6)
        pdf.text('Confidence', centerX - 8, centerY + 6)
      }

      // Draw compact probability bars
      const drawCompactBars = (x: number, y: number, width: number, height: number) => {
        const femaleProb = reportData.prediction.probabilities.Female
        const maleProb = reportData.prediction.probabilities.Male
        
        const barWidth = 15
        const maxHeight = height - 15
        
        // Female bar
        const femaleHeight = (femaleProb / 100) * maxHeight
        pdf.setFillColor(236, 72, 153)
        pdf.rect(x, y + maxHeight - femaleHeight, barWidth, femaleHeight, 'F')
        
        // Male bar  
        const maleHeight = (maleProb / 100) * maxHeight
        pdf.setFillColor(59, 130, 246)
        pdf.rect(x + 25, y + maxHeight - maleHeight, barWidth, maleHeight, 'F')
        
        // Labels
        pdf.setFontSize(7)
        pdf.setTextColor(0, 0, 0)
        pdf.text('F', x + 6, y + maxHeight + 8)
        pdf.text('M', x + 31, y + maxHeight + 8)
        pdf.text(`${femaleProb.toFixed(0)}%`, x + 2, y + maxHeight + 13)
        pdf.text(`${maleProb.toFixed(0)}%`, x + 27, y + maxHeight + 13)
      }

      // Position charts side by side
      drawCompactGauge(20, yPos, 30, reportData.prediction.confidence)
      drawCompactBars(70, yPos, 50, 30)

      // Chart labels
      pdf.setFontSize(8)
      pdf.text('Confidence Level', 25, yPos + 35)
      pdf.text('Gender Probabilities', 75, yPos + 35)

      yPos += 50

      // Compact measurements table
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('KEY MEASUREMENTS', 15, yPos)
      yPos += 8

      // Create a compact 3-column layout for measurements
      const colWidth = (pageWidth - 30) / 3
      let col = 0
      let rowY = yPos

      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')

      reportData.measurements.forEach((measurement, index) => {
        const x = 15 + (col * colWidth)
        const shortName = reportData.featureNames[index].replace(/^M\d+\s/, '').substring(0, 18)
        
        pdf.text(`${index + 1}. ${shortName}`, x, rowY)
        pdf.text(`${measurement}`, x, rowY + 4)
        
        col++
        if (col >= 3) {
          col = 0
          rowY += 12
        }
      })

      yPos = rowY + 15

      // Compact AI analysis
      if (yPos > pageHeight - 60) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('METRIC MIND AI ANALYSIS', 15, yPos)
      yPos += 8

      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      
      // Format and compress AI explanation
      const cleanExplanation = reportData.aiExplanation
        .replace(/\*\*/g, '')
        .replace(/\d+\.\s/g, '• ')
        .substring(0, 800) // Limit length
        .trim()

      const lines = pdf.splitTextToSize(cleanExplanation, pageWidth - 30)
      lines.forEach((line: string, index: number) => {
        if (yPos > pageHeight - 15) {
          pdf.addPage()
          yPos = 20
        }
        pdf.text(line, 15, yPos)
        yPos += 3.5
      })

      // Compact footer
      pdf.setFontSize(7)
      pdf.setTextColor(128, 128, 128)
      pdf.text('Generated by Metric Mind - Advanced Forensic AI Analysis Platform', 15, pageHeight - 10)
      pdf.text(`Report ID: MM-${Date.now()}`, pageWidth - 50, pageHeight - 10)

      // Save with descriptive filename
      const fileName = `MetricMind_${reportData.prediction.gender_full}_${reportData.prediction.confidence}pct_${Date.now()}.pdf`
      pdf.save(fileName)

      toast.success('Compact report generated!', { id: 'pdf-generation' })
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate report', { id: 'pdf-generation' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-green-500/30 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-gray-100">
            <FileText className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-lg font-bold">Generate Compact Report</h3>
              <p className="text-sm text-gray-400 font-normal">
                Download optimized PDF with charts and analysis
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-green-400 font-semibold">Result</div>
                <div className="text-gray-300">{reportData.prediction.gender_full}</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-semibold">Confidence</div>
                <div className="text-gray-300">{reportData.prediction.confidence}%</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-purple-400 font-semibold">Charts</div>
                <div className="text-gray-300">Included</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-orange-400 font-semibold">AI Analysis</div>
                <div className="text-gray-300">Compact</div>
              </div>
            </div>

            <Button
              onClick={generateCompactPDF}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Compact Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Compact PDF
                </>
              )}
            </Button>

            <div className="text-xs text-gray-400 text-center">
              📄 Optimized single-page report with charts, measurements, and AI analysis
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}