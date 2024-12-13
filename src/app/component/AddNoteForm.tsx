import React, { useState, FormEvent } from "react";

const AddNoteForm: React.FC = () => {
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note.");
      }

      const data = await response.json();
      setServerResponse(`Note added successfully`);
    } catch (err) {
      setServerResponse(`Error: ${err.message}`);
    } finally {
      e.currentTarget.reset(); // Reset the form after the submission
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700">Add a New Note</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label
            htmlFor="note-title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="note-title"
            name="title"
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter note title"
            required
          />
        </div>
        <div>
          <label
            htmlFor="note-content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="note-content"
            name="content"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Write your note here..."
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Add Note
        </button>
      </form>

      {serverResponse && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
          {serverResponse}
        </div>
      )}
    </div>
  );
};

export default AddNoteForm;
