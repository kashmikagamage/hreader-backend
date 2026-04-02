var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var cors = require('cors');
var rateLimit = require('express-rate-limit');
require("dotenv").config();

const passportJWTInit = require("./auth/passport_jwt");

//Database
var db = require("./config/database");

db.authenticate()
  .then(() => console.log("Database connection established."))
  .catch((err) => console.error("Database connection error:", err));

var users = require("./routes/users");
var trainers = require("./routes/trainers");
var api = require("./routes/api");

var app = express();

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Single cookieParser instance
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Express Session — saveUninitialized:false avoids creating sessions for unauthenticated requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

//Security Headers
app.use((req, res, next) => {
  // Prevent embedding in iframes (Clickjacking)
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; frame-ancestors 'none'");
  res.setHeader("X-Frame-Options", "DENY");
  // Prevent MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Legacy XSS filter (modern browsers use CSP instead)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // HSTS: force HTTPS for 1 year in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  // Limit information sent in Referer header
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Disable access to sensitive browser features
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  // Hide Express fingerprint
  res.removeHeader("X-Powered-By");
  next();
});

//Global Input Sanitization — detects and blocks obvious injection patterns
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (let key in req.body) {
      const value = req.body[key];
      if (typeof value === 'string') {
        if (/<script|<iframe|<img|javascript:|onerror|onload|onclick/i.test(value)) {
          return res.status(400).json({
            error: `Field "${key}" contains malicious content.`
          });
        }
      }
    }
  }
  next();
});

//Passport Init
app.use(passport.initialize());
app.use(passport.session());
passportJWTInit();

// Rate limiting: max 10 login attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again after 15 minutes." },
});

app.use("/api/loginTrainer", loginLimiter);
app.use("/api/loginUser", loginLimiter);

app.use("/trainers", passport.authenticate("Trainer", { session: false }), trainers);
app.use("/users", passport.authenticate("User", { session: false }), users);
app.use("/api", api);

//Set Port
app.set("port", process.env.PORT || 3005);

app.listen(app.get("port"), function () {
  console.log("Server running on port " + app.get("port"));
});
