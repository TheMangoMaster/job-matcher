const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const register = async (req, res) => {
  console.log("🔍 Received registration request:", req.body);

  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, hashedPassword, role]
    );

    const user = result.rows[0];
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error("❌ Registration failed:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { register, login };
