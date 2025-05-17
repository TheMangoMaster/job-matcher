import { Link } from "react-router-dom";

export default function Dashboard() {
    const role = localStorage.getItem("role");
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to the Dashboard</h2>
        <p className="text-gray-600 mb-4">Logged in as: <strong>{role}</strong></p>
        <p className="text-gray-500 text-sm">More features coming soon.</p>
        <Link to="/dashboard/matches" className="text-blue-600 hover:underline">
          View Matches
        </Link>
      </div>
    </div>
    );
  }
  