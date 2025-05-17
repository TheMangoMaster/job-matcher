import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = { ...form };
    if (Array.isArray(form.certifications))
      updatedForm.certifications = form.certifications.join(",");
    if (Array.isArray(form.required_certifications))
      updatedForm.required_certifications = form.required_certifications.join(",");

    try {
      await API.put("/profile", updatedForm);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  if (loading) return <div className="text-center p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>

        {/* Common Fields */}
        <input
          value={form.first_name || ""}
          onChange={(e) => handleChange("first_name", e.target.value)}
          placeholder="First Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          value={form.last_name || ""}
          onChange={(e) => handleChange("last_name", e.target.value)}
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        {/* Seeker Fields */}
        {role === "seeker" && (
          <>
            <input
              value={form.field || ""}
              onChange={(e) => handleChange("field", e.target.value)}
              placeholder="Field"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.experience || ""}
              onChange={(e) => handleChange("experience", e.target.value)}
              placeholder="Experience (years)"
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={Array.isArray(form.certifications) ? form.certifications.join(", ") : form.certifications || ""}
              onChange={(e) => handleChange("certifications", e.target.value.split(",").map(s => s.trim()))}
              placeholder="Certifications (comma-separated)"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.education || ""}
              onChange={(e) => handleChange("education", e.target.value)}
              placeholder="Education"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Location"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </>
        )}

        {/* Employer Fields */}
        {role === "employer" && (
          <>
            <input
              value={form.company_name || ""}
              onChange={(e) => handleChange("company_name", e.target.value)}
              placeholder="Company Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.position_title || ""}
              onChange={(e) => handleChange("position_title", e.target.value)}
              placeholder="Position Title"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.required_field || ""}
              onChange={(e) => handleChange("required_field", e.target.value)}
              placeholder="Required Field"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.min_experience || ""}
              onChange={(e) => handleChange("min_experience", e.target.value)}
              placeholder="Min Experience"
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={Array.isArray(form.required_certifications) ? form.required_certifications.join(", ") : form.required_certifications || ""}
              onChange={(e) => handleChange("required_certifications", e.target.value.split(",").map(s => s.trim()))}
              placeholder="Required Certifications"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.required_education || ""}
              onChange={(e) => handleChange("required_education", e.target.value)}
              placeholder="Required Education"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              value={form.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Location"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}