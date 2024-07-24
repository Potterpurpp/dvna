const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const ejs = require("ejs");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const config = require("./config/server");

//Initialize Express
const app = express();
require("./core/passport")(passport);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// Enable for Reverse proxy support
// app.set('trust proxy', 1)

// Intialize Session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize express-flash
app.use(require("express-flash")());

// Routing
app.use("/app", require("./routes/app")());
app.use("/", require("./routes/main")(passport));

// Start Server
app.listen(config.port, config.listen);
