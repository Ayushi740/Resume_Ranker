"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, LogOut, BarChart3, Sparkles } from "lucide-react"

interface SidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
  onLogout: () => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Resume", icon: Upload },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

export function DashboardSidebar({ activeItem, onItemClick, onLogout }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar">
      {/* Logo Section */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25">
            <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-sidebar-foreground">ResumeAI</span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">Screening</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/30" 
                  : "bg-sidebar-accent/50 text-sidebar-foreground/60 group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {item.label}
            </button>
          )
        })}
      </nav>
      
      {/* Bottom Section */}
      <div className="p-3">
        <div className="mb-3 rounded-xl bg-sidebar-accent/30 p-4">
          <p className="text-xs font-medium text-sidebar-foreground/80">Pro Tip</p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/50">
            Upload multiple resumes at once for batch processing.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/30">
            <LogOut className="h-4 w-4" />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
