const passport = require("passport");
var User = require("../logic/user");
var Trainer = require("../logic/trainer");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');


module.exports = () => {

  passport.use(
    "User",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "Sahan960318",
      },
      function (jwtPayload, done) {
        console.log("jwtPayload");
        console.log("jwtPayload123");
        console.log(jwtPayload);
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        // console.log(object)
        return User.getUserById(jwtPayload.user.id, function (err, user) {
          if (err) {
            return done(err);
          } else if (user == null) {
            done("error User");
            return;
          }

          const payload = {
            user: {
              id: user.id,
            }
          };
          // const token = jwt.sign(user.id, "Sahan960318");
          const token = jwt.sign(payload, "Sahan960318", { expiresIn: '1h' }, (function (err, token) {
            if (err) throw err;
            console.log(token);
            // const refreshToken = uuidv4();
            // User.updateRefreshToken(user.id, refreshToken, function (err, res) {
            //   if (err) {
            //     res.status(403).json({
            //       type: 'error',
            //       message: 'Something went wrong, please try again later'
            //     });
            //   }

            //   res.status(200).json({
            //     type: 'success',
            //     message: {
            //       accessToken: token,
            //       refreshToken: refreshToken,
            //       role: user.type,
            //       expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
            //     }
            //   });
            // });
          }));
          console.log(token);
          var newUser = user.toJSON();
          newUser.token = token;
          done(null, newUser);
        });
      }
    )
  );

  passport.use(
    "Trainer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "Sahan960318",
      },
      function (jwtPayload, done) {
        console.log("jwtPayload");
        console.log("jwtPayload123");
        console.log(jwtPayload);
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        // console.log(object)
        return Trainer.getTrainerById(jwtPayload.trainer.id, function (err, trainer) {
          if (err) {
            return done(err);
          } else if (trainer == null) {
            done("error trainer");
            return;
          }

          const payload = {
            trainer: {
              id: trainer.id,
            }
          };
          // const token = jwt.sign(user.id, "Sahan960318");
          const token = jwt.sign(payload, "Sahan960318", { expiresIn: '1h' }, (function (err, token) {
            if (err) throw err;
            console.log(token);
            // const refreshToken = uuidv4();
            // User.updateRefreshToken(user.id, refreshToken, function (err, res) {
            //   if (err) {
            //     res.status(403).json({
            //       type: 'error',
            //       message: 'Something went wrong, please try again later'
            //     });
            //   }

            //   res.status(200).json({
            //     type: 'success',
            //     message: {
            //       accessToken: token,
            //       refreshToken: refreshToken,
            //       role: user.type,
            //       expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
            //     }
            //   });
            // });
          }));
          console.log(token);
          var newTrainer = trainer.toJSON();
          newTrainer.token = token;
          done(null, newTrainer);
        });
      }
    )
  );

};
