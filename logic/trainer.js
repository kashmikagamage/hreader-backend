const bcrypt = require("bcryptjs");
const saltRounds = 10;
var Trainer = require("../models/trainer");


module.exports.createTrainer = function (newTrainer, callback) {
  console.log("Create Trainer");
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(newTrainer.password, salt, function (err, hash) {
      newTrainer.password = hash;
      console.log(newTrainer);

      Trainer.create(newTrainer)
        .then((trainer) => {
          callback(null, trainer);
        })
        .catch((err) => {
          callback(err);
        });
    });
  });
};


module.exports.updatePasssword = function (id, newPassword, callback) {
  console.log("Update Trainer");
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(newPassword, salt, function (err, hash) {
      // newUser.password = hash;
      console.log(hash);

      Trainer.update(
        {
          password: hash,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then((trainer) => {
          callback(null, trainer);
        })
        .catch((err) => {
          callback(err);
        });
    });
  });
};

// module.exports.updateRefreshToken = function (id, refreshToken, callback) {
//   console.log("Create Trainer");
//       Trainer.update(
//         {
//           refreshToken: refreshToken,
//         },
//         {
//           where: {
//             id: id,
//           },
//         }
//       )
//         .then((Trainer) => {
//           callback(null, Trainer);
//         })
//         .catch((err) => {
//           callback(err);
//         });
    
// };

module.exports.getTrainerByTrainername = function (nic, callback) {
  var query = { nic: nic, status: "Active" };
  //User.findOne(query,callback);
  Trainer.findOne({
    where: query,
  }).then((trainer) => {
    //console.log(user)
    callback(null, trainer);
  });
};
module.exports.getTrainerByNIC = function (nic, callback) {
  var query = { nic: nic };
  //User.findOne(query,callback);
  Trainer.findOne({
    where: query,
  }).then((trainer) => {
    //console.log(user)
    callback(null, trainer);
  });
};

module.exports.getTrainerById = function (id, callback) {
    Trainer.findOne({
    where: { id: id, status: "Active" },
  }).then((trainer) => {
    console.log("usergddfgdf")
    console.log(trainer)
    callback(null, trainer);
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, res) {
    if (err) throw err;
    //console.log(err+" "+candidatePassword+" "+res+" "+hash)
    callback(null, res);
  });
};

module.exports.updateTrainer = function (id, newTrainer, callback) {
  console.log("Update Trainer");

  // newUser.password = hash;

  Trainer.update(newTrainer, {
    where: {
      id: id,
    },
  })
    .then((trainer) => {
      callback(null, trainer);
    })
    .catch((err) => {
      callback(err);
    });
};

module.exports.getTrainersAdmin = function ( callback) {
    Trainer.findAll()
    .then((trainer) => {
      callback(null, trainer);
    })
    .catch((err) => {
      callback(err);
    });
};

// module.exports.getTeachersAdmin = function ( callback) {
//   User.findAll({
//     where:{type: "Teacher"},
//     attributes: [
//       `id`,
//       `nic`,
//       `telno`,
//       `firstname`,
//       `lastname`,
//       `address`,
//       `status`,
//       `type`,
//     ],
//   })
//     .then((users) => {
//       callback(null, users);
//     })
//     .catch((err) => {
//       callback(err);
//     });
// };