import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  // hide navbar on login/register pages
  if (location.pathname === "/" || location.pathname === "/register") return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Job Matcher</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>

        {role === "employer" && (
          <Link to="/dashboard/matches" className="text-gray-700 hover:text-blue-600">Matches</Link>
        )}
        {role === "seeker" && (
          <Link to="/dashboard/requests" className="text-gray-700 hover:text-blue-600">Requests</Link>
        )}

        <Link to="/dashboard/connections" className="text-gray-700 hover:text-blue-600">Connections</Link>
        <Link to="/dashboard/edit-profile" className="text-gray-700 hover:text-blue-600">Edit Profile</Link>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
