const bcrypt = require("bcryptjs");
const saltRounds = 10;
var User = require("../models/user");


module.exports.createUser = function (newUser, callback) {
  console.log("Create user");
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      //console.log(newUser);

      User.create(newUser)
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    });
  });
};


module.exports.updatePasssword = function (id, newPassword, callback) {
  console.log("Create user");
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(newPassword, salt, function (err, hash) {
      // newUser.password = hash;
      console.log(hash);

      User.update(
        {
          password: hash,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    });
  });
};

module.exports.updateRefreshToken = function (id, refreshToken, callback) {
  console.log("Create user");
      User.update(
        {
          refreshToken: refreshToken,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    
};

module.exports.getUserByUsername = function (nic, callback) {
  var query = { nic: nic, status: "Active" };
  //User.findOne(query,callback);
  User.findOne({
    where: query,
  }).then((user) => {
    //console.log(user)
    callback(null, user);
  });
};
module.exports.getTeacherByNIC = function (nic, callback) {
  var query = { nic: nic, type: "Teacher" };
  //User.findOne(query,callback);
  User.findOne({
    where: query,
  }).then((user) => {
    //console.log(user)
    callback(null, user);
  });
};

module.exports.getUserById = function (id, callback) {
  User.findOne({
    where: { id: id, status: "Active" },
  }).then((user) => {
    console.log("usergddfgdf")
    console.log(user)
    callback(null, user);
  });
};
async function getTeacher(id) { }

// module.exports.getTeacherById = function (id, callback) {
//   var newTeacher = {};
//   var newCenters = [];
//   User.findOne({
//     where: { id: id },
//     include: [
//       { model: Class, include: [{ model: Center }, { model: Subject }] },
//     ],
//     group: ["classes.centerId"],
//   }).then((teacher) => {
//     //console.log(JSON.stringify({teacher}))

//     Object.assign(newTeacher, teacher.toJSON());
//     // var newCenter = {};
//     // var newSubject = [];
//     // newTeacher.classes.forEach(clz => {

//     //     if (!newCenters[clz.center.id]) {
//     //         Object.assign(centers, { [clz.center.id]: (clz.center.toJSON()) })
//     //         //Object.assign(subjects, { [clz.center.id]: (clz.center.toJSON()) });
//     //         //Object.assign(centers[clz.center.id],{"subject":""} );
//     //     }

//     // });

//     delete newTeacher.classes;
//     var size = Object.keys(teacher.classes).length;
//     //console.log(size)
//     teacher.classes.forEach((clz) => {
//       Center.findOne({
//         include: [
//           {
//             model: Class,
//             include: [Subject],
//             where: {
//               centerId: [clz.centerId],
//               teacherId: [clz.teacherId],
//               state: "Active",
//             },
//           },
//           { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//         ],
//       }).then((center) => {
//         //console.log(JSON.stringify({center}))

//         var newCenter = {};
//         Object.assign(newCenter, center.toJSON());
//         delete newCenter.classes;
//         Object.assign(newCenter, {
//           expireDate: center.subscriptions[0]
//             ? center.subscriptions[0].ExpireDate
//             : new Date().toISOString().slice(0, 10).toString(),
//         });
//         var expireDate = moment(newCenter.expireDate).add(1, "months");
//         var today = moment(new Date().toISOString().slice(0, 10).toString());
//         delete newCenter.subscriptions;
//         if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//           size = size - 1;
//           Object.assign(newCenter, { isTerminated: true });
//           newCenters.push(newCenter);
//         } else {
//           //Object.assign(newTeacher,{"center":newSubject})
//           var newSubject = [];
//           center.classes.forEach((clz) => {
//             //     var newSub={}
//             //     Object.assign(newSub,sub.toJSON())
//             //     delete newSub.classes
//             newSubject.push(clz.subject);
//             // console.log(JSON.stringify({newSubject}))
//           });
//           size = size - 1;
//           Object.assign(newCenter, { subjects: newSubject });
//           // Object.assign(newTeacher, { "centers": " " })
//           //Object.assign(newCenters, { [newCenter.id]: newCenter })
//           newCenters.push(newCenter);
//           //console.log(size)
//           //console.log(JSON.stringify({ newTeacher }))
//         }
//         if (size == 0) {
//           callback(newCenters);
//         }
//       });
//       // Class.findAll({where:{centerId:[clz.centerId],teacherId:[clz.teacherId]},include:[Subject]}).then(subject=>{
//       //     console.log(JSON.stringify({subject}))
//       // })
//     });
//     console.log("");
//     console.log(JSON.stringify({ newTeacher }));
//     console.log("");
//   });

//   // User.findByPk(id).then(user => {
//   //     callback(null, user)
//   // });
// };

// module.exports.getOwnerById = function (id, callback) {
//   console.log("getting Owner");
//   var newCenters = [];
//   Center.findAll({
//     where: { ownerId: id },
//     include: [
//       { model: Class, include: [{ model: User }, { model: Subject }] },
//       { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//     ],
//   }).then((centers) => {
//     centers.forEach((center) => {
//       var newCenter = {
//         id: center.id,
//         Name: center.Name,
//         Address: center.Address,
//         TelNo: center.TelNo,
//         ownerId: center.ownerId,
//         expireDate: center.subscriptions
//           ? center.subscriptions[0].ExpireDate
//           : new Date().toISOString().slice(0, 10).toString,
//       };

//       var expireDate = moment(newCenter.expireDate).add(1, "months");
//       var today = moment(new Date().toISOString().slice(0, 10).toString());
//       if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//         Object.assign(newCenter, { isTerminated: true });
//         newCenters.push(newCenter);
//         return;
//       }
//       var newSubjects = [];
//       //console.log(JSON.stringify({ center }))
//       var subjects = jsonQuery(["classes[*subjectId]"], { data: center }).value;
//       var newSubId = [...new Set(subjects)];
//       //console.log(JSON.stringify({ newSubId }))
//       newSubId.forEach((clz) => {
//         var newSubject = {};
//         var newTeachers = [];

//         var classs = jsonQuery(["classes[*subjectId=?]", clz], { data: center })
//           .value;
//         //console.log(JSON.stringify({ classs }))
//         Object.assign(newSubject, classs[0].subject.toJSON());
//         classs.forEach((json) => {
//           var newTeacher = {};
//           Object.assign(newTeacher, json.user.toJSON());
//           delete newTeacher.password;
//           newTeachers.push(newTeacher);
//         });
//         Object.assign(newSubject, { teachers: newTeachers });
//         newSubjects.push(newSubject);
//       });
//       Object.assign(newCenter, { subjects: newSubjects });

//       newCenters.push(newCenter);
//     });
//     //console.log(JSON.stringify({ newCenters }))
//     callback(newCenters);
//   });
// };
// module.exports.getAdmin = function (callback) {
//   console.log("getting Admin");
//   var newCenters = [];
//   Center.findAll({
//     include: [
//       { model: Class, include: [{ model: User }, { model: Subject }] },
//       { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//     ],
//   }).then((centers) => {
//     centers.forEach((center) => {
//       var newCenter = {
//         id: center.id,
//         Name: center.Name,
//         Address: center.Address,
//         TelNo: center.TelNo,
//         ownerId: center.ownerId,
//         expireDate: center.subscriptions
//           ? center.subscriptions[0].ExpireDate
//           : new Date().toISOString().slice(0, 10).toString,
//       };

//       var expireDate = moment(newCenter.expireDate).add(1, "months");
//       var today = moment(new Date().toISOString().slice(0, 10).toString());
//       if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//         Object.assign(newCenter, { isTerminated: true });
//         newCenters.push(newCenter);
//         return;
//       }
//       var newSubjects = [];
//       //console.log(JSON.stringify({ center }))
//       var subjects = jsonQuery(["classes[*subjectId]"], { data: center }).value;
//       var newSubId = [...new Set(subjects)];
//       //console.log(JSON.stringify({ newSubId }))
//       newSubId.forEach((clz) => {
//         var newSubject = {};
//         var newTeachers = [];

//         var classs = jsonQuery(["classes[*subjectId=?]", clz], { data: center })
//           .value;
//         //console.log(JSON.stringify({ classs }))
//         Object.assign(newSubject, classs[0].subject.toJSON());
//         classs.forEach((json) => {
//           var newTeacher = {};
//           Object.assign(newTeacher, json.user.toJSON());
//           delete newTeacher.password;
//           newTeachers.push(newTeacher);
//         });
//         Object.assign(newSubject, { teachers: newTeachers });
//         newSubjects.push(newSubject);
//       });
//       Object.assign(newCenter, { subjects: newSubjects });

//       newCenters.push(newCenter);
//     });
//     //console.log(JSON.stringify({ newCenters }))
//     callback(newCenters);
//   });
// };

// module.exports.getTeacherByIdV1 = function (id, callback) {
//   var newTeacher = {};
//   var newCenters = [];
//   User.findOne({
//     where: { id: id },
//     include: [
//       { model: Class, include: [{ model: Center }, { model: Subject }] },
//     ],
//     group: ["classes.centerId"],
//   }).then((teacher) => {
//     //console.log(JSON.stringify({teacher}))

//     Object.assign(newTeacher, teacher.toJSON());
//     // var newCenter = {};
//     // var newSubject = [];
//     // newTeacher.classes.forEach(clz => {

//     //     if (!newCenters[clz.center.id]) {
//     //         Object.assign(centers, { [clz.center.id]: (clz.center.toJSON()) })
//     //         //Object.assign(subjects, { [clz.center.id]: (clz.center.toJSON()) });
//     //         //Object.assign(centers[clz.center.id],{"subject":""} );
//     //     }

//     // });

//     delete newTeacher.classes;
//     var size = Object.keys(teacher.classes).length;
//     //console.log(size)
//     teacher.classes.forEach((clz) => {
//       Center.findOne({
//         include: [
//           {
//             model: Class,
//             include: [Subject],
//             where: {
//               centerId: [clz.centerId],
//               teacherId: [clz.teacherId],
//               state: "Active",
//             },
//           },
//           { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//         ],
//       }).then((center) => {
//         //console.log(JSON.stringify({center}))

//         var newCenter = {};
//         Object.assign(newCenter, center.toJSON());
//         delete newCenter.classes;
//         Object.assign(newCenter, {
//           expireDate: center.subscriptions[0]
//             ? center.subscriptions[0].ExpireDate
//             : new Date().toISOString().slice(0, 10).toString(),
//         });
//         var expireDate = moment(newCenter.expireDate).add(1, "months");
//         var today = moment(new Date().toISOString().slice(0, 10).toString());
//         delete newCenter.subscriptions;
//         if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//           size = size - 1;
//           Object.assign(newCenter, { isTerminated: true });
//           newCenters.push(newCenter);
//         } else {
//           //Object.assign(newTeacher,{"center":newSubject})
//           var newSubject = [];
//           center.classes.forEach((clz) => {
//             //     var newSub={}
//             //     Object.assign(newSub,sub.toJSON())
//             //     delete newSub.classes
//             newSubject.push(clz.subject);
//             // console.log(JSON.stringify({newSubject}))
//           });
//           size = size - 1;
//           Object.assign(newCenter, { subject: newSubject });
//           // Object.assign(newTeacher, { "centers": " " })
//           //Object.assign(newCenters, { [newCenter.id]: newCenter })
//           newCenters.push(newCenter);
//           //console.log(size)
//           //console.log(JSON.stringify({ newTeacher }))
//         }
//         if (size == 0) {
//           callback(newCenters);
//         }
//       });
//       // Class.findAll({where:{centerId:[clz.centerId],teacherId:[clz.teacherId]},include:[Subject]}).then(subject=>{
//       //     console.log(JSON.stringify({subject}))
//       // })
//     });
//     console.log("");
//     console.log(JSON.stringify({ newTeacher }));
//     console.log("");
//   });

//   // User.findByPk(id).then(user => {
//   //     callback(null, user)
//   // });
// };

// module.exports.getOwnerByIdV1 = function (id, callback) {
//   console.log("getting Owner");
//   var newCenters = [];
//   Center.findAll({
//     where: { ownerId: id },
//     include: [
//       { model: Class, include: [{ model: User }, { model: Subject }] },
//       { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//     ],
//   }).then((centers) => {
//     centers.forEach((center) => {
//       var newCenter = {
//         id: center.id,
//         Name: center.Name,
//         Address: center.Address,
//         TelNo: center.TelNo,
//         ownerId: center.ownerId,
//         expireDate: center.subscriptions
//           ? center.subscriptions[0].ExpireDate
//           : new Date().toISOString().slice(0, 10).toString,
//       };

//       var expireDate = moment(newCenter.expireDate).add(1, "months");
//       var today = moment(new Date().toISOString().slice(0, 10).toString());
//       if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//         Object.assign(newCenter, { isTerminated: true });
//         newCenters.push(newCenter);
//         return;
//       }
//       var newSubjects = [];
//       //console.log(JSON.stringify({ center }))
//       var subjects = jsonQuery(["classes[*subjectId]"], { data: center }).value;
//       var newSubId = [...new Set(subjects)];
//       //console.log(JSON.stringify({ newSubId }))
//       newSubId.forEach((clz) => {
//         var newSubject = {};
//         var newTeachers = [];

//         var classs = jsonQuery(["classes[*subjectId=?]", clz], { data: center })
//           .value;
//         //console.log(JSON.stringify({ classs }))
//         Object.assign(newSubject, classs[0].subject.toJSON());
//         classs.forEach((json) => {
//           var newTeacher = {};
//           Object.assign(newTeacher, json.user.toJSON());
//           delete newTeacher.password;
//           newTeachers.push(newTeacher);
//         });
//         Object.assign(newSubject, { teacher: newTeachers });
//         newSubjects.push(newSubject);
//       });
//       Object.assign(newCenter, { subject: newSubjects });

//       newCenters.push(newCenter);
//     });
//     //console.log(JSON.stringify({ newCenters }))
//     callback(newCenters);
//   });
// };
// module.exports.getAdminV1 = function (callback) {
//   console.log("getting Admin");
//   var newCenters = [];
//   Center.findAll({
//     include: [
//       { model: Class, include: [{ model: User }, { model: Subject }] },
//       { model: Subscription, limit: 1, order: [["CreatedAt", "DESC"]] },
//     ],
//   }).then((centers) => {
//     centers.forEach((center) => {
//       var newCenter = {
//         id: center.id,
//         Name: center.Name,
//         Address: center.Address,
//         TelNo: center.TelNo,
//         ownerId: center.ownerId,
//         expireDate: center.subscriptions
//           ? center.subscriptions[0].ExpireDate
//           : new Date().toISOString().slice(0, 10).toString,
//       };

//       var expireDate = moment(newCenter.expireDate).add(1, "months");
//       var today = moment(new Date().toISOString().slice(0, 10).toString());
//       if (today.isAfter(expireDate.format("YYYY-MM-DD"), "day")) {
//         Object.assign(newCenter, { isTerminated: true });
//         newCenters.push(newCenter);
//         return;
//       }
//       var newSubjects = [];
//       //console.log(JSON.stringify({ center }))
//       var subjects = jsonQuery(["classes[*subjectId]"], { data: center }).value;
//       var newSubId = [...new Set(subjects)];
//       //console.log(JSON.stringify({ newSubId }))
//       newSubId.forEach((clz) => {
//         var newSubject = {};
//         var newTeachers = [];

//         var classs = jsonQuery(["classes[*subjectId=?]", clz], { data: center })
//           .value;
//         //console.log(JSON.stringify({ classs }))
//         Object.assign(newSubject, classs[0].subject.toJSON());
//         classs.forEach((json) => {
//           var newTeacher = {};
//           Object.assign(newTeacher, json.user.toJSON());
//           delete newTeacher.password;
//           newTeachers.push(newTeacher);
//         });
//         Object.assign(newSubject, { teacher: newTeachers });
//         newSubjects.push(newSubject);
//       });
//       Object.assign(newCenter, { subject: newSubjects });

//       newCenters.push(newCenter);
//     });
//     //console.log(JSON.stringify({ newCenters }))
//     callback(newCenters);
//   });
// };
module.exports.getWorkerById = function (id, callback) {
  User.findByPk(id).then((user) => {
    callback(null, user);
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, res) {
    if (err) throw err;
    //console.log(err+" "+candidatePassword+" "+res+" "+hash)
    callback(null, res);
  });
};
module.exports.getEmployeesByOwnerId = function (id, callback) {
  User.findAll({
    where: { employeeId: id },
    attributes: [
      `id`,
      `nic`,
      `telno`,
      `firstname`,
      `lastname`,
      `address`,
      `status`,
      `type`,
    ],
  })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    });
};

