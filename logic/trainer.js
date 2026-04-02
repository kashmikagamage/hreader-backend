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

module.exports.getTrainerByGoogleId = function (googleId, callback) {
  Trainer.findOne({ where: { googleId } })
    .then(trainer => callback(null, trainer))
    .catch(err => callback(err));
};

module.exports.linkGoogleAccount = function (trainerId, googleId, email, callback) {
  Trainer.update({ googleId, email }, { where: { id: trainerId } })
    .then(result => callback(null, result))
    .catch(err => callback(err));
};

module.exports.unlinkGoogleAccount = function (trainerId, callback) {
  Trainer.update({ googleId: null, email: null }, { where: { id: trainerId } })
    .then(result => callback(null, result))
    .catch(err => callback(err));
};

module.exports.findOrCreateByGoogle = function (profile, callback) {
  const googleId = profile.id;
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const firstname = (profile.name && profile.name.givenName) || 'Unknown';
  const lastname = (profile.name && profile.name.familyName) || 'Unknown';

  // First try to find by googleId
  Trainer.findOne({ where: { googleId } })
    .then(trainer => {
      if (trainer) return callback(null, trainer);

      // Try to find by email to link accounts
      if (!email) return callback(new Error('No email from Google profile'));

      Trainer.findOne({ where: { email } })
        .then(existing => {
          if (existing) {
            // Link the Google account to the existing trainer
            return existing.update({ googleId })
              .then(updated => callback(null, updated))
              .catch(err => callback(err));
          }

          // Create a new trainer with Google profile data
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(require('crypto').randomBytes(32).toString('hex'), salt, function (err, hash) {
              Trainer.create({
                googleId,
                email,
                firstname,
                lastname,
                nic: 'GOOGLE_' + googleId,
                password: hash,
                telno: '0000000000',
                address: 'Not provided',
                gender: 'Not specified',
                status: 'Active',
                workplace: 'Not provided'
              })
                .then(newTrainer => callback(null, newTrainer))
                .catch(err => callback(err));
            });
          });
        })
        .catch(err => callback(err));
    })
    .catch(err => callback(err));
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