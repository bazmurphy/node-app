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

// @desc  Show All Stories
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" }) // go to the database and find all stories which are public
      .populate("user") // add on to that the user data, name etc. because its not part of the Story model, its part of the User model
      .sort({ createdAt: "descending" }) // sort it
      .lean(); // turn it into regular javascript object
    res.render("stories/index", { stories, }); // render the page using the stories/index VIEW and pass in the stories object
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

module.exports = router;