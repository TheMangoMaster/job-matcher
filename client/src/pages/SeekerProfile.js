import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SeekerProfile() {
  const [form, setForm] = useState({
    field: "",
    experience: "",
    certifications: "",
    education: "",
    location: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/seeker/profile", {
      ...form,
      certifications: form.certifications.split(",").map(s => s.trim())
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Seeker Profile</h2>
        <input
          placeholder="Field"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, field: e.target.value })}
        />
        <input
          placeholder="Experience (years)"
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        />
        <input
          placeholder="Certifications (comma-separated)"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, certifications: e.target.value })}
        />
        <input
          placeholder="Education"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, education: e.target.value })}
        />
        <input
          placeholder="Location"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  );
}
