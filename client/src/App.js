import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SeekerProfile from "./pages/SeekerProfile";
import EmployerProfile from "./pages/EmployerProfile";
import EmployerMatches from "./pages/EmployerMatches";
import Navbar from "./components/Navbar";
import SeekerRequests from "./pages/SeekerRequests";
import Connections from "./pages/Connections";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/seeker" element={<SeekerProfile />} />
        <Route path="/dashboard/employer" element={<EmployerProfile />} />
        <Route path="/dashboard/matches" element={<EmployerMatches />} />
        <Route path="/dashboard/requests" element={<SeekerRequests />} />
        <Route path="/dashboard/connections" element={<Connections />} />
        <Route path="/dashboard/edit-profile" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
