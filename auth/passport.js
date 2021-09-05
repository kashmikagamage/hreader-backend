var passport = require("passport");
var LocalStrategy = require("passport-local"),
  Strategy;
var User = require("../logic/user");
var Trainer = require("../logic/trainer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

module.exports = () => {
  passport.use(
    "local.user",
    new LocalStrategy(function(username, password, done) {
      console.log("Authenticated...");
      console.log("Authenticated...456");
      User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
          console.log("Unknown user");
          return done(null, false, { message: "Unknown user" });
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            const payload = {
              user: {
                id: user.id,
              }
            };

            // const token = jwt.sign(user.id, "Sahan960318");
            let token1 = '';
            return jwt.sign(payload, "Sahan960318", { expiresIn: '24h' }, (function (err, token) {
              if (err) throw err;
              console.log(token);
              token1 = token ;
              // const refreshToken = uuidv4();
              // console.log(refreshToken);

              // User.updateRefreshToken(user.id, refreshToken, function (err, res) {
                
              //   if (err) {
              //     // res.status(403).json({
              //     //   type: 'error',
              //     //   message: 'Something went wrong, please try again later'
              //     // });
              //   console.log("Something went wrong, please try again later");

              //   }
              //   console.log("tokegfdfhn is ");
  
              //   // res.status(200).json({
              //   //   type: 'success',
              //   //   message: {
              //   //     accessToken: token,
              //   //     refreshToken: refreshToken,
              //   //     role: user.type,
              //   //     expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
              //   //   }
              //   // });
              // });

              var newUser = user.toJSON();
            newUser.token = token1;
            return done(null, newUser);
            }));
            // var newUser = user.toJSON();
            // newUser.refreshToken = token1;
            // console.log("token is ");
            // console.log(newUser.refreshToken);
            // console.log(newUser.token);
            // console.log(token1);
            // console.log(newUser);

            // return done(null, newUser);
          } else {
            console.log("Invalid password");
            return done(null, false, { message: "Invalid password" });
          }
        });
      });
    })
  );

  passport.use(
    "local.trainer",
    new LocalStrategy(function(trainername, password, done) {
      console.log("Authenticated...");
      console.log("Authenticated...456");
      Trainer.getTrainerByTrainername(trainername, function(err, trainer) {
          console.log("trainer");
          console.log(trainer);
          console.log(trainer.nic);
          console.log(!trainer);
          console.log("trainer");

          if (err) throw err;
        if (!trainer) {
          console.log("Unknown trainer12");
          return done(null, false, { message: "Unknown trainer123" });
        }
        Trainer.comparePassword(password, trainer.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            const payload = {
              trainer: {
                id: trainer.id,
              }
            };

            // const token = jwt.sign(user.id, "Sahan960318");
            let token1 = '';
            return jwt.sign(payload, "Sahan960318", { expiresIn: '24h' }, (function (err, token) {
              if (err) throw err;
              console.log(token);
              token1 = token ;
              // const refreshToken = uuidv4();
              // console.log(refreshToken);

              // User.updateRefreshToken(user.id, refreshToken, function (err, res) {
                
              //   if (err) {
              //     // res.status(403).json({
              //     //   type: 'error',
              //     //   message: 'Something went wrong, please try again later'
              //     // });
              //   console.log("Something went wrong, please try again later");

              //   }
              //   console.log("tokegfdfhn is ");
  
              //   // res.status(200).json({
              //   //   type: 'success',
              //   //   message: {
              //   //     accessToken: token,
              //   //     refreshToken: refreshToken,
              //   //     role: user.type,
              //   //     expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
              //   //   }
              //   // });
              // });

              var newTrainer = trainer.toJSON();
              newTrainer.token = token1;
            return done(null, newTrainer);
            }));
            // var newUser = user.toJSON();
            // newUser.refreshToken = token1;
            // console.log("token is ");
            // console.log(newUser.refreshToken);
            // console.log(newUser.token);
            // console.log(token1);
            // console.log(newUser);

            // return done(null, newUser);
          } else {
            console.log("Invalid password");
            return done(null, false, { message: "Invalid password" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.serializeUser(function (trainer, done) {
    done(null, trainer.id);
  });
  
  passport.deserializeUser(function (id, done) {
    Trainer.getTrainerById(id, function (err, trainer) {
      done(err, trainer);
    });
  });

};
