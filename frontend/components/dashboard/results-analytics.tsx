"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, TrendingUp, Zap } from "lucide-react"

type Candidate = {
  id: string
  name: string
  score: number
}

export function ResultsAnalytics({ results }: { results: Candidate[] }) {

  if (!results || results.length === 0) {
    return <p className="text-sm text-muted-foreground">No analytics data</p>
  }

  // 📊 calculations
  const total = results.length
  const avg =
    Math.round(results.reduce((sum, r) => sum + r.score, 0) / total)

  const topScore = Math.max(...results.map((r) => r.score))

  const highScorers = results.filter((r) => r.score >= 70).length

  const topCandidates = [...results]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="space-y-6">

      {/* 🔥 Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <Target className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{avg}</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <div>
              <p className="text-2xl font-bold">{highScorers}</p>
              <p className="text-sm text-muted-foreground">High Scorers (70+)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <Zap className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{topScore}</p>
              <p className="text-sm text-muted-foreground">Top Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🏆 Top Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Top Candidates</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          {topCandidates.map((c, index) => (
            <div
              key={c.id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <p className="text-xs text-muted-foreground mb-1">
                Rank #{index + 1}
              </p>

              <h3 className="text-lg font-semibold">{c.name}</h3>

              <p className="text-2xl font-bold mt-2">
                {c.score}/100
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 📊 Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>

        <CardContent className="flex items-end gap-3 h-40">
          {results.map((r) => (
            <div
              key={r.id}
              className="flex-1 bg-blue-500 rounded-t"
              style={{ height: `${r.score}%` }}
              title={r.name}
            />
          ))}
        </CardContent>
      </Card>

    </div>
  )
}