"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditClinicProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditClinicProfileDialog({ open, onOpenChange }: EditClinicProfileDialogProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (open) {
      setError("")
      setSuccess("")
      setLoading(true)
      const token = localStorage.getItem("token")
      fetch("/api/clinic/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.clinic) setName(data.clinic.name)
          else setError(data.error || "Failed to load clinic profile")
        })
        .catch(() => setError("Failed to load clinic profile"))
        .finally(() => setLoading(false))
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!name.trim()) {
      setError("Clinic name is required.")
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/clinic/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to update clinic profile")
      } else {
        setSuccess("Profile updated!")
        setTimeout(() => {
          setSuccess("")
          onOpenChange(false)
        }, 1000)
      }
    } catch {
      setError("Failed to update clinic profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Clinic Profile</DialogTitle>
          <DialogDescription>Update your clinic's name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic-name">Clinic Name</Label>
            <Input
              id="clinic-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
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
