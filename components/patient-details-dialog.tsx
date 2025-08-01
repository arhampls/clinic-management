"use client"


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function formatDateLong(dateStr: string) {
  if (!dateStr) return "";
  // Accepts dd-mm-yyyy, yyyy-mm-dd, mm/dd/yyyy, etc.
  let day, month, year;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    // dd-mm-yyyy
    [day, month, year] = dateStr.split('-');
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // yyyy-mm-dd
    [year, month, day] = dateStr.split('-');
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // mm/dd/yyyy
    [month, day, year] = dateStr.split('/');
  } else {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    day = String(d.getDate()).padStart(2, '0');
    month = String(d.getMonth() + 1).padStart(2, '0');
    year = d.getFullYear();
  }
  // Convert to long format
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
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

interface PatientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: any
}

export function PatientDetailsDialog({ open, onOpenChange, patient }: PatientDetailsDialogProps) {
  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Complete information about this patient</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Name</p>
            <p className="text-sm text-gray-600">{[patient.firstName, patient.lastName].filter(Boolean).join(' ') || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-600">{patient.phone || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Date of Birth</p>
            <p className="text-sm text-gray-600">{formatDateLong(patient.dateOfBirth) || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Gender</p>
            <p className="text-sm text-gray-600">{patient.gender || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Condition / Medication</p>
            {patient.condition ? (
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{patient.condition}</pre>
            ) : (
              <span className="text-sm text-gray-600">-</span>
            )}
          </div>
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-gray-600">{patient.address || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Emergency Contact Name</p>
            <p className="text-sm text-gray-600">{patient.emergencyContactName || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Emergency Contact Number</p>
            <p className="text-sm text-gray-600">{patient.emergencyContactNumber || '-'}</p>
          </div>
          <div>
            <p className="font-medium">Notes</p>
            {patient.notes ? (
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{patient.notes}</pre>
            ) : (
              <span className="text-sm text-gray-600">-</span>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
