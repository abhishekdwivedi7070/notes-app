// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma'; // Import Prisma client
import jwt from 'jsonwebtoken' // JWT utility functions

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 400 });
  }

  // Compare the password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
  }

  // Generate JWT token
  const token =  jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });;

  // Set the token in cookies
  const response = NextResponse.json({ message: 'Login successful', token });
  response.cookies.set('token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
