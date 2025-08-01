export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    await prisma.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    const body = await req.json();
    const { patientId, doctorId, date, time, type, notes } = body;
    if (!patientId || !doctorId || !date || !time || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Combine date and time into a Date object
    const appointmentDateTime = new Date(`${date}T${time}`);
    if (isNaN(appointmentDateTime.getTime())) {
      return NextResponse.json({ error: 'Invalid date or time' }, { status: 400 });
    }
    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        patientId,
        doctor: doctorId,
        date: appointmentDateTime,
        type,
        notes,
      },
    });
    return NextResponse.json({ appointment: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
