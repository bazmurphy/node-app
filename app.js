// bring in the core NodeJS module path
const path = require("path");

const express = require("express");
// bring in our environment variables
const dotenv = require("dotenv");

// when there is a request to a page or any type of request that it shows in the console
const morgan = require("morgan");

// bring in express handlebars
const exphbs = require("express-handlebars");

// import the connectDB we made in db.js
const connectDB = require("./config/db");

// load our config file
// call dotenv.config method and pass in an object with the path to the config file
dotenv.config({path: "./config/config.env"});

// run the connectDB function imported from above
connectDB()

// initialise our app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// we need to use the exphbs variable above, and call its method ".engine()"
// and then provide a defaultLayout because the template engine wraps everything in that layout
// and then to prevent us having to use ".handlebars" we can abbreviate it to ".hbs"
app.engine(".hbs", exphbs.engine({defaultLayout: "main", extname: ".hbs"}));

// we set our view engine to handlebars with the modified extension name "hbs"
app.set("view engine", ".hbs");

// Static Folder
app.use(express.static(path.join(__dirname, "public")));
// app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// Routes
app.use("/", require("./routes/index"));

// whenever we use process.env we can use variables that are in that config
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
 