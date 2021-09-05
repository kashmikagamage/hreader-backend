
var Train = require("../models/train");


module.exports.createTrain = function (newTrain, callback) {
  console.log("Create Trainer");
      console.log(newTrain);

      Train.create(newTrain)
        .then((train) => {
          callback(null, train);
        })
        .catch((err) => {
          callback(err);
        });
    
};


module.exports.getTrainByTrainerId = function (trainerId, callback) {
  var query = { trainerId: trainerId };
  //User.findOne(query,callback);
  Train.findAll({
    where: query,
  }).then((train) => {
    //console.log(user)
    callback(null, train);
  });
};

module.exports.getTrainByUserId = function (userId, callback) {
    var query = { userId: userId };
    //User.findOne(query,callback);
    Train.findAll({
      where: query,
    }).then((train) => {
      //console.log(user)
      callback(null, train);
    });
  };
  
  module.exports.getTrainByTrainerIdAndUserId = function (trainerId, userId, callback) {
    var query = { userId: userId , trainerId: trainerId };
    //User.findOne(query,callback);
    Train.findOne({
      where: query,
    }).then((train) => {
      //console.log(user)
      callback(null, train);
    });
  };

// module.exports.getTrainerByNIC = function (nic, callback) {
//   var query = { nic: nic };
//   //User.findOne(query,callback);
//   Trainer.findOne({
//     where: query,
//   }).then((trainer) => {
//     //console.log(user)
//     callback(null, trainer);
//   });
// };

module.exports.deleteTrain = function (id, callback) {
  console.log("Delete Train");
  // newUser.password = hash;
  Train.destroy({
    where: {
      id: id,
    },
  })
    .then((train) => {
      callback(null, train);
    })
    .catch((err) => {
      callback(err);
    });
};

