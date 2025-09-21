"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ShieldAlert, ShieldCheck, Loader2, ExternalLink, Globe, Lock } from "lucide-react"

interface ScanResult {
  url: string
  isPhishing: boolean
  confidence: number
  riskLevel: "low" | "medium" | "high"
  features: {
    hasHttps: boolean
    domainAge: number
    suspiciousPatterns: string[]
    redirectCount: number
  }
  scanTime: number
}

export function SecurityScanner() {
  console.log("[v0] SecurityScanner component rendering...")

  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState("")

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const saveToHistory = (result: ScanResult) => {
    const history = JSON.parse(localStorage.getItem("phishguard-history") || "[]")
    const newScan = {
      id: Date.now().toString(),
      ...result,
      timestamp: new Date().toISOString(),
    }
    history.unshift(newScan)
    // Keep only last 50 scans
    if (history.length > 50) {
      history.splice(50)
    }
    localStorage.setItem("phishguard-history", JSON.stringify(history))
  }

  const handleScan = async () => {
    console.log("[v0] Starting URL scan for:", url)

    if (!url.trim()) {
      setError("Please enter a URL to scan")
      return
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL")
      return
    }

    setIsScanning(true)
    setError("")
    setResult(null)

    try {
      console.log("[v0] Making API request to /api/scan")
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to scan URL")
      }

      const data = await response.json()
      console.log("[v0] Received scan result:", data)
      setResult(data)
      saveToHistory(data)
    } catch (err) {
      console.error("[v0] Scan error:", err)
      setError("Failed to scan URL. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getRiskIcon = (isPhishing: boolean) => {
    return isPhishing ? ShieldAlert : ShieldCheck
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Scanner Input */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary pulse-glow" />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">PhishGuard Security Scanner</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Advanced AI-powered phishing detection with 97% accuracy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to scan (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleScan()}
              className="flex-1 bg-input border-border/50 focus:border-primary"
              disabled={isScanning}
            />
            <Button onClick={handleScan} disabled={isScanning} className="px-8 bg-primary hover:bg-primary/90">
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Scan URL"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm scan-line">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Analyzing URL security features...</p>
                <Progress value={85} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <Card
            className={`border-2 ${result.isPhishing ? "border-red-500/50 bg-red-500/5" : "border-green-500/50 bg-green-500/5"}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {result.isPhishing ? (
                    <ShieldAlert className="h-12 w-12 text-red-500" />
                  ) : (
                    <ShieldCheck className="h-12 w-12 text-green-500" />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{result.isPhishing ? "Phishing Detected" : "URL is Safe"}</h3>
                    <p className="text-muted-foreground">Confidence: {result.confidence}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={result.isPhishing ? "destructive" : "default"} className="text-sm">
                    {result.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Scanned in {result.scanTime}ms</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm break-all">
                  <Globe className="inline h-4 w-4 mr-2" />
                  {result.url}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>HTTPS Enabled</span>
                  <Badge variant={result.features.hasHttps ? "default" : "destructive"}>
                    {result.features.hasHttps ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Domain Age</span>
                  <span className="text-sm">{result.features.domainAge} months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Redirects</span>
                  <span className="text-sm">{result.features.redirectCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5" />
                  Risk Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.features.suspiciousPatterns.length > 0 ? (
                  <div className="space-y-2">
                    {result.features.suspiciousPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                        {pattern}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No suspicious patterns detected</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            {!result.isPhishing && (
              <Button
                variant="default"
                onClick={() => window.open(result.url, "_blank")}
                className="bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Site
              </Button>
            )}
            {result.isPhishing && (
              <Button variant="destructive" onClick={() => window.open(result.url, "_blank")}>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Continue Anyway (Not Recommended)
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
