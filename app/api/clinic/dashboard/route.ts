import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    console.log('No auth header or not Bearer');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    console.log('Token:', token);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    console.log('Payload:', payload);
    const [patients, upcomingAppointments, equipmentNeedingMaintenance, totalEquipment] = await Promise.all([
      prisma.patient.count({ where: { clinicId: payload.clinicId } }),
      prisma.appointment.findMany({
        where: {
          clinicId: payload.clinicId,
          date: { gte: new Date() }
        },
        orderBy: { date: 'asc' },
        take: 5,
        // no patient relation
      }),
      prisma.equipment.findMany({
        where: {
          clinicId: payload.clinicId,
          OR: [
            { status: 'Maintenance Required' },
            { status: 'Under Maintenance' }
          ]
        }
      }),
      prisma.equipment.count({ where: { clinicId: payload.clinicId } })
    ]);
    return NextResponse.json({
      patients,
      upcomingAppointments,
      equipmentNeedingMaintenance,
      totalEquipment
    });
  } catch (e) {
    console.log('JWT/DB error:', e);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
