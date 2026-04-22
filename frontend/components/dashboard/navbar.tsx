"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onMenuClick?: () => void
  userName?: string
  userEmail?: string
}

export function DashboardNavbar({ onMenuClick, userName = "John Doe", userEmail = "john@example.com" }: NavbarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Resume Screening</h1>
          <p className="text-xs text-muted-foreground">AI-powered candidate evaluation</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search (hidden on mobile) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="h-9 w-56 rounded-lg border border-border/50 bg-muted/30 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>

        <div className="ml-2 h-8 w-px bg-border/50" />

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-[11px] text-muted-foreground">{userEmail}</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
