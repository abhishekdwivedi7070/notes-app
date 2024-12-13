import React, { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
}

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = async (id: string) => {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");

    if (newTitle && newContent) {
      try {
        const response = await fetch(`/api/notes/`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, title: newTitle, content: newContent }),
        });
        if (!response.ok) {
          throw new Error("Failed to edit note");
        }
        setNotes(
          notes.map((note) =>
            note.id === id ? { ...note, title: newTitle, content: newContent } : note
          )
        );
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700">Your Notes</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p className="text-gray-700">{note.content}</p>
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => handleEdit(note.id)}
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="px-2 py-1 text-sm text-white bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
