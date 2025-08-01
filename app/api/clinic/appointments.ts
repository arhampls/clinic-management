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
    const appointments = await prisma.appointment.findMany({ where: { clinicId: payload.clinicId }, include: { patient: true } });
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
