const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'views/pages')));

// Set EJS as templating engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/auth');
});

const server = app.listen(4000, function () {
    console.log('listening to port 4000')
});

var passport = require('passport');
var userProfile;

app.use(session({
  secret: 'eminem1542',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
  res.render('pages/success', { user: userProfile });
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '625928363204-uohpsng29u47plvmskrtfuliie7g20jc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://login-d2tf.onrender.com:4000"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });
