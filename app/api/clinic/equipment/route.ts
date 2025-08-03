export async function PUT(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const body = await req.json();
    let { id, ...updateData } = body;
    // Remove fields that should not be updated
    delete updateData.clinicId;
    delete updateData.createdAt;
    delete updateData.customMaintenanceDays;
    if (!id) {
      return NextResponse.json({ error: 'Missing equipment id' }, { status: 400 });
    }
    // Convert id to number if possible
    if (typeof id === 'string' && !isNaN(Number(id))) {
      id = Number(id);
    }
    // First, check if equipment exists and belongs to the clinic
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing || existing.clinicId !== payload.clinicId) {
      return NextResponse.json({ error: 'Equipment not found or unauthorized' }, { status: 404 });
    }
    const updated = await prisma.equipment.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ equipment: updated });
  } catch (e) {
    console.error('PUT /api/clinic/equipment error:', e);
    return NextResponse.json({ error: 'Failed to update equipment', details: e?.message || e }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; clinicId: string };
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing equipment id' }, { status: 400 });
    }
    const deleted = await prisma.equipment.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 });
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
    const {
      name, model, manufacturer, serialNumber, purchaseDate, warrantyExpiry, status, location, maintenanceInterval, notes
    } = body;
    if (!name || !model || !manufacturer || !serialNumber || !purchaseDate || !status || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const equipment = await prisma.equipment.create({
      data: {
        clinicId: payload.clinicId,
        name,
        model,
        manufacturer,
        serialNumber,
        purchaseDate,
        warrantyExpiry,
        status,
        location,
        maintenanceInterval,
        notes,
      },
    });
    return NextResponse.json({ equipment });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add equipment' }, { status: 500 });
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
    const equipment = await prisma.equipment.findMany({ where: { clinicId: payload.clinicId } });
    return NextResponse.json({ equipment });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
