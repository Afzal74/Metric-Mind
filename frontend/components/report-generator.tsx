"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

interface ReportData {
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
  aiExplanation: string;
  timestamp: string;
}

interface ReportGeneratorProps {
  reportData: ReportData;
}

export function ReportGenerator({ reportData }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    toast.loading("Capturing charts and generating report...", {
      id: "pdf-generation",
    });

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Capture charts from the DOM
      const captureChart = async (selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
          const canvas = await html2canvas(element as HTMLElement, {
            backgroundColor: "#1f2937", // Dark background
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
          });
          return canvas.toDataURL("image/png");
        }
        return null;
      };

      // Capture all chart elements
      toast.loading("Capturing visualization charts...", {
        id: "pdf-generation",
      });
      const chartsContainer = document.querySelector("[data-charts-container]");
      let chartsImage = null;

      if (chartsContainer) {
        chartsImage = await html2canvas(chartsContainer as HTMLElement, {
          backgroundColor: "#1f2937",
          scale: 1.5,
          logging: false,
          useCORS: true,
          width: 800,
          height: 600,
        }).then((canvas) => canvas.toDataURL("image/png"));
      }

      // Helper function to add text with word wrap (more compact)
      const addText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize = 8
      ) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + lines.length * fontSize * 0.35;
      };

      // Compact header with Metric Mind branding
      pdf.setFillColor(30, 41, 59); // Dark blue
      pdf.rect(0, 0, pageWidth, 25, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("METRIC MIND", 15, 12);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("Forensic Gender Classification Report", 15, 18);
      pdf.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 50, 18);

      // Reset text color
      pdf.setTextColor(0, 0, 0);
      yPosition = 32;

      // Compact report information in a box
      pdf.setFillColor(248, 250, 252);
      pdf.rect(15, yPosition, pageWidth - 30, 20, "F");
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(15, yPosition, pageWidth - 30, 20, "S");

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("PREDICTION RESULTS", 20, yPosition + 8);
      
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Report ID: MM-${Date.now()}`, pageWidth - 60, yPosition + 15);
      yPosition += 25;

      // Compact prediction results in columns
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Gender: ${reportData.prediction.gender_full}`, 20, yPosition);
      pdf.text(`Confidence: ${reportData.prediction.confidence}%`, 80, yPosition);
      pdf.text(`Female: ${reportData.prediction.probabilities.Female}%`, 20, yPosition + 6);
      pdf.text(`Male: ${reportData.prediction.probabilities.Male}%`, 80, yPosition + 6);
      yPosition += 15;

      // Add Charts Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("VISUALIZATION CHARTS", 20, yPosition);
      yPosition += 15;

      // Create Confidence Gauge Chart
      const drawConfidenceGauge = (
        x: number,
        y: number,
        radius: number,
        confidence: number
      ) => {
        const centerX = x + radius;
        const centerY = y + radius;

        // Background circle
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(8);
        pdf.circle(centerX, centerY, radius, "S");

        // Confidence arc
        const angle = (confidence / 100) * 360;
        const color =
          confidence >= 80
            ? [34, 197, 94]
            : confidence >= 60
            ? [245, 158, 11]
            : [239, 68, 68];
        pdf.setDrawColor(color[0], color[1], color[2]);
        pdf.setLineWidth(8);

        // Draw arc (simplified as multiple small lines)
        const steps = Math.floor(angle / 5);
        for (let i = 0; i <= steps; i++) {
          const currentAngle = (i * 5 * Math.PI) / 180 - Math.PI / 2;
          const nextAngle = ((i + 1) * 5 * Math.PI) / 180 - Math.PI / 2;
          const x1 = centerX + Math.cos(currentAngle) * radius;
          const y1 = centerY + Math.sin(currentAngle) * radius;
          const x2 = centerX + Math.cos(nextAngle) * radius;
          const y2 = centerY + Math.sin(nextAngle) * radius;
          pdf.line(x1, y1, x2, y2);
        }

        // Center text
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${confidence}%`, centerX - 8, centerY + 2);
        pdf.setFontSize(8);
        pdf.text("Confidence", centerX - 10, centerY + 8);
      };

      // Create Probability Bar Chart
      const drawProbabilityBars = (
        x: number,
        y: number,
        width: number,
        height: number
      ) => {
        const femaleProb = reportData.prediction.probabilities.Female;
        const maleProb = reportData.prediction.probabilities.Male;

        const barWidth = width / 3;
        const maxHeight = height - 20;

        // Female bar
        const femaleHeight = (femaleProb / 100) * maxHeight;
        pdf.setFillColor(236, 72, 153); // Pink
        pdf.rect(x, y + maxHeight - femaleHeight, barWidth, femaleHeight, "F");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8);
        pdf.text("👩 Female", x, y + maxHeight + 8);
        pdf.text(`${femaleProb.toFixed(1)}%`, x, y + maxHeight + 15);

        // Male bar
        const maleHeight = (maleProb / 100) * maxHeight;
        pdf.setFillColor(59, 130, 246); // Blue
        pdf.rect(
          x + barWidth * 1.5,
          y + maxHeight - maleHeight,
          barWidth,
          maleHeight,
          "F"
        );
        pdf.text("👨 Male", x + barWidth * 1.5, y + maxHeight + 8);
        pdf.text(
          `${maleProb.toFixed(1)}%`,
          x + barWidth * 1.5,
          y + maxHeight + 15
        );

        // Y-axis labels
        pdf.setFontSize(6);
        for (let i = 0; i <= 100; i += 25) {
          const labelY = y + maxHeight - (i / 100) * maxHeight;
          pdf.text(`${i}%`, x - 15, labelY);
          pdf.setDrawColor(200, 200, 200);
          pdf.line(x - 5, labelY, x + width, labelY);
        }
      };

      // Create Top Measurements Chart
      const drawTopMeasurements = (x: number, y: number, width: number) => {
        const topMeasurements = reportData.measurements
          .map((value, index) => ({
            name: reportData.featureNames[index].replace(/^M\d+\s/, ""),
            value: value,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Top 5 Key Measurements", x, y);

        topMeasurements.forEach((measurement, index) => {
          const barY = y + 15 + index * 15;
          const barWidth =
            (measurement.value /
              Math.max(...topMeasurements.map((m) => m.value))) *
            (width - 60);

          // Bar
          const colors = [
            [59, 130, 246],
            [139, 92, 246],
            [236, 72, 153],
            [245, 158, 11],
            [34, 197, 94],
          ];
          pdf.setFillColor(
            colors[index][0],
            colors[index][1],
            colors[index][2]
          );
          pdf.rect(x + 60, barY - 5, barWidth, 8, "F");

          // Label and value
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          pdf.text(measurement.name.substring(0, 20), x, barY);
          pdf.text(measurement.value.toString(), x + 65 + barWidth, barY);
        });
      };

      // Draw compact charts side by side
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("VISUALIZATION CHARTS", 15, yPosition);
      yPosition += 8;

      // Smaller charts positioned side by side
      drawConfidenceGauge(20, yPosition, 20, reportData.prediction.confidence);
      drawProbabilityBars(70, yPosition, 60, 40);

      // Chart labels
      pdf.setFontSize(7);
      pdf.text("Confidence Level", 22, yPosition + 45);
      pdf.text("Gender Probabilities", 75, yPosition + 45);

      yPosition += 55;

      // Compact top measurements
      drawTopMeasurements(15, yPosition, pageWidth - 30);
      yPosition += 70;

      // Add captured web charts if available
      if (chartsImage) {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Interactive Web Charts", 20, yPosition);
        yPosition += 10;

        const imgWidth = pageWidth - 40;
        const imgHeight = (imgWidth * 3) / 4;

        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.addImage(chartsImage, "PNG", 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 15;
      }

      // Compact measurements in 3 columns
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("MANDIBULAR MEASUREMENTS", 15, yPosition);
      yPosition += 8;

      const colWidth = (pageWidth - 30) / 3;
      let col = 0;
      let rowY = yPosition;

      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");

      reportData.measurements.forEach((measurement, index) => {
        const x = 15 + col * colWidth;
        const shortName = reportData.featureNames[index]
          .replace(/^M\d+\s/, "")
          .substring(0, 18);

        pdf.text(`${index + 1}. ${shortName}`, x, rowY);
        pdf.text(`${measurement}`, x, rowY + 4);

        col++;
        if (col >= 3) {
          col = 0;
          rowY += 10;
        }
      });

      yPosition = rowY + 15;

      // AI Analysis Section
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("METRIC MIND AI ANALYSIS", 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      // Format AI explanation
      const cleanExplanation = reportData.aiExplanation
        .replace(/\*\*/g, "")
        .replace(/\d+\.\s/g, "\n• ")
        .trim();

      const explanationLines = pdf.splitTextToSize(
        cleanExplanation,
        pageWidth - 50
      );
      explanationLines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 25, yPosition);
        yPosition += 4;
      });

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
        pdf.text(
          "Generated by Metric Mind - Forensic Gender Classifier",
          20,
          pageHeight - 10
        );
      }

      // Model Information Page
      pdf.addPage();
      yPosition = 20;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("MODEL INFORMATION", 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const modelInfo = [
        "Algorithm: Logistic Regression",
        "Training Accuracy: 75.00%",
        "Dataset Size: 156 samples (103 Male, 53 Female)",
        "Features: 15 mandibular measurements",
        "Validation Method: Cross-validation",
        "",
        "DISCLAIMER:",
        "This analysis is generated by Metric Mind AI for educational and research purposes.",
        "Results should be interpreted by qualified forensic anthropologists.",
        "The system provides probabilistic estimates based on mandibular morphometry.",
        "",
        "ABOUT METRIC MIND:",
        "Metric Mind is an advanced AI-powered forensic analysis platform developed",
        "for gender classification using mandibular measurements. The system combines",
        "machine learning algorithms with forensic anthropology principles to provide",
        "accurate and reliable gender predictions.",
        "",
        "Team: Metric Mind - VTU CSE Project 2024",
      ];

      modelInfo.forEach((info) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        yPosition = addText(info, 20, yPosition, pageWidth - 40);
      });

      // Save the PDF
      const fileName = `MetricMind_Report_${
        reportData.prediction.gender_full
      }_${Date.now()}.pdf`;
      pdf.save(fileName);

      toast.success("Report generated successfully!", { id: "pdf-generation" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report", { id: "pdf-generation" });
    } finally {
      setIsGenerating(false);
    }
  };

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
              <h3 className="text-lg font-bold">Generate Analysis Report</h3>
              <p className="text-sm text-gray-400 font-normal">
                Download comprehensive PDF report with all analysis data
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-green-400 font-semibold">Prediction</div>
                <div className="text-gray-300">
                  {reportData.prediction.gender_full}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-semibold">Confidence</div>
                <div className="text-gray-300">
                  {reportData.prediction.confidence}%
                </div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-purple-400 font-semibold">Features</div>
                <div className="text-gray-300">
                  {reportData.measurements.length}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-orange-400 font-semibold">AI Analysis</div>
                <div className="text-gray-300">Included</div>
              </div>
            </div>

            <Button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>

            <div className="text-xs text-gray-400 text-center">
              📄 Report includes: Prediction results, measurements, AI analysis,
              and model information
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
