const db = require("../db");

const getMatchesForEmployer = async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can view matches." });
  }

  try {
    // Get employer's profile
    const employerRes = await db.query("SELECT * FROM employer_profiles WHERE user_id = $1", [req.user.id]);
    const employer = employerRes.rows[0];

    if (!employer) {
      return res.status(400).json({ message: "Employer profile not found." });
    }

    const connectionCheck = await db.query(
      `SELECT seeker_id FROM connections WHERE employer_id = $1 AND status = 'pending'`,
      [req.user.id]
    );
    
    const alreadyRequestedIds = connectionCheck.rows.map(r => r.seeker_id);

    // Get all seeker profiles
    const seekerRes = await db.query(`
      SELECT 
        s.*, 
        u.first_name, 
        u.last_name 
      FROM seeker_profiles s
      JOIN users u ON s.user_id = u.id
    `);
    const seekers = seekerRes.rows;

    // Scoring logic
    const matches = seekers.map(seeker => {
      let score = 0;

      if (seeker.field === employer.required_field) score += 30;
      if (seeker.experience >= employer.min_experience) score += 20;

      const matchedCerts = seeker.certifications.filter(cert =>
        employer.required_certifications.includes(cert)
      ).length;
      const totalCerts = employer.required_certifications.length || 1;
      score += Math.round((matchedCerts / totalCerts) * 30); // up to 30%

      if (seeker.education === employer.required_education) score += 10;
      if (seeker.location === employer.location) score += 10;

      return {
        seeker_id: seeker.user_id,
        name: seeker.first_name + " " + seeker.last_name,
        score,
        field: seeker.field,
        experience: seeker.experience,
        education: seeker.education,
        certifications: seeker.certifications,
        location: seeker.location,
        alreadyRequested: alreadyRequestedIds.includes(seeker.user_id)
      };
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching matches." });
  }
};

module.exports = { getMatchesForEmployer };
