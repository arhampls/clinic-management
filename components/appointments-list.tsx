
"use client"

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

import React, { useState } from "react"

type Appointment = {
  id: number;
  patientId?: string;
  patient?: any;
  time?: string;
  doctor?: string;
  type?: string;
  status?: string;
  date?: string;
  timeSlot?: string;
  notes?: string;
};
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock } from "lucide-react"
import { AddAppointmentDialog } from "./add-appointment-dialog"
import { RescheduleDialog } from "./reschedule-dialog"
import { EditAppointmentDialog } from "./edit-appointment-dialog"
import { AppointmentDetailsDialog } from "./appointment-details-dialog"

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  React.useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const res = await fetch("/api/clinic/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to fetch appointments")
        } else {
          setAppointments(data.appointments)
        }
      } catch {
        setError("Failed to fetch appointments")
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const handleAddAppointment = async (appointmentData: any) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      // Convert dd-mm-yyyy to yyyy-mm-dd for API
      let apiDate = appointmentData.date;
      if (/^\d{2}-\d{2}-\d{4}$/.test(apiDate)) {
        const [dd, mm, yyyy] = apiDate.split('-');
        apiDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      }
      const payload = { ...appointmentData, date: apiDate };
      // POST to API
      const res = await fetch("/api/clinic/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to schedule appointment");
      } else {
        // Refetch appointments from backend
        const res2 = await fetch("/api/clinic/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data2 = await res2.json();
        if (res2.ok) {
          setAppointments(data2.appointments);
        }
      }
    } catch {
      setError("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  }

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowEditDialog(true)
  }
  const handleEditAppointment = async (updatedData: any) => {
    if (!selectedAppointment) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      // Convert dd-mm-yyyy to yyyy-mm-dd for API
      let apiDate = updatedData.date;
      if (/^\d{2}-\d{2}-\d{4}$/.test(apiDate)) {
        const [dd, mm, yyyy] = apiDate.split('-');
        apiDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      }
      const payload = { ...updatedData, date: apiDate };
      // PATCH or PUT to API (assuming PATCH endpoint exists)
      const res = await fetch(`/api/clinic/appointments/${selectedAppointment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update appointment");
      } else {
        // Refetch appointments from backend
        const res2 = await fetch("/api/clinic/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data2 = await res2.json();
        if (res2.ok) {
          setAppointments(data2.appointments);
        }
      }
    } catch {
      setError("Failed to update appointment");
    } finally {
      setLoading(false);
      setShowEditDialog(false);
      setSelectedAppointment(null);
    }
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowDetailsDialog(true)
  }

  const handleRescheduleSubmit = (newDate: string, newTime: string) => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, date: newDate, timeSlot: newTime, time: `${newDate} at ${newTime}` }
          : apt,
      )
      setAppointments(updatedAppointments)
    }
    setShowRescheduleDialog(false)
    setSelectedAppointment(null)
  }

  const handleRemoveAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }
      const res = await fetch(`/api/clinic/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete appointment");
        return;
      }
      setAppointments(appointments.filter((apt) => apt.id !== id));
    } catch {
      setError("Failed to delete appointment");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Appointments</h1>
          <p className="text-gray-600">View and manage scheduled appointments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {appointments
            .filter((appointment) => {
              // Only show appointments that are not more than 15 minutes past their scheduled time
              if (!appointment.date) return false;
              const aptDate = new Date(appointment.date);
              // Add 15 minutes to the scheduled time
              const hideAfter = new Date(aptDate.getTime() + 15 * 60 * 1000);
              return hideAfter >= new Date();
            })
            .map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patientId || "No Name"}</h3>
                      <div className="text-sm text-gray-600">
                        {formatDate(appointment.date || "")} {appointment.timeSlot ? `at ${appointment.timeSlot}` : ""}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {appointment.type || "Appointment"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveAppointment(appointment.id)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <AddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddAppointment={handleAddAppointment}
      />


      <EditAppointmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        appointment={selectedAppointment}
        onSave={handleEditAppointment}
      />

      <AppointmentDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        appointment={selectedAppointment}
      />
    </div>
  )
}
