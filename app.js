// bring in the core NodeJS module path
const path = require("path");

const express = require("express");

// bring in mongoose
// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
const mongoose = require("mongoose");

// bring in our environment variables
const dotenv = require("dotenv");

// when there is a request to a page or any type of request that it shows in the console
const morgan = require("morgan");

// bring in express handlebars
const exphbs = require("express-handlebars");

// bring in passport for authentication strategy
const passport = require("passport");

// bring in express session for passport
const session = require("express-session");

// bring in connect mongo - this is initially to store our user sessions
// and we pass in the "session" middleware from above INTO IT (???)
// OUTDATED - WE CANNOT DO THIS ANYMORE
// const MongoStore = require("connect-mongo")(session);
const MongoStore = require("connect-mongo");
// go look at app.use(session({})) for more info

// import the connectDB we made in db.js
const connectDB = require("./config/db");

// load our config file
// call dotenv.config method and pass in an object with the path to the config file
dotenv.config({path: "./config/config.env"});

// passport config
// we can pass in the passport variable above
// when you use require, you are importing the module, and then giving it a parameter (in this case passport)
require("./config/passport")(passport)


// run the connectDB function imported from above
connectDB()

// initialise our app
const app = express();

// Body Parser (to understand Form data)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon } = require("./helpers/hbs");

// Handlebars
// we need to use the exphbs variable above, and call its method ".engine()"
// and then provide a defaultLayout because the template engine wraps everything in that layout
// and then to prevent us having to use ".handlebars" we can abbreviate it to ".hbs"
app.engine(".hbs", exphbs.engine({ helpers: { formatDate, truncate, stripTags, editIcon }, defaultLayout: "main", extname: ".hbs" }));
 
// we set our view engine to handlebars with the modified extension name "hbs"
app.set("view engine", ".hbs");

// express-session middleware (must be above passport middleware)
app.use(session({
  secret: "keyboard cat", // this can be anything?
  resave: false, // this states we don't want to save a session if nothing is modified
  saveUninitialized: false, // this states don't save a session untill something is stored
  // later we will put a store value here for Mongoose to store it to our MongoDB
  // in our express session middleware and add in a store:
  // set it to a new MongoStore which takes in an object
  // and we pass in our current mongooseConnection
  // store: new MongoStore({ mongooseConnection: mongoose.connection })
  // ^ THE ABOVE IS OUTDATED, NEW:
  store: MongoStore.create({ client: mongoose.connection.getClient() })
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variable
// we have to set it as a middleware
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Static Folder
app.use(express.static(path.join(__dirname, "public")));
// app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

// whenever we use process.env we can use variables that are in that config
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));