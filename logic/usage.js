
var Usage = require("../models/usage");


module.exports.createUsage = function (newUsage, callback) {
  console.log("Create Usage");
      console.log(newUsage);

      Usage.create(newUsage)
        .then((usage) => {
          callback(null, usage);
        })
        .catch((err) => {
          callback(err);
        });
    
};

module.exports.getUsageByUserId = function (userId, callback) {
    var query = { userId: userId };
    //User.findOne(query,callback);
    Usage.findAll({
      where: query,
      order: [
        [ 'createdAt', 'DESC'],
      ]
    }).then((usage) => {
      //console.log(user)
      callback(null, usage);
    });
  };

  module.exports.getUsageByStatus = function (status, callback) {
    var query = { status: status };
    //User.findOne(query,callback);
    Usage.findAll({
      where: query,
    }).then((usage) => {
      //console.log(user)
      callback(null, usage);
    });
  };


  module.exports.getUsageByDate = function (date, callback) {
    //User.findOne(query,callback);
    Usage.findAll({
      where: {
        CreatedAt: {
            [Op.like]: date+'%',   
        }
      },
    }).then((usage) => {
      //console.log(user)
      callback(null, usage);
    });
  };
  
//   module.exports.getTrainByTrainerIdAndUserId = function (trainerId, userId, callback) {
//     var query = { userId: userId , trainerId: trainerId };
//     //User.findOne(query,callback);
//     Train.findOne({
//       where: query,
//     }).then((train) => {
//       //console.log(user)
//       callback(null, train);
//     });
//   };

module.exports.deleteUsage = function (id, callback) {
  console.log("Delete Usage");
  // newUser.password = hash;
  Usage.destroy({
    where: {
      id: id,
    },
  })
    .then((usage) => {
      callback(null, usage);
    })
    .catch((err) => {
      callback(err);
    });
};

