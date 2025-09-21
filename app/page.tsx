import { SecurityScanner } from "@/components/security-scanner"
import { StatsOverview } from "@/components/stats-overview"
import { FeatureHighlights } from "@/components/feature-highlights"
import { RecentScans } from "@/components/recent-scans"
import { SecurityDashboard } from "@/components/security-dashboard"

export default function Home() {
  console.log("[v0] PhishGuard app loading...")

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">PG</span>
                </div>
                <span className="text-xl font-bold">PhishGuard</span>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#scanner" className="text-sm hover:text-primary transition-colors">
                  Scanner
                </a>
                <a href="#dashboard" className="text-sm hover:text-primary transition-colors">
                  Dashboard
                </a>
                <a href="#features" className="text-sm hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#stats" className="text-sm hover:text-primary transition-colors">
                  Statistics
                </a>
                <a href="#history" className="text-sm hover:text-primary transition-colors">
                  History
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero Section with Scanner */}
          <section id="scanner" className="py-12">
            <SecurityScanner />
          </section>

          {/* Security Dashboard */}
          <section id="dashboard">
            <SecurityDashboard />
          </section>

          {/* Stats Overview */}
          <section id="stats">
            <StatsOverview />
          </section>

          {/* Feature Highlights */}
          <section id="features">
            <FeatureHighlights />
          </section>

          {/* Recent Scans */}
          <section id="history">
            <RecentScans />
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">PG</span>
                  </div>
                  <span className="font-bold">PhishGuard</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced AI-powered phishing detection system protecting users from cyber threats.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      URL Scanner
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      API Access
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Browser Extension
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Security</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Security Report
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Responsible Disclosure
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Status Page
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; 2024 PhishGuard. All rights reserved. Built with advanced machine learning for cybersecurity.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
