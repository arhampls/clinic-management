"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { AddPatientDialog } from "./add-patient-dialog"
import { PatientDetailsDialog } from "./patient-details-dialog"
import { EditPatientDialog } from "./edit-patient-dialog"

export function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  // Helper to map patient DB object to dialog fields
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  const mapPatientToDialogFields = (patient: any) => {
    // Split name into first/last name if possible
    let firstName = "", lastName = ""
    if (patient.name) {
      const parts = patient.name.split(" ")
      firstName = parts[0] || ""
      lastName = parts.slice(1).join(" ") || ""
    }
    return {
      ...patient,
      firstName,
      lastName,
      dateOfBirth: formatDate(patient.dateOfBirth),
    }
  }

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(mapPatientToDialogFields(patient))
    setShowDetailsDialog(true)
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(mapPatientToDialogFields(patient))
    setShowEditDialog(true)
  }

  const handleRemovePatient = async (patientId: string) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/clinic/patients?id=${patientId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to remove patient")
      setPatients(patients.filter((p) => p.id !== patientId))
    } catch (err: any) {
      setError(err.message || "Failed to remove patient")
    }
  }

  const handleSaveEdit = async (updatedData: any) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/clinic/patients?id=${selectedPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })
      if (!res.ok) throw new Error("Failed to update patient")
      // Refetch patients
      const refetch = await fetch("/api/clinic/patients", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const refetchData = await refetch.json()
      setPatients(refetchData.patients)
      setShowEditDialog(false)
    } catch (err: any) {
      setError(err.message || "Failed to update patient")
    }
  }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  React.useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const res = await fetch("/api/clinic/patients", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Failed to fetch patients")
        } else {
          setPatients(data.patients)
        }
      } catch {
        setError("Failed to fetch patients")
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800"
      case "Follow-up":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddPatient = async (patientData: any) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/clinic/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add patient")
      // Refetch patients after add
      const refetch = await fetch("/api/clinic/patients", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const refetchData = await refetch.json()
      setPatients(refetchData.patients)
    } catch (err: any) {
      setError(err.message || "Failed to add patient")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <p className="text-gray-600">Manage patient information and medical history</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div>Loading patients...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {patients
            .filter((patient) =>
              patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((patient) => (
              <Card key={patient.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700">
                      {patient.name?.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(patient)}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemovePatient(patient.id)}>
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <AddPatientDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddPatient={handleAddPatient} />
      <PatientDetailsDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog} patient={selectedPatient} />
      <EditPatientDialog open={showEditDialog} onOpenChange={setShowEditDialog} patient={selectedPatient} onSave={handleSaveEdit} />
    </div>
  )
}
