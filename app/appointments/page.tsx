import { DashboardLayout } from "@/components/dashboard-layout"
import { AppointmentsList } from "@/components/appointments-list"

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsList />
    </DashboardLayout>
  )
}
