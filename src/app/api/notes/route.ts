import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all notes
export async function GET() {
  const notes = await prisma.note.findMany();
  return NextResponse.json(notes);
}

// POST: Add a new note
export async function POST(request: Request) {
  const { title, content } = await request.json();
  const note = await prisma.note.create({
    data: { title, content },
  });
  return NextResponse.json(note);
}

// PUT: Update a note
export async function PUT(request: Request) {
  const { id, title, content } = await request.json();
  const updatedNote = await prisma.note.update({
    where: { id },
    data: { title, content },
  });
  return NextResponse.json(updatedNote);
}

// DELETE: Delete a note
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.note.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Note deleted' });
}
