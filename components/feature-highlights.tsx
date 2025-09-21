"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Zap, Globe, Lock, AlertTriangle, CheckCircle, Database } from "lucide-react"

export function FeatureHighlights() {
  const features = [
    {
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning algorithms analyze 30+ security features to identify phishing attempts with 97% accuracy.",
      icon: Brain,
      color: "text-blue-500",
      badge: "ML Engine",
    },
    {
      title: "Real-Time Analysis",
      description:
        "Instant URL scanning with sub-2-second response times. Get immediate security assessments for any website.",
      icon: Zap,
      color: "text-yellow-500",
      badge: "Fast",
    },
    {
      title: "Comprehensive Security",
      description: "Checks HTTPS status, domain age, suspicious patterns, redirects, and known phishing indicators.",
      icon: Shield,
      color: "text-green-500",
      badge: "Complete",
    },
    {
      title: "Global Threat Intel",
      description:
        "Leverages worldwide threat intelligence databases and real-time blacklists for enhanced protection.",
      icon: Globe,
      color: "text-purple-500",
      badge: "Intelligence",
    },
    {
      title: "Privacy First",
      description: "No personal data stored. URLs are analyzed securely and results are not logged or shared.",
      icon: Lock,
      color: "text-red-500",
      badge: "Private",
    },
    {
      title: "Risk Assessment",
      description:
        "Detailed risk scoring with confidence levels and specific threat indicators for informed decisions.",
      icon: AlertTriangle,
      color: "text-orange-500",
      badge: "Detailed",
    },
  ]

  const securityChecks = [
    "URL structure analysis",
    "Domain reputation check",
    "SSL certificate validation",
    "Redirect chain analysis",
    "Content pattern matching",
    "Blacklist verification",
    "Phishing signature detection",
    "Social engineering indicators",
  ]

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-balance mb-2">Advanced Security Features</h2>
        <p className="text-muted-foreground text-lg">Comprehensive protection powered by cutting-edge technology</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Checks */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center">
            <Database className="mr-2 h-6 w-6 text-primary" />
            30+ Security Checks Performed
          </CardTitle>
          <CardDescription>Each URL is analyzed against multiple security criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
