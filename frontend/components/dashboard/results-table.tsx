"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Trophy, Medal, Award, FileText, Star } from "lucide-react"

export interface CandidateResult {
  id: string
  name: string
  score: number
  rank: number
  fileName: string
}

interface ResultsTableProps {
  results: CandidateResult[]
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600"
  if (score >= 70) return "text-primary"
  if (score >= 50) return "text-amber-600"
  return "text-muted-foreground"
}

function getScoreBg(score: number): string {
  if (score >= 85) return "bg-emerald-50 ring-emerald-100"
  if (score >= 70) return "bg-primary/5 ring-primary/10"
  if (score >= 50) return "bg-amber-50 ring-amber-100"
  return "bg-muted ring-border"
}

function getRankDisplay(rank: number) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 shadow-sm shadow-amber-200/50">
          <Trophy className="h-4 w-4 text-amber-600" />
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-amber-600">Top Pick</span>
        </div>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 shadow-sm">
        <Medal className="h-4 w-4 text-slate-500" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 shadow-sm shadow-orange-200/50">
        <Award className="h-4 w-4 text-orange-500" />
      </div>
    )
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-sm font-medium text-muted-foreground">
      {rank}
    </div>
  )
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <FileText className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="mt-5 text-sm font-medium text-foreground">No results yet</p>
        <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
          Upload resumes and add a job description to see candidate rankings
        </p>
      </div>
    )
  }

  // Highlight the top candidate
  const topCandidate = results[0]

  return (
    <div className="space-y-4">
      {/* Top Candidate Highlight */}
      {topCandidate && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5 ring-1 ring-primary/20">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 shadow-lg shadow-primary/20">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-primary/70">Top Candidate</p>
                <p className="text-lg font-semibold text-foreground">{topCandidate.name}</p>
                <p className="text-xs text-muted-foreground">{topCandidate.fileName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("inline-flex items-baseline gap-0.5 rounded-xl px-4 py-2 ring-1", getScoreBg(topCandidate.score))}>
                <span className={cn("text-3xl font-bold", getScoreColor(topCandidate.score))}>
                  {topCandidate.score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Rank</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Candidate</TableHead>
              <TableHead className="w-[120px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow 
                key={result.id} 
                className={cn(
                  "transition-colors",
                  index === 0 && "bg-primary/[0.02]"
                )}
              >
                <TableCell className="py-4">{getRankDisplay(result.rank)}</TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
                      {result.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.fileName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className={cn("inline-flex items-baseline gap-0.5 rounded-lg px-3 py-1.5 ring-1", getScoreBg(result.score))}>
                    <span className={cn("text-lg font-bold", getScoreColor(result.score))}>
                      {result.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
