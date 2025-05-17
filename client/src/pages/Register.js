import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "seeker" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending registration...", form);
    
    try {
      const res = await API.post("/register", form);
      console.log("✅ Registration success:", res.data);
      alert("Account created! Please log in.");
      navigate("/"); // to login page
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          placeholder="First Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          value={form.email}
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />

        <input
          value={form.password}
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="seeker">Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Create Account
        </button>
      </form>
    </div>
  );
}
