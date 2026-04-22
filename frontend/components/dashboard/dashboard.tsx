"use client"

import { useState } from "react"
import { DashboardSidebar } from "./sidebar"
import { DashboardNavbar } from "./navbar"
import { FileUpload } from "./file-upload"
import { ResultsTable, type CandidateResult } from "./results-table"
import { ResultsAnalytics } from "./results-analytics"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { FileText, Users, TrendingUp } from "lucide-react"

const API_BASE = "http://127.0.0.1:5000"

export function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [files, setFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<CandidateResult[]>([])
  const [uploaded, setUploaded] = useState(false)

  // ✅ Upload files (only once)
  const uploadFiles = async () => {
    if (uploaded) return

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch(`${API_BASE}/api/resumes`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          console.error("Upload failed")
        }
      } catch (err) {
        console.error("Upload error:", err)
      }
    }

    setUploaded(true)
  }

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      alert("Enter job description")
      return
    }

    if (files.length === 0) {
      alert("Upload at least one resume")
      return
    }

    setIsProcessing(true)

    try {
      await uploadFiles()

      const res = await fetch(`${API_BASE}/api/rank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error("Backend error:", errText)
        alert("Ranking failed")
        setIsProcessing(false)
        return
      }

      const data = await res.json()

      const formatted = (data.results || []).map((item: any, index: number) => ({
        id: String(item.id || index),
        name: item.filename || "Unknown",
        score: Math.round((item.score || 0) * 100),
        rank: index + 1,
        fileName: item.filename || "Unknown",
      }))

      setResults(formatted)

    } catch (err) {
      console.error("Error:", err)
      alert("Something went wrong")
    }

    setIsProcessing(false)
  }

  const stats = [
    { label: "Resumes Uploaded", value: files.length, icon: FileText },
    { label: "Candidates Ranked", value: results.length, icon: Users },
    { label: "Top Score", value: results.length > 0 ? results[0].score : "-", icon: TrendingUp },
  ]

  return (
    <div className="flex h-screen bg-background">

      {/* Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          onLogout={() => {}}
        />
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => {}} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-6">

            {/* ================= DASHBOARD ================= */}
            {activeItem === "dashboard" && (
              <>
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <Card key={stat.label}>
                        <CardContent className="flex items-center gap-4 py-5">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                  {/* Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Resumes</CardTitle>
                      <CardDescription>Select candidate resumes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload files={files} onFilesChange={setFiles} />
                    </CardContent>
                  </Card>

                  {/* Job Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                      <CardDescription>Paste job requirements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <textarea
                        placeholder="Enter job description..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full min-h-[150px] border rounded-lg p-3"
                      />

                      <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Rank Candidates"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isProcessing ? (
                      <Spinner />
                    ) : results.length > 0 ? (
                      <ResultsTable results={results} />
                    ) : (
                      <p className="text-muted-foreground text-sm">No results yet</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* ================= ANALYTICS ================= */}
            {activeItem === "analytics" && (
              <ResultsAnalytics results={results} />
            )}

            {/* ================= UPLOAD PAGE ================= */}
            {activeItem === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resumes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}