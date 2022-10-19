// we need to require mongoose to work with mongoDB
const mongoose = require("mongoose");

// this function needs to be async because when you work with mongoose you are working with Promises
// mongoose.connect returns a promise and i don't want to use .then
const connectDB = async () => {
  try {
    // we use the mongoose connect method and pass it [1] the connection string from our env file
    // and we can give it extra options inside an object to stop warnings in the console
    const conn = await mongoose.connect(process.env.MONGO_URI, 
      {          
      // useNewUrlParse: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
      }
      // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.
    )

    // after we connect we can log the "connection.host" from the conn variable above
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error);
    // if everything goes wrong, we can stop everything with process.exit
    // and the 1 represents FAILURE
    process.exit(1);
  }
}

// we use this export statement so we can use this in the app.js file
module.exports = connectDB;