"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
  onSave: (data: any) => void
}

export function EditAppointmentDialog({ open, onOpenChange, appointment, onSave }: EditAppointmentDialogProps) {
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (appointment) {
      // Normalize date to yyyy-mm-dd for input type="date"
      let inputDate = "";
      if (appointment.date) {
        if (/^\d{2}-\d{2}-\d{4}$/.test(appointment.date)) {
          // dd-mm-yyyy
          const [dd, mm, yyyy] = appointment.date.split('-');
          inputDate = `${yyyy}-${mm}-${dd}`;
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(appointment.date)) {
          // yyyy-mm-dd
          inputDate = appointment.date;
        } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(appointment.date)) {
          // mm/dd/yyyy
          const [mm, dd, yyyy] = appointment.date.split('/');
          inputDate = `${yyyy}-${mm}-${dd}`;
        } else {
          // Try to parse
          const d = new Date(appointment.date);
          if (!isNaN(d.getTime())) {
            inputDate = d.toISOString().slice(0, 10);
          }
        }
      }
      // Normalize time to HH:mm
      let inputTime = appointment.timeSlot || appointment.time || "";
      if (!inputTime && appointment.date) {
        // Extract time from ISO string or Date object
        let d = new Date(appointment.date);
        if (!isNaN(d.getTime())) {
          inputTime = d.toISOString().slice(11, 16); // HH:mm
        } else if (typeof appointment.date === 'string') {
          // Try to extract time from string (e.g. 2024-06-09T14:30:00.000Z)
          const match = appointment.date.match(/T(\d{2}:\d{2})/);
          if (match) inputTime = match[1];
        }
      }
      if (inputTime && inputTime.length > 5) {
        // e.g. 14:00:00 -> 14:00
        inputTime = inputTime.slice(0, 5);
      }
      setFormData({
        patientId: appointment.patientId || appointment.patient || "",
        doctorId: appointment.doctor || "",
        date: inputDate,
        time: inputTime,
        type: appointment.type || "",
        notes: appointment.notes || "",
      })
    }
  }, [appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await onSave(formData)
      setSuccess("Appointment updated!")
      setTimeout(() => {
        setSuccess("")
        onOpenChange(false)
      }, 1000)
    } catch {
      setError("Failed to update appointment")
    } finally {
      setLoading(false)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update appointment information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <Input
              id="patientId"
              value={formData.patientId}
              onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor</Label>
            <Input
              id="doctorId"
              value={formData.doctorId}
              onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date ? (() => {
                  // Convert dd-mm-yyyy to yyyy-mm-dd for input
                  if (/^\d{2}-\d{2}-\d{4}$/.test(formData.date)) {
                    const [dd, mm, yyyy] = formData.date.split('-');
                    return `${yyyy}-${mm}-${dd}`;
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
