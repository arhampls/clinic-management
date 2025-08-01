export interface Equipment {
  id: string
  name: string
  model: string | null
  manufacturer: string | null
  serialNumber: string | null
  purchaseDate: string | null
  warrantyExpiry: string | null
  status: string
  location: string | null
  maintenanceInterval: string | null
  notes: string | null
  clinicId: string
  createdAt: Date
}

export interface EquipmentFormData {
  name: string
  model: string
  manufacturer: string
  serialNumber: string
  purchaseDate: string
  warrantyExpiry: string
  status: string
  location: string
  maintenanceInterval: string
  notes: string
}
