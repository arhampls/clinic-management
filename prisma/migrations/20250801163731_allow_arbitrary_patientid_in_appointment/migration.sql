-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN "location" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "maintenanceInterval" TEXT DEFAULT '90';
ALTER TABLE "Equipment" ADD COLUMN "manufacturer" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "model" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "notes" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "purchaseDate" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "serialNumber" TEXT;
ALTER TABLE "Equipment" ADD COLUMN "warrantyExpiry" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT,
    "notes" TEXT,
    "doctor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("clinicId", "createdAt", "date", "id", "patientId") SELECT "clinicId", "createdAt", "date", "id", "patientId" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
