// require express
const express = require("express");
// use the .Router() method 
const router = express.Router();

// we import the functions "../middleware/auth.js"
// in this case we only need ensureAuth, because the login/home is the only thing that needs it
const { ensureAuth } = require("../middleware/auth");

// import Story Model
const Story = require("../models/Story");

// @desc  Show add page
// @route GET /stories/add
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc  Process Add Form
// @route POST /stories
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500")
  }
});

module.exports = router;