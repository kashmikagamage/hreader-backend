const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportInit = require("../auth/passport");
const { validateNumeric, validateText, validateEmail, validatePassword, handleValidationErrors, body } = require("../utils/validators");

var Trainer = require("../logic/trainer");

passportInit();


function sendTrainer(id,  req, res) {
    Trainer.getTrainerById(id, function (centers) {
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
          })
        );
      });
    }


  router.get("/getTrainer", function (req, res) {
    if (req.user) {
      var centers = {};
      //var subjects =[];
      var center = {};
      var subjects = {};
      console.log(" id " + req.user.id);
      sendTrainer(req.user.id, req, res);
      
          
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown Trainer",
        })
      );
    }
  });
module.exports = router;
