const db = require("../db");

const createSeekerProfile = async (req, res) => {
  if (req.user.role !== "seeker") {
    return res.status(403).json({ message: "Only seekers can create seeker profiles." });
  }

  const { field, experience, certifications, education, location } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO seeker_profiles (user_id, field, experience, certifications, education, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE
       SET field = EXCLUDED.field,
           experience = EXCLUDED.experience,
           certifications = EXCLUDED.certifications,
           education = EXCLUDED.education,
           location = EXCLUDED.location
       RETURNING *`,
      [req.user.id, field, experience, certifications, education, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating seeker profile." });
  }
};

const createEmployerProfile = async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can create employer profiles." });
  }

  const { company_name, position_title, required_field, min_experience, required_certifications, required_education, location } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO employer_profiles (user_id, company_name, position_title, required_field, min_experience, required_certifications, required_education, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE
       SET company_name = EXCLUDED.company_name,
           position_title = EXCLUDED.position_title,
           required_field = EXCLUDED.required_field,
           min_experience = EXCLUDED.min_experience,
           required_certifications = EXCLUDED.required_certifications,
           required_education = EXCLUDED.required_education,
           location = EXCLUDED.location
       RETURNING *`,
      [req.user.id, company_name, position_title, required_field, min_experience, required_certifications, required_education, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating employer profile." });
  }
};

const getSeekerProfile = async (req, res) => {
    if (req.user.role !== "seeker") return res.status(403).json({ message: "Not a seeker" });

    const result = await db.query("SELECT * FROM seeker_profiles WHERE user_id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "No profile found" });

    res.json(result.rows[0]);
};

const getEmployerProfile = async (req, res) => {
    if (req.user.role !== "employer") return res.status(403).json({ message: "Not an employer" });

    const result = await db.query("SELECT * FROM employer_profiles WHERE user_id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "No profile found" });

    res.json(result.rows[0]);
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const profileRes =
      role === "seeker"
        ? await db.query("SELECT * FROM seeker_profiles WHERE user_id = $1", [userId])
        : await db.query("SELECT * FROM employer_profiles WHERE user_id = $1", [userId]);

    const userRes = await db.query("SELECT first_name, last_name FROM users WHERE id = $1", [userId]);

    if (profileRes.rows.length === 0 || userRes.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      ...profileRes.rows[0],
      ...userRes.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const {
    first_name,
    last_name,
    ...profileData
  } = req.body;

  const certs = profileData.certifications
    ? (Array.isArray(profileData.certifications)
        ? profileData.certifications
        : profileData.certifications.split(",").map(c => c.trim()))
    : [];

  const requiredCerts = profileData.required_certifications
    ? (Array.isArray(profileData.required_certifications)
        ? profileData.required_certifications
        : profileData.required_certifications.split(",").map(c => c.trim()))
    : [];

  try {
    // Update name in users table
    await db.query(
      "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3",
      [first_name, last_name, userId]
    );

    if (role === "seeker") {
      await db.query(
        `UPDATE seeker_profiles SET 
          field = $1, experience = $2, certifications = $3, education = $4, location = $5
         WHERE user_id = $6`,
        [
          profileData.field,
          profileData.experience,
          certs,
          profileData.education,
          profileData.location,
          userId
        ]
      );
    } else {
      await db.query(
        `UPDATE employer_profiles SET 
          company_name = $1, position_title = $2, required_field = $3, min_experience = $4, 
          required_certifications = $5, required_education = $6, location = $7
         WHERE user_id = $8`,
        [
          profileData.company_name,
          profileData.position_title,
          profileData.required_field,
          profileData.min_experience,
          requiredCerts,
          profileData.required_education,
          profileData.location,
          userId
        ]
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = {
  createSeekerProfile,
  createEmployerProfile,
  getSeekerProfile,
  getEmployerProfile,
  getUserProfile,
  updateUserProfile
};
