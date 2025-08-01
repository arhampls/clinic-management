"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: any
  onSave: (data: any) => void
}

export function EditPatientDialog({ open, onOpenChange, patient, onSave }: EditPatientDialogProps) {
  const [formData, setFormData] = useState(patient || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Helper to format date to dd-mm-yyyy
  function formatDateToDDMMYYYY(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Helper to convert dd-mm-yyyy to yyyy-mm-dd for input type="date"
  function toInputDateFormat(ddmmyyyy: string) {
    if (!ddmmyyyy) return "";
    if (ddmmyyyy.includes("-")) {
      const parts = ddmmyyyy.split("-");
      if (parts.length === 3 && parts[2].length === 4) {
        // dd-mm-yyyy
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return ddmmyyyy;
  }

  // Update formData when patient changes, and auto-format dateOfBirth
  React.useEffect(() => {
    if (patient) {
      let dob = patient.dateOfBirth || "";
      // If already dd-mm-yyyy, convert to yyyy-mm-dd for input
      if (dob && dob.includes("-")) {
        const parts = dob.split("-");
        if (parts[2] && parts[2].length === 4) {
          dob = toInputDateFormat(dob);
        }
      }
      setFormData({ ...patient, dateOfBirth: dob });
    } else {
      setFormData({});
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await onSave(formData)
      setSuccess("Patient updated!")
      setTimeout(() => {
        setSuccess("")
        onOpenChange(false)
      }, 1000)
    } catch {
      setError("Failed to update patient")
    } finally {
      setLoading(false)
    }
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>Update patient information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName || ""}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth ? toInputDateFormat(formData.dateOfBirth) : ""}
                onChange={e => {
                  // Store as dd-mm-yyyy
                  const val = e.target.value;
                  if (val && val.includes("-")) {
                    const [yyyy, mm, dd] = val.split("-");
                    setFormData({ ...formData, dateOfBirth: `${dd}-${mm}-${yyyy}` });
                  } else {
                    setFormData({ ...formData, dateOfBirth: val });
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={formData.gender || ""}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="condition">Condition / Medication</Label>
              <Textarea
                id="condition"
                value={formData.condition || ""}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                rows={2}
                className="font-mono"
                style={{ whiteSpace: 'pre-wrap' }}
              />

            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName || ""}
                onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
              <Input
                id="emergencyContactNumber"
                value={formData.emergencyContactNumber || ""}
                onChange={e => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="font-mono"
                style={{ whiteSpace: 'pre-wrap' }}
              />

            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
