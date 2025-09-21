"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, Users, Zap } from "lucide-react"

export function StatsOverview() {
  const stats = [
    {
      title: "Detection Accuracy",
      value: "97.3%",
      description: "Machine learning model accuracy",
      icon: Shield,
      trend: "+2.1%",
      color: "text-green-500",
    },
    {
      title: "URLs Scanned",
      value: "2.4M+",
      description: "Total security scans performed",
      icon: TrendingUp,
      trend: "+15.2%",
      color: "text-blue-500",
    },
    {
      title: "Protected Users",
      value: "50K+",
      description: "Active users protected daily",
      icon: Users,
      trend: "+8.7%",
      color: "text-purple-500",
    },
    {
      title: "Response Time",
      value: "<2s",
      description: "Average scan completion time",
      icon: Zap,
      trend: "-12%",
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-balance mb-2">Trusted by Security Professionals</h2>
        <p className="text-muted-foreground text-lg">Real-time statistics from our advanced threat detection system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
