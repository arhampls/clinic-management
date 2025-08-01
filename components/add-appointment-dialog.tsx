"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


interface AddAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAppointment: (appointmentData: any) => void
}

export function AddAppointmentDialog({ open, onOpenChange, onAddAppointment }: AddAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })
  // Doctor is now a free text field
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validate = () => {
    if (!formData.patientId.trim()) return "Patient is required."
    if (!formData.doctorId.trim()) return "Doctor is required."
    if (!formData.date) return "Date is required."
    if (!formData.time) return "Time is required."
    if (!formData.type.trim()) return "Appointment type is required."
    // Parse dd-mm-yyyy to ISO
    const [day, month, year] = formData.date.split('-')
    const isoDate = `${year}-${month}-${day}`
    const appointmentDateTime = new Date(`${isoDate}T${formData.time}`)
    if (isNaN(appointmentDateTime.getTime())) return "Invalid date or time."
    if (appointmentDateTime < new Date()) return "Cannot schedule appointment in the past."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      await onAddAppointment(formData)
      setSuccess("Appointment scheduled!")
      setFormData({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        type: "",
        notes: "",
      })
      setTimeout(() => {
        setSuccess("")
        onOpenChange(false)
      }, 1000)
    } catch (err: any) {
      setError(err?.message || "Failed to schedule appointment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>Create a new appointment for a patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <Input
              id="patientId"
              placeholder="Select patient"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor</Label>
            <Input
              id="doctorId"
              placeholder="Enter doctor name"
              value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block cursor-pointer w-full">
                <span>Date</span>
                <Input
                  id="date"
                  type="date"
                  className="w-full cursor-pointer"
                  value={formData.date ? (() => {
                    // Convert dd-mm-yyyy to yyyy-mm-dd for input
                    if (/^\d{2}-\d{2}-\d{4}$/.test(formData.date)) {
                      const [dd, mm, yyyy] = formData.date.split('-');
                      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
                    }
                    return formData.date;
                  })() : ""}
                  onChange={e => {
                    // Store as dd-mm-yyyy
                    const val = e.target.value;
                    if (val && val.includes("-")) {
                      const [yyyy, mm, dd] = val.split("-");
                      setFormData({ ...formData, date: `${dd}-${mm}-${yyyy}` });
                    } else {
                      setFormData({ ...formData, date: val });
                    }
                  }}
                  required
                />
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="block cursor-pointer w-full">
                <span>Time</span>
                <Input
                  id="time"
                  type="time"
                  className="w-full cursor-pointer"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Input
              id="type"
              placeholder="Select type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or instructions"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{loading ? "Scheduling..." : "Schedule Appointment"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
