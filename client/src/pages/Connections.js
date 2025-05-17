import { useEffect, useState } from "react";
import API from "../services/api";

export default function Connections() {
  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resApproved = await API.get("/connections/approved");
        setApproved(resApproved.data.approvedConnections);

        if (role === "employer") {
          const resPending = await API.get("/connections/sent");
          setPending(resPending.data.sentRequests);
        }
      } catch (err) {
        console.error("Error loading connections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-center mb-4">Your Connections</h2>

      {/* Approved Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-green-700">✔ Approved Connections</h3>
        {approved.length === 0 ? (
          <p className="text-gray-500">No approved connections yet.</p>
        ) : (
          <div className="space-y-4">
            {approved.map((conn) => (
              <div key={conn.connection_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <p className="text-blue-600 font-medium">{conn.name || conn.email}</p>
                  <p className="text-sm text-gray-500">Connected on: {new Date(conn.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-green-600 font-semibold">Connected</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Sent (Employer Only) */}
      {role === "employer" && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-yellow-600">🕓 Pending Requests</h3>
          {pending.length === 0 ? (
            <p className="text-gray-500">No pending requests sent.</p>
          ) : (
            <div className="space-y-4">
              {pending.map((req) => (
                <div key={req.connection_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="text-blue-600 font-medium">{req.name || req.email}</p>
                    <p className="text-sm text-gray-500">Sent on: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-yellow-600 font-medium">Waiting for approval</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
