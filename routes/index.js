// require express
const express = require("express");
// use the .Router() method 
const router = express.Router();

// we import the functions "../middleware/auth.js"
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// import Story Model
const Story = require("../models/Story");

// @desc  Login/Landing Page
// @route GET /
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/", ensureGuest, (req, res) => {
  // res.send("Login");
  res.render("login", {
    layout: "login",
  });
});

// @desc  Dashboard
// @route GET /dashboard
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/dashboard", ensureAuth, async (req, res) => { // we have to make this async
  try {
    const stories = await Story.find({ user: req.user.id }).lean() // this uses the Story Model to find all the stories of the specific Id && lean returns a Plain JavaScript Object not a Mongoose Document
    res.render("dashboard", {
      name: req.user.firstName, // first name is sent to the dashboard
      stories, // stories are sent to the dashboard
    });
  } catch (error) {
    console.error(error);
    res.render("error/500"); // render the error/500.hbs 
  }

});

module.exports = router;