const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
// we bring in our User Model
const User = require("../models/User");

// in app.js we provided passport as the argument to the 
// require("./config/passport")(passport)
// so we will bring it in here
module.exports = function(passport) {
  // here we create our google strategy
  // the GoogleStrategy takes in an object with clientID, clientSecret and callbackURL
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  // then it takes a function (this is still inside passport.use() as the second parameter)
  // with parameters accessToken, refreshToken
  // the profile
  // done is the callback we call whenever we are done doing what we want to do
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // ultimately we want to save the profile data in the database
  }
  )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })

}