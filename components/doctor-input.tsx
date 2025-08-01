"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DoctorInputProps {
  value: string
  onChange: (value: string) => void
  doctors: string[]
  onAddDoctor: (doctor: string) => void
  onRemoveDoctor: (doctor: string) => void
}

export function DoctorInput({ value, onChange, doctors, onAddDoctor, onRemoveDoctor }: DoctorInputProps) {
  const [showDoctorList, setShowDoctorList] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null)

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim()
    if (inputValue && !doctors.includes(inputValue)) {
      onAddDoctor(inputValue)
    }
  }

  const handleDeleteDoctor = (doctor: string) => {
    setDoctorToDelete(doctor)
  }

  const confirmDelete = () => {
    if (doctorToDelete) {
      onRemoveDoctor(doctorToDelete)
      setDoctorToDelete(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Type doctor name..."
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          list="doctors"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => setShowDoctorList(!showDoctorList)}>
          Manage
        </Button>
      </div>

      <datalist id="doctors">
        {doctors.map((doctor) => (
          <option key={doctor} value={doctor} />
        ))}
      </datalist>

      {showDoctorList && (
        <div className="border rounded-md p-3 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Available Doctors:</h4>
          <div className="flex flex-wrap gap-2">
            {doctors.map((doctor) => (
              <Badge key={doctor} variant="secondary" className="flex items-center gap-1">
                {doctor}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => handleDeleteDoctor(doctor)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!doctorToDelete} onOpenChange={() => setDoctorToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {doctorToDelete} from the doctors list? This will not affect existing
              appointments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDoctorToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
