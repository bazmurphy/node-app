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
    // console.log(profile);
    // ultimately we want to save the profile data in the database

    // we create a newUser object (the pattern is from the /models/User.js Schema/Model)
    // we pass in the values given from Google OAuth
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image: profile.photos[0].value,
    }

    try {
      // go to the database and find the user
      let user = await User.findOne({ googleId: profile.id })
      // if the user exists
      if (user) {
        // run the callback function (from above)
        // 1st parameter is the error
        // 2nd parameter is the user object
        done(null, user);
      // if there is no user, then we want to create one
      } else {
        // we use our User Schema/model and pass in the newUser object
        user = await User.create(newUser);
        // then run the callback function (from above)
        // 1st parameter is the error
        // 2nd parameter is the user object
        done(null, user);
      }
    } catch (error) {
      console.error(error);
    }
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