var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var session = require("express-session");
var passport = require("passport");
var cors = require('cors')
var LocalStrategy = require("passport-local"),
  Strategy;

const passportJWTInit = require("./auth/passport_jwt");

//Database
var db = require("./config/database");

//Test Database
db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// var routes = require("./routes/index");
var users = require("./routes/users");
var trainers = require("./routes/trainers");
var api = require("./routes/api");
// var lgo = require("./routes/lgo");
// var auth = require("./routes/auth");
// var parent = require("./routes/parent");
// var admin =  require("./routes/admin");
//Init App
var app = express();

//View Engine
// app.set("views", path.join(__dirname, "views"));

// app.set("view engine", "handlebars");

//Handelbar Helpers

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "layout",
  })
);

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(cors())

//Passport Init
app.use(passport.initialize());
app.use(passport.session());
passportJWTInit();
//Express Validater

// app.use(
//   expressValidator({
//     errorFormatter: function(param, msg, value) {
//       var namespace = param.split("."),
//         root = namespace.shift(),
//         formParam = root;

//       while (namespace.length) {
//         formParam += "[" + namespace.shift() + "]";
//       }
//       return {
//         param: formParam,
//         msg: msg,
//         value: value
//       };
//     }
//   })
// );



// app.use("/", routes);
// app.use("/users", users);
app.use("/trainers",passport.authenticate("Trainer", { session: false }), trainers);
app.use("/users",passport.authenticate("User", { session: false }), users);
app.use("/api", api);
// app.use("/parent", passport.authenticate("Parent", { session: false }), parent);
// app.use("/auth", auth);
// app.use("/lgo", lgo);
// app.use("/admin", passport.authenticate("User", { session: false }), admin);

//Set Port
app.set("port", process.env.PORT || 3005);

app.listen(app.get("port"), function () {
  console.log("Server start on port " + app.get("port"));
});