const express = require("express");
const router = express.Router();
const { authenticate } = require("./middleware");
const { register, login } = require("./controllers/authController");
const { createSeekerProfile, createEmployerProfile } = require("./controllers/profileController");
const { getMatchesForEmployer } = require("./controllers/matchController");
const { sendConnectionRequest, respondToConnectionRequest, getPendingConnections, getApprovedConnections, getSentConnections } = require("./controllers/connectionController");
const { getSeekerProfile, getEmployerProfile, getUserProfile, updateUserProfile } = require("./controllers/profileController");

router.get("/", (req, res) => {
  res.send("✅ API is up and running!");
});

router.post("/register", register);
router.post("/login", login);

router.post("/seeker/profile", authenticate, createSeekerProfile);
router.get("/seeker/profile", authenticate, getSeekerProfile);

router.post("/employer/profile", authenticate, createEmployerProfile);
router.get("/employer/profile", authenticate, getEmployerProfile);
router.get("/employer/matches", authenticate, getMatchesForEmployer);

router.post("/connections/request", authenticate, sendConnectionRequest);
router.post("/connections/respond", authenticate, respondToConnectionRequest);
router.get("/connections/pending", authenticate, getPendingConnections);
router.get("/connections/approved", authenticate, getApprovedConnections);
router.get("/connections/sent", authenticate, getSentConnections);

router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);

// 🔐 Protected route example
router.get("/protected", authenticate, (req, res) => {
    res.json({ message: "You're in a protected route!", user: req.user });
  });


module.exports = router;
