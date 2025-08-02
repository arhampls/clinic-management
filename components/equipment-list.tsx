"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus } from "lucide-react"
import { AddEquipmentDialog } from "./add-equipment-dialog"
import { EquipmentDetailsDialog } from "./equipment-details-dialog"
import { EditEquipmentDialog } from "./edit-equipment-dialog"

const EquipmentList = () => {
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  React.useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const res = await fetch("/api/clinic/equipment", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to fetch equipment")
        } else {
          setEquipment(data.equipment)
        }
      } catch {
        setError("Failed to fetch equipment")
      } finally {
        setLoading(false)
      }
    }
    fetchEquipment()
  }, [])

  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

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

  const handleAddEquipment = async (equipmentData: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }
      const res = await fetch("/api/clinic/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add equipment");
        return;
      }
      // Refetch equipment from backend
      const res2 = await fetch("/api/clinic/equipment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data2 = await res2.json();
      if (res2.ok) {
        setEquipment(data2.equipment);
      }
    } catch {
      setError("Failed to add equipment");
    }
  }

  const handleViewDetails = (item: any) => {
    setSelectedEquipment(item)
    setShowDetailsDialog(true)
  }

  const handleEditEquipment = (item: any) => {
    setSelectedEquipment(item)
    setShowEditDialog(true)
  }

  const handleUpdateEquipment = (updatedEquipment: any) => {
    setEquipment(equipment.map((item) => (item.id === updatedEquipment.id ? updatedEquipment : item)))
  }

  const handleRemoveEquipment = async (id: number) => {
    if (confirm("Are you sure you want to remove this equipment?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          return;
        }
        const res = await fetch(`/api/clinic/equipment?id=${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to remove equipment");
          return;
        }
        setEquipment(equipment.filter((item) => item.id !== id));
      } catch {
        setError("Failed to remove equipment");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Audit</h1>
          <p className="text-gray-600">Monitor equipment status and maintenance schedules</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {loading ? (
        <div>Loading equipment...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {equipment.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="mt-1">
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditEquipment(item)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveEquipment(item.id)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddEquipmentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddEquipment={handleAddEquipment} />

      {selectedEquipment && (
        <EquipmentDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          equipment={selectedEquipment}
        />
      )}

      {selectedEquipment && (
        <EditEquipmentDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          equipment={selectedEquipment}
          onUpdateEquipment={handleUpdateEquipment}
        />
      )}
    </div>
  )
}

export { EquipmentList }
