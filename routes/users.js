const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportInit = require("../auth/passport");
const { validateNumeric, validateText, validateEmail, handleValidationErrors, body } = require("../utils/validators");

var User = require("../logic/user");

passportInit();


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

      })
    );
  });
  }


  router.get("/getUsers", function (req, res) {
    if (req.user) {
      var centers = {};
      //var subjects =[];
      var center = {};
      var subjects = {};
      console.log(" id " + req.user.id);
      sendUser(req.user.id, req, res);
      
          
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
