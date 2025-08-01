export async function PUT(req: NextRequest) {
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
    const body = await req.json();
    const {
      name, model, manufacturer, serialNumber, purchaseDate, warrantyExpiry, status, location, maintenanceInterval, notes
    } = body;
    const updated = await prisma.equipment.update({
      where: { id },
      data: {
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
    return NextResponse.json({ equipment: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
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
