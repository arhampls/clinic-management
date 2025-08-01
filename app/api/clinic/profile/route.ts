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
    const payload = jwt.verify(token, JWT_SECRET) as { clinicId: string };
    const clinic = await prisma.clinic.findUnique({ where: { id: payload.clinicId } });
    if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { clinicId: string };
    const body = await req.json();
    const { name } = body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Clinic name is required' }, { status: 400 });
    }
    const clinic = await prisma.clinic.update({ where: { id: payload.clinicId }, data: { name } });
    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ error: 'Invalid token or update failed' }, { status: 401 });
  }
}
