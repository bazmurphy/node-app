// require express
const express = require("express");
// use the .Router() method 
const router = express.Router();

// @desc  Login/Landign Page
// @route GET /
router.get("/", (req, res) => {
  // res.send("Login");
  res.render("login", {
    layout: "login",
  });
})

// @desc  Dashboard
// @route GET /dashboard
router.get("/dashboard", (req, res) => {
  // res.send("Dashboard");
  res.render("dashboard");
})

module.exports = router;