"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Calendar, MapPin, Hash, Building } from "lucide-react"

interface EquipmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: any
}

export function EquipmentDetailsDialog({ open, onOpenChange, equipment }: EquipmentDetailsDialogProps) {
  if (!equipment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-green-100 text-green-800"
      case "Maintenance Required":
        return "bg-yellow-100 text-yellow-800"
      case "Under Maintenance":
        return "bg-orange-100 text-orange-800"
      case "Retired":
        return "bg-red-100 text-red-800"
      case "Not Possible":
        return "bg-gray-300 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Equipment Details</DialogTitle>
          <DialogDescription>Complete information about this equipment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Equipment Name</p>
              <p className="text-sm text-gray-600">{equipment.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Model & Manufacturer</p>
              <p className="text-sm text-gray-600">{equipment.model}</p>
              <p className="text-xs text-gray-500">{equipment.manufacturer}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Serial Number</p>
              <p className="text-sm text-gray-600">{equipment.serialNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-gray-600">{equipment.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Status</p>
              <Badge className={getStatusColor(equipment.status)}>{equipment.status}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Purchase Date</p>
              <p className="text-sm text-gray-600">{equipment.purchaseDate ? (isNaN(Date.parse(equipment.purchaseDate)) ? equipment.purchaseDate : new Date(equipment.purchaseDate).toLocaleDateString()) : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Warranty Expiry</p>
              <p className="text-sm text-gray-600">{equipment.warrantyExpiry ? (isNaN(Date.parse(equipment.warrantyExpiry)) ? equipment.warrantyExpiry : new Date(equipment.warrantyExpiry).toLocaleDateString()) : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Maintenance Interval</p>
              <p className="text-sm text-gray-600">{equipment.maintenanceInterval ? (isNaN(Number(equipment.maintenanceInterval)) ? equipment.maintenanceInterval : `${equipment.maintenanceInterval} days`) : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Last Maintenance</p>
              <p className="text-sm text-gray-600">{equipment.lastMaintenance ? (isNaN(Date.parse(equipment.lastMaintenance)) ? equipment.lastMaintenance : new Date(equipment.lastMaintenance).toLocaleDateString()) : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Next Maintenance</p>
              <p className="text-sm text-gray-600">{equipment.nextMaintenance ? (isNaN(Date.parse(equipment.nextMaintenance)) ? equipment.nextMaintenance : new Date(equipment.nextMaintenance).toLocaleDateString()) : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Notes</p>
              <p className="text-sm text-gray-600">{equipment.notes || '-'}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
