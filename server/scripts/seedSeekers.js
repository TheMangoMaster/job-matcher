const axios = require("axios");
const db = require("../db");

const seekers = [
  {
    email: "seeker1@test.com",
    password: "test123",
    profile: {
      field: "Software Engineering",
      experience: 4,
      certifications: ["AWS Certified", "React Pro"],
      education: "B.Sc in Computer Science",
      location: "Toronto"
    }
  },
  {
    email: "seeker2@test.com",
    password: "test123",
    profile: {
      field: "Software Engineering",
      experience: 2,
      certifications: ["Scrum Master"],
      education: "B.Sc in Software Engineering",
      location: "Toronto"
    }
  },
  {
    email: "seeker3@test.com",
    password: "test123",
    profile: {
      field: "Civil Engineering",
      experience: 5,
      certifications: ["Project Management"],
      education: "B.Eng in Civil Engineering",
      location: "Vancouver"
    }
  },
  {
    email: "seeker4@test.com",
    password: "test123",
    profile: {
      field: "Software Engineering",
      experience: 1,
      certifications: ["React Pro", "AWS Certified"],
      education: "B.Sc in Computer Science",
      location: "Toronto"
    }
  }
];

const registerAndInsertProfiles = async () => {
  for (let seeker of seekers) {
    try {
      // Register the user
      await axios.post("http://localhost:5000/api/register", {
        email: seeker.email,
        password: seeker.password,
        role: "seeker"
      });

      // Login to get user ID
      const loginRes = await axios.post("http://localhost:5000/api/login", {
        email: seeker.email,
        password: seeker.password
      });

      const token = loginRes.data.token;

      // Decode JWT to get user ID
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userId = payload.id;

      // Insert profile into DB
      await db.query(
        `INSERT INTO seeker_profiles (user_id, field, experience, certifications, education, location)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          seeker.profile.field,
          seeker.profile.experience,
          seeker.profile.certifications,
          seeker.profile.education,
          seeker.profile.location
        ]
      );

      console.log(`✅ Seeded: ${seeker.email}`);
    } catch (err) {
      if (err.response) {
        console.error(`❌ Error with ${seeker.email}:`, err.response.status, err.response.data);
      } else if (err.request) {
        console.error(`❌ No response from server for ${seeker.email}`);
      } else {
        console.error(`❌ Script error for ${seeker.email}:`, err.message);
      }
    }
  }

  process.exit();
};

registerAndInsertProfiles();
