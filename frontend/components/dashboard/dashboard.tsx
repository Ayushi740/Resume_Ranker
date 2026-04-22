"use client"

import { useState, useCallback } from "react"
import { DashboardSidebar } from "./sidebar"
import { DashboardNavbar } from "./navbar"
import { FileUpload } from "./file-upload"
import { ResultsTable, type CandidateResult } from "./results-table"
import { ResultsAnalytics } from "./results-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Sparkles, FileText, Users, TrendingUp, Zap } from "lucide-react"

// Mock data for demonstration
const mockResults: CandidateResult[] = [
  { id: "1", name: "Sarah Johnson", score: 92, rank: 1, fileName: "sarah_johnson_resume.pdf" },
  { id: "2", name: "Michael Chen", score: 87, rank: 2, fileName: "michael_chen_cv.pdf" },
  { id: "3", name: "Emily Davis", score: 78, rank: 3, fileName: "emily_davis_resume.docx" },
  { id: "4", name: "James Wilson", score: 65, rank: 4, fileName: "james_wilson_resume.pdf" },
  { id: "5", name: "Lisa Anderson", score: 54, rank: 5, fileName: "lisa_anderson_cv.pdf" },
]

export function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [files, setFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<CandidateResult[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (files.length === 0 || !jobDescription.trim()) return

    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setResults(mockResults)
    setIsProcessing(false)
  }, [files, jobDescription])

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...")
  }

  const stats = [
    { 
      label: "Resumes Uploaded", 
      value: files.length, 
      icon: FileText, 
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      label: "Candidates Ranked", 
      value: results.length, 
      icon: Users, 
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "Top Score", 
      value: results.length > 0 ? results[0].score : "-", 
      icon: TrendingUp, 
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl">
            <DashboardSidebar
              activeItem={activeItem}
              onItemClick={(item) => {
                setActiveItem(item)
                setMobileMenuOpen(false)
              }}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            {activeItem === "analytics" ? (
              <ResultsAnalytics />
            ) : (
            <>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="group py-5 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} transition-transform group-hover:scale-105`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload Section */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    Upload Resumes
                  </CardTitle>
                  <CardDescription>
                    Upload candidate resumes to analyze and rank them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the job requirements to match candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate should have strong problem-solving skills and experience with cloud services..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] w-full resize-none rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={files.length === 0 || !jobDescription.trim() || isProcessing}
                    className="w-full gap-2 rounded-xl py-6 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Spinner className="h-5 w-5" />
                        Analyzing Resumes...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Screen Candidates
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  Screening Results
                </CardTitle>
                <CardDescription>
                  Candidates ranked by match score based on job requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex min-h-[240px] flex-col items-center justify-center gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Spinner className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Analyzing resumes...</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                ) : (
                  <ResultsTable results={results} />
                )}
              </CardContent>
            </Card>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
