// require express
const { response } = require("express");
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

// @desc  Show Single Story
// @route GET /stories/:id
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id)
      .populate("user") // bring in the user data
      .lean(); // convert to regular javascript 
    
    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", {
      story // pass in an object with the story that we fetched from the database so we can display it
    });

  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// @desc  UserId Stories
// @route GET /stories/user/:userId
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId, // get all stories that match the userId
      status: "public", // and only the stories which are "public"
    })
    .populate("user") // add the user data
    .lean()

    res.render("stories/index", { // use the same template as the public stories uses but only show stories that belong to the specific userId
      stories,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/404");
  }
});

// @desc  Show Edit Page
// @route GET /stories/edit:id
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.get("/edit/:id", ensureAuth, async (req, res) => {
  // use the findOne method from Mongo to go look for a story with the id of whatever parameter was passed in
  console.log(req.params.id);
  const story = await Story.findOne({_id: req.params.id}).lean()

  // if there is no story with that id in the datbase render 404 error
  if (!story) {
    return res.render("error/404");
  }

  // if the story user is not the same as the currently logged in user
  if (story.user != req.user.id ) {
    res.redirect("/stories");
  } else {
    //render the stories/edit page with the specific story passed in
    res.render("stories/edit", { 
      story,
    })
  }
});

// @desc  Update Story
// @route PUT /stories/:id
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    // get the story id from the parameter and find it in the database
    let story = await Story.findById(req.params.id).lean()

    // if there is no story with that id in the datbase render 404 error
    if (!story) {
      return res.render("error/404");
    }

    // if the story user is not the same as the currently logged in user
    if (story.user != req.user.id ) {
      res.redirect("/stories");
    } else {
      // we want to update the story using the Mongoose Method findOneAndUpdate
      // and then the 2nd parameter is request.body which is what we want to replace it with
      // and the 3rd parameter is options: 
      // "new" which will create a new story if it doesnt exist
      // "runValidators" which will make sure the Mongoose fields are valid
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });

      res.redirect("/dashboard");
    }
  } catch (error) {
      console.error(error);
      return res.render("error/500");
  }
});

// @desc  Delete Story
// @route DELETE /stories/:id
// whenever you want to use middleware (in this case what we wrote ourselves, you put it after the 1st parameter (the route))
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    // use the Mongoose remove method to delete the story with the id of the request.parameter.id
    await Story.remove({ _id : req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

module.exports = router;