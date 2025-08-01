export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const body = await req.json();
    const { patientId, date, time, type, notes } = body;
    if (!patientId || !date || !time || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Combine date and time into a Date object
    const appointmentDateTime = new Date(`${date}T${time}`);
    if (isNaN(appointmentDateTime.getTime())) {
      return NextResponse.json({ error: 'Invalid date or time' }, { status: 400 });
    }
    if (appointmentDateTime < new Date()) {
      return NextResponse.json({ error: 'Cannot schedule appointment in the past' }, { status: 400 });
    }
    const appointment = await prisma.appointment.create({
      data: {
        clinicId: payload.clinicId,
        patientId, // now just a string
        date: appointmentDateTime,
        type,
        notes,
        doctor: body.doctorId || null,
      },
    });
    return NextResponse.json({ appointment });
  } catch {
    return NextResponse.json({ error: 'Failed to schedule appointment' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const now = new Date();
    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId: payload.clinicId,
        date: { gte: now },
      },
      // No patient relation now
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
