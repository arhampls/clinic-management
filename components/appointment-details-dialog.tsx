"use client"


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Stethoscope, FileText } from "lucide-react"

function formatDateLong(dateStr: string) {
  if (!dateStr) return "";
  let day, month, year;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    [day, month, year] = dateStr.split('-');
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    [year, month, day] = dateStr.split('-');
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    [month, day, year] = dateStr.split('/');
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    day = String(d.getDate()).padStart(2, '0');
    month = String(d.getMonth() + 1).padStart(2, '0');
    year = d.getFullYear();
  }
  const dayNum = parseInt(String(day), 10);
  const monthNum = parseInt(String(month), 10);
  const yearNum = parseInt(String(year), 10);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${dayNum}${getOrdinal(dayNum)} ${monthNames[monthNum - 1]}, ${yearNum}`;
}

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
}

export function AppointmentDetailsDialog({ open, onOpenChange, appointment }: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  // Extract time (HH:mm) from appointment.date if timeSlot/time not present, then format to 12hr
  let time = appointment.timeSlot || appointment.time || "";
  if (!time && appointment.date) {
    let d = new Date(appointment.date);
    if (!isNaN(d.getTime())) {
      time = d.toISOString().slice(11, 16); // HH:mm
    } else if (typeof appointment.date === 'string') {
      const match = appointment.date.match(/T(\d{2}:\d{2})/);
      if (match) time = match[1];
    }
  }
  // Convert to 12hr format with AM/PM
  function format12hr(t: string) {
    if (!t) return "-";
    const [h, m] = t.split(":");
    let hour = parseInt(h, 10);
    const min = m || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${min} ${ampm}`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Patient</p>
              <p className="text-sm text-gray-600">{appointment.patientId || appointment.patient || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Doctor</p>
              <p className="text-sm text-gray-600">{appointment.doctor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-gray-600">{formatDateLong(appointment.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-sm text-gray-600">{format12hr(time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Appointment Type</p>
              <Badge variant="secondary">{appointment.type}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Notes</p>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Status</p>
              <Badge className="bg-green-100 text-green-800">{appointment.status}</Badge>
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
