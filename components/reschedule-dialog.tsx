"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
  onReschedule: (date: string, time: string) => void
}

export function RescheduleDialog({ open, onOpenChange, appointment, onReschedule }: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  useEffect(() => {
    if (appointment) {
      setNewDate(appointment.date || "")
      setNewTime(appointment.timeSlot || "")
    }
  }, [appointment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Parse dd-mm-yyyy to ISO
    let isoDate = newDate
    if (newDate && newDate.includes('-')) {
      const [day, month, year] = newDate.split('-')
      isoDate = `${year}-${month}-${day}`
    }
    onReschedule(isoDate, newTime)
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>Update the date and time for {appointment.patient}'s appointment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Current Appointment</h4>
              <p className="text-sm text-gray-600">Patient: {appointment.patient}</p>
              <p className="text-sm text-gray-600">Doctor: {appointment.doctor}</p>
              <p className="text-sm text-gray-600">Type: {appointment.type}</p>
              <p className="text-sm text-gray-600">Current Time: {appointment.time}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newDate">New Date</Label>
              <Input id="newDate" type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="dd-mm-yyyy" pattern="^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newTime">New Time</Label>
              <Input id="newTime" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Reschedule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
