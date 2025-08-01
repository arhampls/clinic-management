import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  const { email, password, clinicName } = await req.json();
  if (!email || !password || !clinicName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const clinic = await prisma.clinic.create({ data: { name: clinicName } });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      clinicId: clinic.id,
    },
  });
  const token = jwt.sign({ userId: user.id, clinicId: clinic.id }, JWT_SECRET, { expiresIn: '7d' });
  return NextResponse.json({ token });
}
