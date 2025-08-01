"use client"


function formatDateLong(dateStr: string) {
  if (!dateStr) return "";
  let day, month, year;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    [day, month, year] = dateStr.split('-');
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    [year, month, day] = dateStr.split('-');
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    [month, day, year] = dateStr.split('/');
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    day = String(d.getDate()).padStart(2, '0');
    month = String(d.getMonth() + 1).padStart(2, '0');
    year = d.getFullYear();
  }
  const dayNum = parseInt(String(day), 10);
  const monthNum = parseInt(String(month), 10);
  const yearNum = parseInt(String(year), 10);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${dayNum}${getOrdinal(dayNum)} ${monthNames[monthNum - 1]}, ${yearNum}`;
}

import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, AlertTriangle, Settings } from "lucide-react"


export default function DashboardPage() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, equipment: 0, upcomingAppointments: [], equipmentNeedingMaintenance: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const res = await fetch("/api/clinic/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) {
          localStorage.removeItem("token")
          window.location.href = "/login?message=Please%20log%20in%20again"
          return
        }
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to fetch stats")
        } else {
          // Compute total appointments and equipment for cards
          setStats({
            patients: data.patients ?? 0,
            appointments: Array.isArray(data.upcomingAppointments) ? data.upcomingAppointments.length : 0,
            equipment: typeof data.totalEquipment === 'number' ? data.totalEquipment : 0,
            upcomingAppointments: data.upcomingAppointments ?? [],
            equipmentNeedingMaintenance: data.equipmentNeedingMaintenance ?? []
          })
        }
      } catch {
        setError("Failed to fetch stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of clinic operations and key metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.patients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.appointments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Equipment</CardTitle>
              <Settings className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.equipment}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments & Equipment Needing Maintenance Side by Side */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : stats.upcomingAppointments.length === 0 ? (
                <div className="text-gray-500">No upcoming appointments.</div>
              ) : (
                stats.upcomingAppointments.map((apt: any) => (
                  <div key={apt.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      <span className="font-medium">{apt.patientId || apt.patient?.name || "No Name"}</span> - {formatDateLong(apt.date)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Equipment Needing Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : stats.equipmentNeedingMaintenance.length === 0 ? (
                <div className="text-gray-500">No equipment needs maintenance.</div>
              ) : (
                stats.equipmentNeedingMaintenance.map((eq: any) => (
                  <div key={eq.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{eq.name} - {eq.status}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </DashboardLayout>
  )
}
