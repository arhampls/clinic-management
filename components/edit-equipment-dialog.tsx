"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Equipment, EquipmentFormData } from "@/types/equipment"

interface EditEquipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: Equipment
  onUpdateEquipment: (equipmentData: EquipmentFormData) => void
}

export function EditEquipmentDialog({ open, onOpenChange, equipment, onUpdateEquipment }: EditEquipmentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    manufacturer: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    status: "",
    location: "",
    maintenanceInterval: "90",
    notes: "",
    customMaintenanceDays: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (equipment) {
      let interval = equipment.maintenanceInterval || "90";
      let custom = "";
      // If not a standard value, treat as custom
      if (!["30","60","90","180","365"].includes(interval)) {
        custom = interval;
        interval = "custom";
      }
      setFormData({
        name: equipment.name || "",
        model: equipment.model || "",
        manufacturer: equipment.manufacturer || "",
        serialNumber: equipment.serialNumber || "",
        purchaseDate: equipment.purchaseDate || "",
        warrantyExpiry: equipment.warrantyExpiry || "",
        status: equipment.status || "",
        location: equipment.location || "",
        maintenanceInterval: interval,
        notes: equipment.notes || "",
        customMaintenanceDays: custom
      })
    }
  }, [equipment])

  const validate = () => {
    if (!formData.name.trim()) return "Equipment name is required."
    if (!formData.model.trim()) return "Model is required."
    if (!formData.manufacturer.trim()) return "Manufacturer is required."
    if (!formData.serialNumber.trim()) return "Serial number is required."
    if (!formData.status) return "Status is required."
    if (!formData.location.trim()) return "Location is required."
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
    setIsLoading(true)
    try {
      let saveData = { ...equipment, ...formData };
      if (formData.maintenanceInterval === "custom" && formData.customMaintenanceDays) {
        saveData.maintenanceInterval = formData.customMaintenanceDays;
      } else if (formData.maintenanceInterval !== "custom") {
        saveData.maintenanceInterval = formData.maintenanceInterval;
      }
      await onUpdateEquipment(saveData)
      setSuccess("Equipment updated successfully!")
      setTimeout(() => {
        setSuccess("")
        onOpenChange(false)
      }, 1000)
    } catch (err) {
      setError("Failed to update equipment.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>Update equipment information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Maintenance Required">Maintenance Required</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Not Possible">Not Possible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceInterval">Maintenance Gap</Label>
              <Select value={formData.maintenanceInterval} onValueChange={(value) => setFormData({ ...formData, maintenanceInterval: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">365 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {formData.maintenanceInterval === "custom" && (
                <Input
                  id="custom-maintenance"
                  type="number"
                  min={1}
                  placeholder="Enter days (e.g. 117)"
                  value={formData.customMaintenanceDays || ""}
                  onChange={e => setFormData({ ...formData, customMaintenanceDays: e.target.value })}
                  className="mt-2"
                  required
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={e => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about the equipment"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
