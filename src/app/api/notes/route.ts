import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, verifyTokenFromRequest } from '@/app/lib/auth';

const prisma = new PrismaClient();



// POST: Add a new note
export async function POST(request: Request) {
  // Verify the token from the request
  const { user, error, status } = verifyTokenFromRequest(request);
  // If token is invalid or missing, return error response
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  // If user is not valid, return error response
  if (!user || !user.id) {
    return NextResponse.json({ message: 'Invalid token: No user found' }, { status: 401 });
  }

  // Proceed with note creation if user is authenticated
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: user.id, // Use the user ID decoded from the token
      },
    });
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ message: 'Error creating note', error: error.message }, { status: 500 });
  }
}

// PUT: Update a note
export async function PUT(request: Request) {
  // Verify the token from the request
  const { user, error, status } = verifyTokenFromRequest(request);

  // If token is invalid or missing, return error response
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  // Extract the note data from the request body
  const { id, title, content } = await request.json();

  // Ensure that all necessary fields are provided
  if (!id || !title || !content) {
    return NextResponse.json({ message: 'Missing id, title, or content' }, { status: 400 });
  }

  try {
    // Check if the note exists and belongs to the authenticated user
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    // If the note exists but doesn't belong to the authenticated user, deny access
    if (existingNote.userId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized to update this note' }, { status: 403 });
    }

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ message: 'Error updating note' }, { status: 500 });
  }
}
// DELETE: Delete a note
export async function DELETE(request: Request) {
  // Verify the token from the request
  const { user, error, status } = verifyTokenFromRequest(request);

  // If token is invalid or missing, return error response
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  // Extract the note ID from the request body
  const { id } = await request.json();

  // Ensure that the note ID is provided
  if (!id) {
    return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
  }

  try {
    // Check if the note exists
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    // If the note exists but doesn't belong to the authenticated user, deny access
    if (existingNote.userId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized to delete this note' }, { status: 403 });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ message: 'Error deleting note' }, { status: 500 });
  }
}

// GET: Fetch all notes
export async function GET(request: Request) {
  // Verify the token from the request
  const { user, error, status } = verifyTokenFromRequest(request);

  // If token is invalid or missing, return error response
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  try {
    // Fetch all notes belonging to the authenticated user
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id, // Only fetch notes that belong to the authenticated user
      },
    });

    return NextResponse.json(notes); // Return the notes as JSON
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ message: 'Error fetching notes' }, { status: 500 });
  }
}