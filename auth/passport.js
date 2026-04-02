var passport = require("passport");
var LocalStrategy = require("passport-local"),
  Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../logic/user");
var Trainer = require("../logic/trainer");
const jwt = require("jsonwebtoken");

module.exports = () => {
  passport.use(
    "local.user",
    new LocalStrategy(function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            const payload = { user: { id: user.id } };
            let token1 = '';
            return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, function(err, token) {
              if (err) throw err;
              token1 = token;
              var newUser = user.toJSON();
              newUser.token = token1;
              return done(null, newUser);
            });
          } else {
            return done(null, false, { message: "Invalid credentials" });
          }
        });
      });
    })
  );

  passport.use(
    "local.trainer",
    new LocalStrategy(function(trainername, password, done) {
      Trainer.getTrainerByTrainername(trainername, function(err, trainer) {
        if (err) throw err;
        if (!trainer) {
          return done(null, false, { message: "Invalid credentials" });
        }
        Trainer.comparePassword(password, trainer.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            const payload = { trainer: { id: trainer.id } };
            let token1 = '';
            return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, function(err, token) {
              if (err) throw err;
              token1 = token;
              var newTrainer = trainer.toJSON();
              newTrainer.token = token1;
              return done(null, newTrainer);
            });
          } else {
            return done(null, false, { message: "Invalid credentials" });
          }
        });
      });
    })
  );

  // Single Google strategy handles both login and account-linking flows.
  // If req.session.linkTrainerId is set, it's a link flow — return only the
  // Google profile. Otherwise it's a login flow — find or create a trainer.
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3005/api/auth/google/callback",
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : null;

        if (req.session && req.session.linkTrainerId) {
          return done(null, { googleId: profile.id, email, isLinkFlow: true });
        }

        Trainer.findOrCreateByGoogle(profile, function (err, trainer) {
          if (err) return done(err);
          if (!trainer) return done(null, false);
          return done(null, trainer);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    if (user.isLinkFlow) {
      done(null, '__link__:' + JSON.stringify({ googleId: user.googleId, email: user.email }));
    } else {
      done(null, user.id);
    }
  });

  passport.deserializeUser(function (data, done) {
    if (typeof data === 'string' && data.startsWith('__link__:')) {
      try {
        const parsed = JSON.parse(data.substring(9));
        return done(null, { ...parsed, isLinkFlow: true });
      } catch (e) {
        return done(null, false);
      }
    }
    Trainer.getTrainerById(data, function (err, trainer) {
      done(err, trainer);
    });
  });

};
