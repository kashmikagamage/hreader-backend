const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportInit = require("../auth/passport");

var User = require("../logic/user");
var Trainer = require("../logic/trainer");
var Train = require("../logic/train");
var Usage = require("../logic/usage");

passportInit();

router.post("/loginUser", passport.authenticate("local.user"), function (req, res) {
  if (req.user) {
    var centers = {};
    //var subjects =[];
    var center = {};
    var subjects = {};
    console.log(" type " + req.user.type);
    
        sendUser(req.user.id, null, req, res);
        
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown user",
      })
    );
  }
});

function sendUser(id, type, req, res) {
    User.getUserById(id, function (centers) {
      console.log(JSON.stringify(type));
      res.setHeader("Content-Type", "application/json");
  
      res.end(
        JSON.stringify({
          id: req.user.id,
          nic: req.user.nic,
          telno: req.user.telno,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          address: req.user.address,
          status: req.user.status,
          height: req.user.height,
          weight: req.user.weight,
          token: req.user.token,
        })
      );
    });
  }

  router.post(
    "/registerUser",
    function (req, res) {
      console.log("Register USer Start");
      var password = req.body.password;
      var fname = req.body.fname;
      var lname = req.body.lname;
      var address = req.body.address;
      var nic = req.body.nic;
      var tel = req.body.tel;
      var status = req.body.status;
      var height = req.body.height;
      var weight = req.body.weight;
  
      //Validation
  
      
          var newUser = {
            nic: nic,
            password: password,
            firstname: fname,
            lastname: lname,
            address: address,
            telno: tel,
            status: status,
            height: height,
            weight: weight,
          };
        
  
        User.createUser(newUser, function (err, user) {
          if (err) {
            console.log("errors" + err.message);
            res.status(403).json({
              type : 'error',
              message:  'This account has been deactivated '
            });
            return;
          } else {
            console.log(user);
            res.status(200).json({
              type : 'done',
              user:  user
            });
          }
        });
      
    }
  );

  router.get("/getUsers", function (req, res) {
    if (req.user) {
      var centers = {};
      //var subjects =[];
      var center = {};
      var subjects = {};
      // console.log(" type " + req.user.type);
      console.log(" id " + req.user.id);
      
          sendUser(req.user.id, null, req, res);
          
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown user",
        })
      );
    }
  });


  ///////////////////////////// Trainer Start //////////////////////////////////////////////////

  router.post("/loginTrainer", passport.authenticate("local.trainer"), function (req, res) {
    console.log("trainer");
          console.log(req.user);
          console.log(req.user.nic);
          console.log("trainer");
    if (req.user) {
      console.log(" nic " + req.user.nic);
      
          sendTrainer(req.user.id, null, req, res);
          
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown trainer",
        })
      );
    }
  });
  
  function sendTrainer(id, type, req, res) {
    Trainer.getTrainerById(id, function (centers) {
        console.log(JSON.stringify(type));
        res.setHeader("Content-Type", "application/json");
    
        res.end(
          JSON.stringify({
            id: req.user.id,
            nic: req.user.nic,
            telno: req.user.telno,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            address: req.user.address,
            status: req.user.status,
            workplace: req.user.workplace,
            token: req.user.token,
          })
        );
      });
    }
  
    router.post(
      "/registerTrainer",
      function (req, res) {
        console.log("Register Trainer Start");
        var password = req.body.password;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var address = req.body.address;
        var nic = req.body.nic;
        var tel = req.body.tel;
        var status = req.body.status;
        var workplace = req.body.workplace;
    
        //Validation
    
        
            var newTrainer = {
              nic: nic,
              password: password,
              firstname: fname,
              lastname: lname,
              address: address,
              telno: tel,
              status: status,
              workplace: workplace
            };
          
    
            Trainer.createTrainer(newTrainer, function (err, trainer) {
            if (err) {
              console.log("errors" + err.message);
              res.status(403).json({
                type : 'error',
                message:  'error occured '
              });
              return;
            } else {
              console.log(trainer);
              res.status(200).json({
                type : 'done',
                trainer: trainer
              });
            }
          });
        
      }
    );
  
    router.get("/getTrainer", passport.authenticate("local.trainer"), function (req, res) {
      if (req.user) {
        var centers = {};
        //var subjects =[];
        var center = {};
        var subjects = {};
        // console.log(" type " + req.user.type);
        console.log(" id " + req.user.id);
        
            sendTrainer(req.user.id, null, req, res);
            
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Unknown trainer",
          })
        );
      }
    });



    //////////////////////////// Train Start //////////////////////////////////////////////////


    router.post(
      "/registerTrain",
      function (req, res) {
        console.log("Register Train Start");
        var userId = req.body.userId;
        var trainerId = req.body.trainerId;
    
        //Validation
    
        
            var newTrain = {
              userId: userId,
              trainerId: trainerId
            };
          
    
            Train.createTrain(newTrain, function (err, train) {
            if (err) {
              console.log("errors" + err.message);
              res.status(403).json({
                type : 'error',
                message:  err.message
              });
              return;
            } else {
              console.log(train);
              res.status(200).json({
                type : 'done',
                train: train
              });
            }
          });
        
      }
    );
  
    router.post("/getTrainByUserId", function (req, res) {
      if (req.body) {
        var userId = req.body.userId
        // var trainerId = req.body.trainerId
        // console.log(" type " + req.user.type);
        console.log(" id " + userId);
        
        Train.getTrainByUserId(userId, function (err, train) {
          if (err) {
            console.log("errors" + err.message);
            res.status(403).json({
              type : 'error',
              message:  'error occured '
            });
            return;
          } else {
            console.log(train);
            res.status(200).json({
              type : 'done',
              train: train
            });
          }
        });
            
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Unknown train",
          })
        );
      }
    });

    router.post("/getTrainByTrainerId", function (req, res) {
      if (req.body) {
        var trainerId = req.body.trainerId
        // var trainerId = req.body.trainerId
        // console.log(" type " + req.user.type);
        console.log(" id " + trainerId);
        
        Train.getTrainByTrainerId(trainerId, function (err, train) {
          if (err) {
            console.log("errors" + err.message);
            res.status(403).json({
              type : 'error',
              message:  'error occured '
            });
            return;
          } else {
            console.log(train);
            res.status(200).json({
              type : 'done',
              train: train
            });
          }
        });
            
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Unknown train",
          })
        );
      }
    });


    ////////////////////////////// Usage Start /////////////////////////////////////////////////


    router.post(
      "/registerUsage",
      function (req, res) {
        console.log("Register Usage Start");
        var userId = req.body.userId;
        var usageData = req.body.usageData;
        var status = req.body.status;
        var average = req.body.average;
        var time = req.body.time;
    
        //Validation
    
        
            var newUsage = {
              userId: userId,
              usageData: usageData,
              status: status,
              average: average,
              time: time
            };
          
    
            Usage.createUsage(newUsage, function (err, usage) {
            if (err) {
              console.log("errors" + err.message);
              res.status(403).json({
                type : 'error',
                message:  err.message
              });
              return;
            } else {
              console.log(usage);
              res.status(200).json({
                type : 'done',
                usage: usage
              });
            }
          });
        
      }
    );
  
    router.post("/getUsageByUserId", function (req, res) {
      if (req.body) {
        var userId = req.body.userId
        // var trainerId = req.body.trainerId
        // console.log(" type " + req.user.type);
        console.log(" id " + userId);
        
        Usage.getUsageByUserId(userId, function (err, usage) {
          if (err) {
            console.log("errors" + err.message);
            res.status(403).json({
              type : 'error',
              message:  'error occured '
            });
            return;
          } else {
            console.log(usage);
            res.status(200).json({
              type : 'done',
              usage: usage
            });
          }
        });
            
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Unknown usage",
          })
        );
      }
    });

module.exports = router;