module.exports.updateUser = function (id, newUser, callback) {
  console.log("Update user");

  // newUser.password = hash;

  User.update(newUser, {
    where: {
      id: id,
    },
  })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    });
};

// module.exports.createOwner = async function (newUser, newCenter, callback) {
//   bcrypt.genSalt(saltRounds, async function (err, salt) {
//     bcrypt.hash(newUser.password, salt, async function (err, hash) {
//       Object.assign(newUser, { password: hash });
//       // console.log(newUser);

//       try {

//         const result = await db.transaction(async (t) => {

//           const user = await User.create(newUser, { transaction: t });
//           Object.assign(newCenter, { ownerId: user.id });
//           const center = await Center.create(newCenter, { transaction: t });

//           var subscription = {
//             ExpireDate: moment().endOf('month').format('YYYY-MM-DD'),
//             centerId: center.id
//           };

//           await Subscription.create(subscription, { transaction: t });

//           return user;

//         });

//         callback(null, {
//           nic: newUser.nic,
//           firstname: newUser.fname,
//           lastname: newUser.lname,
//           address: newUser.address,
//           telno: newUser.tel,
//         })

//       } catch (error) {
//         console.log(error);
//         callback(error)
//       }
//     });
//   });

// }

module.exports.getUsersAdmin = function ( callback) {
  User.findAll({
    attributes: [
      `id`,
      `nic`,
      `telno`,
      `firstname`,
      `lastname`,
      `address`,
      `status`,
      `type`,
    ],
  })
    .then((users) => {
      callback(null, users);
    })
    .catch((err) => {
      callback(err);
    });
};

module.exports.getTeachersAdmin = function ( callback) {
  User.findAll({
    where:{type: "Teacher"},
    attributes: [
      `id`,
      `nic`,
      `telno`,
      `firstname`,
      `lastname`,
      `address`,
      `status`,
      `type`,
    ],
  })
    .then((users) => {
      callback(null, users);
    })
    .catch((err) => {
      callback(err);
    });
};