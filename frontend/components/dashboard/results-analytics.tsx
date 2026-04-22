"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts"
import { Trophy, Medal, Award, TrendingUp, Users, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CandidateData {
  id: string
  name: string
  score: number
  rank: number
  skills: string[]
  experience: string
}

interface ResultsAnalyticsProps {
  candidates?: CandidateData[]
}

const defaultCandidates: CandidateData[] = [
  { id: "1", name: "Sarah Johnson", score: 92, rank: 1, skills: ["React", "TypeScript", "Node.js"], experience: "6 years" },
  { id: "2", name: "Michael Chen", score: 87, rank: 2, skills: ["Python", "AWS", "Docker"], experience: "5 years" },
  { id: "3", name: "Emily Davis", score: 78, rank: 3, skills: ["JavaScript", "Vue.js", "PostgreSQL"], experience: "4 years" },
  { id: "4", name: "James Wilson", score: 72, rank: 4, skills: ["Java", "Spring Boot", "Kubernetes"], experience: "7 years" },
  { id: "5", name: "Lisa Anderson", score: 65, rank: 5, skills: ["React", "GraphQL", "MongoDB"], experience: "3 years" },
  { id: "6", name: "David Martinez", score: 58, rank: 6, skills: ["Angular", "C#", ".NET"], experience: "4 years" },
  { id: "7", name: "Amanda Brown", score: 52, rank: 7, skills: ["PHP", "Laravel", "MySQL"], experience: "5 years" },
  { id: "8", name: "Robert Taylor", score: 45, rank: 8, skills: ["Ruby", "Rails", "Redis"], experience: "2 years" },
]

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function getScoreColor(score: number): string {
  if (score >= 85) return "hsl(142, 76%, 36%)" // emerald-600
  if (score >= 70) return "hsl(217, 91%, 60%)" // blue-500
  if (score >= 55) return "hsl(45, 93%, 47%)" // amber-500
  return "hsl(0, 72%, 51%)" // red-500
}

function getScoreTextColor(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400"
  if (score >= 70) return "text-blue-600 dark:text-blue-400"
  if (score >= 55) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

function getScoreBgColor(score: number): string {
  if (score >= 85) return "bg-emerald-100 dark:bg-emerald-900/30"
  if (score >= 70) return "bg-blue-100 dark:bg-blue-900/30"
  if (score >= 55) return "bg-amber-100 dark:bg-amber-900/30"
  return "bg-red-100 dark:bg-red-900/30"
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />
  return null
}

export function ResultsAnalytics({ candidates = defaultCandidates }: ResultsAnalyticsProps) {
  const topCandidates = candidates.slice(0, 3)
  const averageScore = Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)
  const highScoreCount = candidates.filter(c => c.score >= 70).length

  const chartData = candidates.map(c => ({
    name: c.name.split(" ")[0],
    score: c.score,
    fullName: c.name,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{candidates.length}</p>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{averageScore}</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{highScoreCount}</p>
              <p className="text-sm text-muted-foreground">High Scorers (70+)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{candidates[0]?.score || 0}</p>
              <p className="text-sm text-muted-foreground">Top Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Candidates Highlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Candidates
          </CardTitle>
          <CardDescription>
            The highest-ranking candidates based on job requirements match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {topCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-md",
                  index === 0 && "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/50 dark:to-orange-950/50",
                  index === 1 && "border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 dark:border-slate-700 dark:from-slate-900/50 dark:to-gray-900/50",
                  index === 2 && "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:border-orange-800 dark:from-orange-950/50 dark:to-amber-950/50"
                )}
              >
                <div className="absolute right-3 top-3">
                  {getRankIcon(candidate.rank)}
                </div>
                <div className="mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    index === 0 && "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200",
                    index === 1 && "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
                    index === 2 && "bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200"
                  )}>
                    Rank #{candidate.rank}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{candidate.experience} experience</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={cn("text-3xl font-bold", getScoreTextColor(candidate.score))}>
                    {candidate.score}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Score Distribution
          </CardTitle>
          <CardDescription>
            Visual comparison of candidate scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.payload.fullName}</span>
                        <span>Score: {value}/100</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Complete Rankings
          </CardTitle>
          <CardDescription>
            All candidates ranked by match score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Skills</TableHead>
                  <TableHead className="hidden sm:table-cell">Experience</TableHead>
                  <TableHead className="w-[120px] text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(candidate.rank)}
                        <span className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          candidate.rank === 1 && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
                          candidate.rank === 2 && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                          candidate.rank === 3 && "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
                          candidate.rank > 3 && "bg-muted text-muted-foreground"
                        )}>
                          {candidate.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{candidate.name}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{candidate.experience}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-bold",
                          getScoreBgColor(candidate.score),
                          getScoreTextColor(candidate.score)
                        )}>
                          {candidate.score}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
