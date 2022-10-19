// require express
const express = require("express");

// require passport
const passport = require("passport");

// use the .Router() method 
const router = express.Router();

// @desc  Authenticate with Google
// @route GET /auth/google
// we only need to use /google here because we are going to link it to /auth/ in the app.js
// the 2nd parameter is using passport.authenticate method
// the 1st parameter is the strategy
// the 2nd parameter is an object with the key of scope
router.get("/google", passport.authenticate("google", { scope: ['profile'] }));

// @desc  Dashboard
// @route GET /dashboard
router.get("/dashboard", (req, res) => {
  // res.send("Dashboard");
  res.render("dashboard");
})

module.exports = router;