const passport = require("passport");
var User = require("../logic/user");
var Trainer = require("../logic/trainer");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = () => {

  passport.use(
    "User",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      function (jwtPayload, done) {
        return User.getUserById(jwtPayload.user.id, function (err, user) {
          if (err) return done(err);
          if (!user) return done(null, false);
          done(null, user.toJSON());
        });
      }
    )
  );

  passport.use(
    "Trainer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      function (jwtPayload, done) {
        return Trainer.getTrainerById(jwtPayload.trainer.id, function (err, trainer) {
          if (err) return done(err);
          if (!trainer) return done(null, false);
          done(null, trainer.toJSON());
        });
      }
    )
  );

};
