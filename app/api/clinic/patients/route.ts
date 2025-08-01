export async function DELETE(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    await prisma.patient.delete({ where: { id, clinicId: payload.clinicId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove patient' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    const body = await req.json();
    const {
      firstName, lastName, phone, dateOfBirth, gender, condition, address, emergencyContactName, emergencyContactNumber, notes
    } = body;
    if (!firstName && !lastName) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!phone) return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    if (!dateOfBirth) return NextResponse.json({ error: 'Date of birth is required' }, { status: 400 });
    if (!gender) return NextResponse.json({ error: 'Gender is required' }, { status: 400 });
    const updated = await prisma.patient.update({
      where: { id, clinicId: payload.clinicId },
      data: {
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        phone,
        dateOfBirth,
        gender,
        condition,
        address,
        emergencyContactName,
        emergencyContactNumber,
        notes,
      },
    });
    return NextResponse.json({ patient: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const body = await req.json();
    const { firstName, lastName, phone, dateOfBirth, gender, condition, address, emergencyContactName, emergencyContactNumber, notes } = body;
    if (!firstName && !lastName) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!phone) return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    if (!dateOfBirth) return NextResponse.json({ error: 'Date of birth is required' }, { status: 400 });
    if (!gender) return NextResponse.json({ error: 'Gender is required' }, { status: 400 });
    const patient = await prisma.patient.create({
      data: {
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        clinicId: payload.clinicId,
        phone,
        dateOfBirth,
        gender,
        condition,
        address,
        emergencyContactName,
        emergencyContactNumber,
        notes,
      }
    });
    return NextResponse.json({ patient });
  } catch {
    return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
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
    const patients = await prisma.patient.findMany({ where: { clinicId: payload.clinicId } });
    return NextResponse.json({ patients });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
