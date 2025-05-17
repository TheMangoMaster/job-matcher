import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "seeker" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/register", form);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          placeholder="First Name"
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Last Name"
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <select
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
