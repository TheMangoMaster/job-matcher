import { useEffect, useState } from "react";
import API from "../services/api";

export default function SeekerRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await API.get("/connections/pending");
    setRequests(res.data.pendingRequests);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (id, decision) => {
    try {
      await API.post("/connections/respond", {
        connectionId: id,
        decision,
      });
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Failed to respond.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Pending Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.connection_id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">From: <strong>{req.employer_email}</strong></p>
                <p className="text-xs text-gray-400">Sent on: {new Date(req.created_at).toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleResponse(req.connection_id, "approved")}
                  className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleResponse(req.connection_id, "rejected")}
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
