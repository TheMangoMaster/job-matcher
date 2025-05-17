const db = require("../db");

const sendConnectionRequest = async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can send requests." });
  }

  const { seekerId } = req.body;

  try {
    const existing = await db.query(
      "SELECT * FROM connections WHERE employer_id = $1 AND seeker_id = $2",
      [req.user.id, seekerId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Request already sent." });
    }

    const result = await db.query(
      "INSERT INTO connections (employer_id, seeker_id) VALUES ($1, $2) RETURNING *",
      [req.user.id, seekerId]
    );

    res.status(201).json({ message: "Connection request sent.", connection: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request." });
  }
};

const respondToConnectionRequest = async (req, res) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ message: "Only seekers can respond to requests." });
  }

  const { connectionId, decision } = req.body; // decision = "approved" or "rejected"

  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "Invalid decision." });
  }

  try {
    const connection = await db.query(
      "SELECT * FROM connections WHERE id = $1 AND seeker_id = $2",
      [connectionId, req.user.id]
    );

    if (connection.rows.length === 0) {
      return res.status(404).json({ message: "Connection not found." });
    }

    await db.query(
      "UPDATE connections SET status = $1 WHERE id = $2",
      [decision, connectionId]
    );

    res.json({ message: `Connection ${decision}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to request." });
  }
};

const getPendingConnections = async (req, res) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ message: "Only seekers can view pending requests." });
  }

  try {
    const result = await db.query(
      `SELECT c.id AS connection_id, u.email AS employer_email, c.created_at
       FROM connections c
       JOIN users u ON u.id = c.employer_id
       WHERE c.seeker_id = $1 AND c.status = 'pending'`,
      [req.user.id]
    );

    res.json({ pendingRequests: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pending connections." });
  }
};

const getApprovedConnections = async (req, res) => {
  try {
    const roleField = req.user.role === "seeker" ? "seeker_id" : "employer_id";

    const result = await db.query(
      `SELECT c.id AS connection_id, u.email AS other_party_email, u.first_name, u.last_name,c.status, c.created_at
       FROM connections c
       JOIN users u ON u.id = CASE
         WHEN $1 = 'seeker' THEN c.employer_id
         ELSE c.seeker_id
       END
       WHERE c.${roleField} = $2 AND c.status = 'approved'`,
      [req.user.role, req.user.id]
    );

    res.json({ approvedConnections: result.rows.map(r => ({
      connection_id: r.connection_id,
      email: r.other_party_email,
      name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
      created_at: r.created_at
    }))
   });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching approved connections." });
  }
};

const getSentConnections = async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can view sent requests." });
  }

  try {
    const result = await db.query(
      `SELECT c.id AS connection_id, u.email AS seeker_email, u.first_name, u.last_name, c.created_at
       FROM connections c
       JOIN users u ON u.id = c.seeker_id
       WHERE c.employer_id = $1 AND c.status = 'pending'`,
      [req.user.id]
    );

    res.json({ sentRequests: result.rows.map(r => ({
      connection_id: r.connection_id,
      email: r.seeker_email,
      name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
      created_at: r.created_at
    }))
   });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sent requests." });
  }
};

module.exports = {
  sendConnectionRequest,
  respondToConnectionRequest,
  getPendingConnections,
  getApprovedConnections,
  getSentConnections
};