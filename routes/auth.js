// require express
const express = require("express");

// require passport
const passport = require("passport");

// use the .Router() method 
const router = express.Router();

// @desc  Authenticate with Google
// @route GET /auth/google
// 1st parameter is the route, !!! we only need to use /google here (not /auth/ aswell) because we are going to link it to /auth/ in the app.js
// the 2nd parameter is using passport.authenticate method
// the 1st parameter is the strategy
// the 2nd parameter is an object specifying the scope
router.get("/google", 
  passport.authenticate("google", { scope: ['profile'] }));

// @desc  Google Authenticate Callback
// @route GET /auth/google/callback
// 1st parameter is the route, !!! we only need to use /google/callback here (not /auth/ aswell) because we are going to link it to /auth/ in the app.js
// 2nd parameter is using passport.authenticate method
// 1st parameter is the strategy
// 2nd parameter is an object with a Failure Redirect (what happens when it fails) we want it to redirect to login
// 3rd parameter is the (req, res)
router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/" }), // if it fails it will redirect to the root
    (req, res) => {
      // if its successful we want to redirect to the dashboard
      res.redirect("/dashboard");
    }
);

// @desc  Logout User
// @route /auth/logout
// OLD VERSION
// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

// NEW VERSION
// In the new version of passport, req.logout() is now an asynchronous function, whereas previously it was synchronous. Hence you need to modify the logout route.
router.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {
          return next(error);
        }
        res.redirect('/');
    });  
})

module.exports = router;