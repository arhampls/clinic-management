"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Activity, LayoutDashboard, Users, Calendar, Settings, LogOut, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "./footer"
import { EditClinicProfileDialog } from "./edit-clinic-profile-dialog"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patient Records", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Equipment Audit", href: "/equipment", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [clinicName, setClinicName] = useState<string>("")
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/clinic/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.clinic) setClinicName(data.clinic.name)
        })
    }
  }, [profileOpen])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login?message=Please%20log%20in%20again")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EditClinicProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{clinicName || "Clinic"}</span>
              <Button size="icon" variant="ghost" aria-label="Edit clinic profile" onClick={() => setProfileOpen(true)}>
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
