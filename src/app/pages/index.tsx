import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to NoteApp</h1>
        <p className="mt-4 text-gray-600">Take notes easily and securely.</p>
        <div className="mt-6 space-x-4">
          <Link
            href="/signup"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded hover:bg-gray-400"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
