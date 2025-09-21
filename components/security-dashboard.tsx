"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  PiIcon as PieIcon,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

interface DashboardStats {
  totalScans: number
  phishingDetected: number
  legitimateUrls: number
  accuracy: number
  avgResponseTime: number
  todayScans: number
  weeklyTrend: number
}

interface ThreatData {
  date: string
  phishing: number
  legitimate: number
  total: number
}

interface RiskDistribution {
  name: string
  value: number
  color: string
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    phishingDetected: 0,
    legitimateUrls: 0,
    accuracy: 97.3,
    avgResponseTime: 1.2,
    todayScans: 0,
    weeklyTrend: 15.2,
  })

  const [threatData, setThreatData] = useState<ThreatData[]>([])
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([])

  useEffect(() => {
    // Load scan history and calculate stats
    const history = JSON.parse(localStorage.getItem("phishguard-history") || "[]")

    const totalScans = history.length
    const phishingDetected = history.filter((scan: any) => scan.isPhishing).length
    const legitimateUrls = totalScans - phishingDetected

    // Calculate today's scans
    const today = new Date().toDateString()
    const todayScans = history.filter((scan: any) => new Date(scan.timestamp).toDateString() === today).length

    setStats((prev) => ({
      ...prev,
      totalScans,
      phishingDetected,
      legitimateUrls,
      todayScans,
    }))

    // Generate threat data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    const threatDataGenerated = last7Days.map((date) => {
      const dayScans = history.filter((scan: any) => scan.timestamp.split("T")[0] === date)
      const phishing = dayScans.filter((scan: any) => scan.isPhishing).length
      const legitimate = dayScans.length - phishing

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        phishing,
        legitimate,
        total: dayScans.length,
      }
    })

    setThreatData(threatDataGenerated)

    // Calculate risk distribution
    const highRisk = history.filter((scan: any) => scan.riskLevel === "high").length
    const mediumRisk = history.filter((scan: any) => scan.riskLevel === "medium").length
    const lowRisk = history.filter((scan: any) => scan.riskLevel === "low").length

    setRiskDistribution([
      { name: "High Risk", value: highRisk, color: "#ef4444" },
      { name: "Medium Risk", value: mediumRisk, color: "#f59e0b" },
      { name: "Low Risk", value: lowRisk, color: "#10b981" },
    ])
  }, [])

  const topThreats = [
    { type: "Phishing Email Links", count: 1247, trend: "+12%" },
    { type: "Fake Banking Sites", count: 892, trend: "+8%" },
    { type: "Social Media Scams", count: 634, trend: "+15%" },
    { type: "Cryptocurrency Fraud", count: 421, trend: "+23%" },
    { type: "Tech Support Scams", count: 318, trend: "+5%" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-balance mb-2">Security Dashboard</h2>
        <p className="text-muted-foreground text-lg">Real-time threat intelligence and system performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{stats.todayScans} today</p>
              <Badge variant="secondary" className="text-xs">
                +{stats.weeklyTrend}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Threats Blocked</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.phishingDetected}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Phishing attempts</p>
              <Badge variant="destructive" className="text-xs">
                High Alert
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Detection Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.accuracy}%</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">ML model performance</p>
              <Badge variant="default" className="text-xs">
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Average scan time</p>
              <Badge variant="secondary" className="text-xs">
                Fast
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="intelligence">Threat Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Timeline */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Threat Detection Timeline
                </CardTitle>
                <CardDescription>Daily phishing and legitimate URL detections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="phishing" stroke="#ef4444" strokeWidth={2} name="Phishing" />
                    <Line type="monotone" dataKey="legitimate" stroke="#10b981" strokeWidth={2} name="Legitimate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieIcon className="mr-2 h-5 w-5" />
                  Risk Level Distribution
                </CardTitle>
                <CardDescription>Breakdown of detected threat levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Performance */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span>1.2s</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Model Accuracy</span>
                    <span>97.3%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Detection Metrics */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Detection Metrics
                </CardTitle>
                <CardDescription>Model performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">97.3%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">95.8%</div>
                    <div className="text-sm text-muted-foreground">Precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">98.1%</div>
                    <div className="text-sm text-muted-foreground">Recall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">96.9%</div>
                    <div className="text-sm text-muted-foreground">F1-Score</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span>False Positives</span>
                    <Badge variant="secondary">2.1%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>False Negatives</span>
                    <Badge variant="secondary">1.9%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          {/* Top Threats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Top Threat Categories
              </CardTitle>
              <CardDescription>Most common phishing attack vectors detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topThreats.map((threat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                        <span className="text-red-500 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{threat.type}</p>
                        <p className="text-sm text-muted-foreground">{threat.count} detections</p>
                      </div>
                    </div>
                    <Badge variant={threat.trend.startsWith("+") ? "destructive" : "default"}>{threat.trend}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Recommendations */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Recommendations
              </CardTitle>
              <CardDescription>Proactive measures to enhance protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enable Real-time Scanning</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically scan all URLs before visiting for maximum protection
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Update Threat Intelligence</p>
                    <p className="text-sm text-muted-foreground">
                      Keep threat databases updated with latest phishing patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Configure Email Protection</p>
                    <p className="text-sm text-muted-foreground">
                      Scan email links automatically to prevent phishing attacks
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enable Browser Extension</p>
                    <p className="text-sm text-muted-foreground">
                      Install browser extension for seamless protection while browsing
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
