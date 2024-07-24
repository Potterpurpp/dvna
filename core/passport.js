const db = require("../models");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((uid, done) => {
    db.User.findOne({
      where: { id: uid },
    }).then((user) => {
      done(null, user ? user : false);
    });
  });

  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        handleLogin(req, username, password, done);
      }
    )
  );

  passport.use(
    "signup",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        process.nextTick(() => handleSignup(req, username, password, done));
      }
    )
  );
};

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const handleLogin = (req, username, password, done) => {
  db.User.findOne({
    where: { login: username },
  }).then((user) => {
    if (!user || !isValidPassword(user, password)) {
      return done(null, false, req.flash("danger", "Invalid Credentials"));
    }
    return done(null, user);
  });
};

const handleSignup = (req, username, password, done) => {
  db.User.findOne({
    where: { email: username },
  }).then((user) => {
    if (user) {
      return done(null, false, req.flash("danger", "Account Already Exists"));
    } else if (
      req.body.email &&
      req.body.password &&
      req.body.username &&
      req.body.cpassword &&
      req.body.name
    ) {
      if (req.body.cpassword === req.body.password) {
        createUser(req, username, password, done);
      } else {
        return done(null, false, req.flash("danger", "Passwords don't match"));
      }
    } else {
      return done(null, false, req.flash("danger", "Input field(s) missing"));
    }
  });
};

const createUser = (req, username, password, done) => {
  db.User.create({
    email: req.body.email,
    password: createHash(password),
    name: req.body.name,
    login: username,
  }).then((user) => {
    return done(null, user);
  });
};
