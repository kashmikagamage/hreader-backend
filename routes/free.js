const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportInit = require("../auth/passport");

var User = require("../logic/user");

passportInit();



router.post("/login", passport.authenticate("local.user"), function (req, res) {
  if (req.user) {
    var centers = {};
    //var subjects =[];
    var center = {};
    var subjects = {};
    console.log(" all " + JSON.stringify(req.user));
    console.log(" type " + req.user.type);

    res.setHeader("Content-Type", "application/json");

    res.end(
      JSON.stringify({
        id: req.user.id,
        nic: req.user.nic,
        username: req.user.username,
        telno: req.user.telno,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        address: req.user.address,
        status: req.user.status,
        type: req.user.type,
        token: req.user.token,

      })
    );
        // sendUser(req.user.id, null, req, res);
        
        
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown user",
      })
    );
  }
});

function sendUser(id, req, res) {
  User.getUserById(id, function (err, user) {
    res.setHeader("Content-Type", "application/json");

    res.end(
      JSON.stringify({
        id: user.id,
        nic: user.nic,
        username: user.username,
        telno: user.telno,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        status: user.status,
        type: user.type,
        token: user.token,
        yuguyg: "sdhjfiusd",

      })
    );
  });
  }


  router.post(
    "/register",
    function (req, res) {
      console.log("Register USer Start");
      var password = req.body.password;
      var fname = req.body.fname;
      var lname = req.body.lname;
      var address = req.body.address;
      var nic = req.body.nic;
      var tel = req.body.tel;
      var status = req.body.status;
      var type = req.body.type;
  
      //Validation
  
      
          var newUser = {
            nic: nic,
            password: password,
            firstname: fname,
            lastname: lname,
            address: address,
            telno: tel,
            status: status,
            type: type,
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
    if (req.body) {
      var centers = {};
      //var subjects =[];
      var center = {};
      var subjects = {};
      console.log(" id " + req.body.id);
      sendUser(req.body.id, req, res);
      
          
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown user",
        })
      );
    }
  });
module.exports = router;
