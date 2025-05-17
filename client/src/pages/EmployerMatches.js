import { useEffect, useState } from "react";
import API from "../services/api";

export default function EmployerMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get("/employer/matches");
  
        // initialize button states from backend
        const initialRequests = Object.fromEntries(
          res.data.map((seeker) => [seeker.seeker_id, seeker.alreadyRequested])
        );
  
        setMatches(res.data);
        setSentRequests(initialRequests);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatches();
  }, []);
  

  const handleConnect = async (seekerId) => {
    try {
      await API.post("/connections/request", { seekerId });
      setSentRequests((prev) => ({ ...prev, [seekerId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading matches...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Top Matched Candidates</h2>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches found yet.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((seeker) => (
            <div key={seeker.seeker_id} className="bg-white p-4 rounded shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{seeker.name || "Unnamed Seeker"}</h3>
                  <p className="text-sm text-gray-500">Match Score: <strong>{seeker.score}%</strong></p>
                  <p className="text-sm text-gray-500">{seeker.field}, {seeker.experience} years</p>
                  <p className="text-sm text-gray-500">Location: {seeker.location}</p>
                  <p className="text-sm text-gray-500">Education: {seeker.education}</p>
                  <p className="text-sm text-gray-500">
                    Certifications: {seeker.certifications.join(", ")}
                  </p>
                </div>
                <button
                  disabled={sentRequests[seeker.seeker_id]}
                  onClick={() => handleConnect(seeker.seeker_id)}
                  className={`px-4 py-2 rounded text-white ${
                    sentRequests[seeker.seeker_id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {sentRequests[seeker.seeker_id] ? "Request Sent" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
