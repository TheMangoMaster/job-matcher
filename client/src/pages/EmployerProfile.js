import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function EmployerProfile() {
  const [form, setForm] = useState({
    company_name: "",
    position_title: "",
    required_field: "",
    min_experience: "",
    required_certifications: "",
    required_education: "",
    location: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/employer/profile", {
      ...form,
      required_certifications: form.required_certifications.split(",").map(s => s.trim())
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Employer Profile</h2>
        <input
          placeholder="Company Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        />
        <input
          placeholder="Position Title"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, position_title: e.target.value })}
        />
        <input
          placeholder="Required Field"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, required_field: e.target.value })}
        />
        <input
          placeholder="Minimum Experience"
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, min_experience: e.target.value })}
        />
        <input
          placeholder="Required Certifications (comma-separated)"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, required_certifications: e.target.value })}
        />
        <input
          placeholder="Required Education"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, required_education: e.target.value })}
        />
        <input
          placeholder="Location"
          className="w-full border border-gray-300 rounded px-3 py-2"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Save Profile
        </button>
      </form>
    </div>
  );
}
