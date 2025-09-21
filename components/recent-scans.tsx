"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ExternalLink,
  Trash2,
  Download,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ScanHistory {
  id: string
  url: string
  isPhishing: boolean
  confidence: number
  riskLevel: "low" | "medium" | "high"
  timestamp: Date
  scanTime: number
  features?: {
    hasHttps: boolean
    domainAge: number
    suspiciousPatterns: string[]
    redirectCount: number
  }
}

export function RecentScans() {
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ScanHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Load scan history from localStorage
    const saved = localStorage.getItem("phishguard-history")
    if (saved) {
      const parsed = JSON.parse(saved).map((scan: any) => ({
        ...scan,
        timestamp: new Date(scan.timestamp),
      }))
      setScanHistory(parsed)
      setFilteredHistory(parsed)
    }
  }, [])

  useEffect(() => {
    // Apply filters and search
    let filtered = [...scanHistory]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((scan) => scan.url.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Risk level filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((scan) => scan.riskLevel === filterRisk)
    }

    // Type filter
    if (filterType !== "all") {
      if (filterType === "phishing") {
        filtered = filtered.filter((scan) => scan.isPhishing)
      } else if (filterType === "safe") {
        filtered = filtered.filter((scan) => !scan.isPhishing)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.timestamp.getTime() - a.timestamp.getTime()
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime()
        case "confidence":
          return b.confidence - a.confidence
        case "risk":
          const riskOrder = { high: 3, medium: 2, low: 1 }
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
        default:
          return 0
      }
    })

    setFilteredHistory(filtered)
  }, [scanHistory, searchTerm, filterRisk, filterType, sortBy])

  const clearHistory = () => {
    localStorage.removeItem("phishguard-history")
    setScanHistory([])
    setFilteredHistory([])
  }

  const deleteScan = (id: string) => {
    const updated = scanHistory.filter((scan) => scan.id !== id)
    setScanHistory(updated)
    localStorage.setItem("phishguard-history", JSON.stringify(updated))
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `phishguard-history-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const exportCSV = () => {
    const headers = [
      "URL",
      "Status",
      "Risk Level",
      "Confidence",
      "Timestamp",
      "Scan Time (ms)",
      "HTTPS",
      "Domain Age",
      "Redirects",
    ]
    const csvData = [
      headers.join(","),
      ...filteredHistory.map((scan) =>
        [
          `"${scan.url}"`,
          scan.isPhishing ? "Phishing" : "Safe",
          scan.riskLevel,
          scan.confidence,
          scan.timestamp.toISOString(),
          scan.scanTime,
          scan.features?.hasHttps ? "Yes" : "No",
          scan.features?.domainAge || "Unknown",
          scan.features?.redirectCount || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `phishguard-history-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const displayedScans = showAll ? filteredHistory : filteredHistory.slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance mb-2">Scan History</h2>
          <p className="text-muted-foreground">
            Your recent URL security scans and results ({filteredHistory.length} total)
          </p>
        </div>
        {scanHistory.length > 0 && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportHistory}>Export as JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={exportCSV}>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {scanHistory.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
              <p className="text-muted-foreground">Start scanning URLs to see your history here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Filters and Search */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search URLs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                    <SelectItem value="risk">Risk Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Scan Results */}
          {displayedScans.map((scan) => (
            <Card
              key={scan.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {scan.isPhishing ? (
                      <ShieldAlert className="h-8 w-8 text-red-500 flex-shrink-0" />
                    ) : (
                      <ShieldCheck className="h-8 w-8 text-green-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{scan.url}</p>
                      <div className="flex items-center space-x-4 mt-1 flex-wrap gap-2">
                        <Badge variant={scan.isPhishing ? "destructive" : "default"} className="text-xs">
                          {scan.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <span className="text-sm text-muted-foreground">{scan.confidence}% confidence</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimeAgo(scan.timestamp)}
                        </span>
                        {scan.features?.hasHttps && (
                          <Badge variant="secondary" className="text-xs">
                            HTTPS
                          </Badge>
                        )}
                        {scan.scanTime && <span className="text-xs text-muted-foreground">{scan.scanTime}ms</span>}
                      </div>
                      {scan.features?.suspiciousPatterns && scan.features.suspiciousPatterns.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Suspicious patterns:</p>
                          <div className="flex flex-wrap gap-1">
                            {scan.features.suspiciousPatterns.slice(0, 3).map((pattern, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {pattern.length > 30 ? `${pattern.substring(0, 30)}...` : pattern}
                              </Badge>
                            ))}
                            {scan.features.suspiciousPatterns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{scan.features.suspiciousPatterns.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => window.open(scan.url, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => window.open(scan.url, "_blank")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(scan.url)}>
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteScan(scan.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredHistory.length > 10 && !showAll && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Showing 10 of {filteredHistory.length} scans</p>
                  <Button variant="outline" onClick={() => setShowAll(true)}>
                    Show All Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showAll && filteredHistory.length > 10 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowAll(false)}>
                    Show Less
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredHistory.length === 0 && scanHistory.length > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
