import { DashboardLayout } from "@/components/dashboard-layout"
import { PatientsList } from "@/components/patients-list"

export default function PatientsPage() {
  return (
    <DashboardLayout>
      <PatientsList />
    </DashboardLayout>
  )
}
