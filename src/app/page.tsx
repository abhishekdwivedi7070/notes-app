"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cookie from "cookie";
import AddNoteForm from "./component/AddNoteForm";
import NoteList from "./component/NoteList";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check for authentication token in cookies
  const checkAuth = () => {
    console.log("Checking authentication...");
    const cookies = cookie.parse(document.cookie || "");
    if (cookies.token) {
      console.log("Token found, setting isAuthenticated to true.");
      setIsAuthenticated(true);
    } else {
      console.log("No token found, setting isAuthenticated to false.");
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect to Login Page
  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  // Redirect to Signup Page
  const handleSignupRedirect = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isAuthenticated ? (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to Notes App
          </h1>
          <div className="space-y-6">
            {/* Add Note Component */}
            <div className="p-4 bg-blue-50 rounded-lg shadow">
             <AddNoteForm/>
            </div>
            </div>
            {/* Render Notes Component */}
           
             
             <NoteList/>
           
         
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Notes App
          </h1>
          <p className="text-gray-600 mb-8">
            Organize your thoughts and ideas effortlessly. Log in or sign up to get started!
          </p>
          <div className="space-x-4">
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={handleSignupRedirect}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400"
            >
              Signup
            </button>
            <button
              onClick={checkAuth}
              className="px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-700"
            >
              Recheck Authentication
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;