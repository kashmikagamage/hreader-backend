const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportInit = require("../auth/passport");
const { validateNumeric, validateText, validateEmail, validatePassword, handleValidationErrors, body } = require("../utils/validators");
const { setSecureAuthCookie, clearAuthCookie } = require("../utils/cookieHelper");
const { createSession, invalidateSession, invalidateAllUserSessions, invalidateAllTrainerSessions, getUserSessions, getTrainerSessions, cleanupExpiredSessions, validateSession } = require("../utils/sessionManager");

var User = require("../logic/user");
var Trainer = require("../logic/trainer");
var Train = require("../logic/train");
var Usage = require("../logic/usage");

passportInit();

// Middleware: validates the httpOnly auth cookie on every call.
// Populates req.trainerId so route handlers can trust it.
const requireTrainerAuth = async (req, res, next) => {
  const token = req.cookies.authToken;
  const sessionId = req.cookies.sessionId;

  if (!token || !sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionData = await validateSession(token, sessionId);
  if (!sessionData || !sessionData.trainerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.trainerId = sessionData.trainerId;
  next();
};

router.post("/loginUser",
  validateText('username', 5, 50),
  handleValidationErrors,
  passport.authenticate("local.user"),
  function (req, res) {
    if (req.user) {
      var centers = {};
      //var subjects =[];
      var center = {};
      var subjects = {};
      console.log(" type " + req.user.type);

      sendUser(req.user.id, null, req, res);

    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown user",
        })
      );
    }
  }
);

function sendUser(id, type, req, res) {
  User.getUserById(id, function (centers) {
    console.log(JSON.stringify(type));

    // Create a new session (invalidates all previous sessions)
    createSession({
      userId: req.user.id,
      trainerId: null,
      userAgent: req.get('user-agent') || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
      userType: 'user'
    }).then(sessionData => {
      // Set httpOnly cookie with session token
      setSecureAuthCookie(res, sessionData.token, 'authToken');

      // Also set session ID cookie for tracking
      res.cookie('sessionId', sessionData.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        id: req.user.id,
        nic: req.user.nic,
        telno: req.user.telno,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        address: req.user.address,
        gender: req.user.gender,
        status: req.user.status,
        height: req.user.height,
        weight: req.user.weight,
        sessionCreated: sessionData.expiresAt
      });
    }).catch(err => {
      console.error('Session creation error:', err);
      res.status(500).json({ error: 'Session creation failed' });
    });
  });
}

router.post(
  "/registerUser",
  validateText('fname', 2, 50),
  validateText('lname', 2, 50),
  validateText('address', 5, 100),
  validateText('nic', 5, 20),
  validateText('tel', 10, 15),
  validatePassword(),
  validateText('status', 1, 20),
  validateText('gender', 1, 10),
  body('height').isInt({ min: 0, max: 300 }).withMessage('Height must be a valid number'),
  body('weight').isInt({ min: 0, max: 500 }).withMessage('Weight must be a valid number'),
  handleValidationErrors,
  function (req, res) {
    console.log("Register USer Start");
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var nic = req.body.nic;
    var tel = req.body.tel;
    var status = req.body.status;
    var gender = req.body.gender;
    var height = req.body.height;
    var weight = req.body.weight;

    var newUser = {
      nic: nic,
      password: password,
      firstname: fname,
      lastname: lname,
      address: address,
      telno: tel,
      gender: gender,
      status: status,
      height: height,
      weight: weight,
    };

    User.createUser(newUser, function (err, user) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: 'This account has been deactivated '
        });
        return;
      } else {
        console.log(user);
        res.status(200).json({
          type: 'done',
          user: user
        });
      }
    });

  }
);

router.post("/getUsers", requireTrainerAuth,
  body("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
  handleValidationErrors,
  function (req, res) {
    const userId = req.body.userId;
    const trainerId = req.trainerId;

    // verify this trainer is linked to this user in train table
    Train.getTrainByTrainerIdAndUserId(trainerId, userId, function (err, train) {
      if (err) {
        console.error("getTrainByTrainerIdAndUserId error:", err);
        return res.status(500).json({ error: "Failed to verify authorization" });
      }

      if (!train) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      User.getUserById(userId, function (err, user) {
        if (err || !user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
          type: 'done',
          user: user
        });
      });
    });
  }
);

router.get("/getUsers", function (req, res) {
  if (req.user) {
    var centers = {};
    //var subjects =[];
    var center = {};
    var subjects = {};
    // console.log(" type " + req.user.type);
    console.log(" id " + req.user.id);

    sendUser(req.user.id, null, req, res);

  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown user",
      })
    );
  }
});


///////////////////////////// Trainer Start //////////////////////////////////////////////////

router.post("/loginTrainer",
  validateText('username', 5, 50),
  handleValidationErrors,
  passport.authenticate("local.trainer"),
  function (req, res) {
    console.log("trainer");
    console.log(req.user);
    console.log(req.user.nic);
    console.log("trainer");
    if (req.user) {
      console.log(" nic " + req.user.nic);

      sendTrainer(req.user.id, null, req, res);

    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unknown trainer",
        })
      );
    }
  }
);

function sendTrainer(id, type, req, res) {
  Trainer.getTrainerById(id, function (centers) {
    console.log(JSON.stringify(type));

    // Create a new session (invalidates all previous sessions)
    createSession({
      userId: null,
      trainerId: req.user.id,
      userAgent: req.get('user-agent') || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
      userType: 'trainer'
    }).then(sessionData => {
      // Set httpOnly cookie with session token
      setSecureAuthCookie(res, sessionData.token, 'authToken');

      // Also set session ID cookie for tracking
      res.cookie('sessionId', sessionData.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });

      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        id: req.user.id,
        nic: req.user.nic,
        telno: req.user.telno,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        address: req.user.address,
        gender: req.user.gender,
        status: req.user.status,
        workplace: req.user.workplace,
        sessionCreated: sessionData.expiresAt
      });
    }).catch(err => {
      console.error('Session creation error:', err);
      res.status(500).json({ error: 'Session creation failed' });
    });
  });
}

router.post(
  "/registerTrainer",
  validateText('fname', 2, 50),
  validateText('lname', 2, 50),
  validateText('address', 5, 100),
  validateText('nic', 5, 20),
  validateText('tel', 10, 15),
  validatePassword(),
  validateText('status', 1, 20),
  validateText('gender', 1, 10),
  validateText('workplace', 2, 100),
  handleValidationErrors,
  function (req, res) {
    console.log("Register Trainer Start");
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address = req.body.address;
    var nic = req.body.nic;
    var gender = req.body.gender;
    var tel = req.body.tel;
    var status = req.body.status;
    var workplace = req.body.workplace;

    var newTrainer = {
      nic: nic,
      password: password,
      firstname: fname,
      lastname: lname,
      address: address,
      gender: gender,
      telno: tel,
      status: status,
      workplace: workplace
    };

    Trainer.createTrainer(newTrainer, function (err, trainer) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: 'error occured '
        });
        return;
      } else {
        console.log(trainer);
        res.status(200).json({
          type: 'done',
          trainer: trainer
        });
      }
    });

  }
);

router.get("/getTrainer", passport.authenticate("local.trainer"), function (req, res) {
  if (req.user) {
    var centers = {};
    //var subjects =[];
    var center = {};
    var subjects = {};
    // console.log(" type " + req.user.type);
    console.log(" id " + req.user.id);

    sendTrainer(req.user.id, null, req, res);

  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown trainer",
      })
    );
  }
});



//////////////////////////// Train Start //////////////////////////////////////////////////


router.post(
  "/registerTrain",
  requireTrainerAuth,
  function (req, res) {
    console.log("Register Train Start");
    var userId = req.body.userId;
    var trainerId = req.body.trainerId;

    //Validation


    var newTrain = {
      userId: userId,
      trainerId: trainerId
    };


    Train.createTrain(newTrain, function (err, train) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: err.message
        });
        return;
      } else {
        console.log(train);
        res.status(200).json({
          type: 'done',
          train: train
        });
      }
    });

  }
);

router.post("/getTrainByUserId", requireTrainerAuth, function (req, res) {
  if (req.body) {
    var userId = req.body.userId
    // var trainerId = req.body.trainerId
    // console.log(" type " + req.user.type);
    console.log(" id " + userId);

    Train.getTrainByUserId(userId, function (err, train) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: 'error occured '
        });
        return;
      } else {
        console.log(train);
        res.status(200).json({
          type: 'done',
          train: train
        });
      }
    });

  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown train",
      })
    );
  }
});

router.post("/getTrainByTrainerId", requireTrainerAuth, function (req, res) {
  if (req.body) {
    // IDOR fix: ignore client-supplied trainerId — use the verified session identity
    var trainerId = req.trainerId;

    Train.getTrainByTrainerId(trainerId, function (err, train) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: 'error occured '
        });
        return;
      } else {
        console.log(train);
        res.status(200).json({
          type: 'done',
          train: train
        });
      }
    });

  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown train",
      })
    );
  }
});

router.post("/getTrainByTrainerIdAndUserId", requireTrainerAuth, 
  body("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
  handleValidationErrors,
  function (req, res) {
  const trainerId = req.trainerId; // secure
  const userId = req.body.userId;

  Train.getTrainByTrainerIdAndUserId(trainerId, userId, function (err, train) {
    if (err) {
      console.log("errors" + err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!train) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.status(200).json({
      type: 'done',
      train: train
    });
  });
});


////////////////////////////// Usage Start /////////////////////////////////////////////////


router.post(
  "/registerUsage",
  requireTrainerAuth,
  body("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
  body("usageData")
    .custom((value) => {
      // Must match [number,number,...] — no letters, no scripts
      if (!/^\[[\d.,\s]+\]$/.test(value)) {
        throw new Error("usageData must be numeric pulse values in [n,n,...] format");
      }
      return true;
    }),
  body("time")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("time is required and must be under 50 characters")
    .matches(/^[\w\s.]+$/)
    .withMessage("time contains invalid characters"),
  body("status").isIn(["Active", "Inactive"]).withMessage("Invalid status value"),
  body("average").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("average must be a positive number"),
  handleValidationErrors,
  function (req, res) {
    console.log("Register Usage Start");
    var userId = req.body.userId;
    var usageData = req.body.usageData;
    var status = req.body.status;
    var average = req.body.average;
    var time = req.body.time;

    //Validation


    var newUsage = {
      userId: userId,
      usageData: usageData,
      status: status,
      average: average,
      time: time
    };


    Usage.createUsage(newUsage, function (err, usage) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: err.message
        });
        return;
      } else {
        console.log(usage);
        res.status(200).json({
          type: 'done',
          usage: usage
        });
      }
    });

  }
);

router.post("/getUsageByUserId", function (req, res) {
  if (req.body) {
    var userId = req.body.userId
    // var trainerId = req.body.trainerId
    // console.log(" type " + req.user.type);
    console.log(" id " + userId);

    Usage.getUsageByUserId(userId, function (err, usage) {
      if (err) {
        console.log("errors" + err.message);
        res.status(403).json({
          type: 'error',
          message: 'error occured '
        });
        return;
      } else {
        console.log(usage);
        res.status(200).json({
          type: 'done',
          usage: usage
        });
      }
    });

  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unknown usage",
      })
    );
  }
});

// Settings - get trainer profile with Google connection status
router.get("/settings/trainer", async function (req, res) {
  const token = req.cookies.authToken;
  const sessionId = req.cookies.sessionId;

  if (!token || !sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionData = await validateSession(token, sessionId);
  if (!sessionData || !sessionData.trainerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  Trainer.getTrainerById(sessionData.trainerId, function (err, trainer) {
    if (err || !trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.status(200).json({
      id: trainer.id,
      firstname: trainer.firstname,
      lastname: trainer.lastname,
      nic: trainer.nic,
      email: trainer.email || null,
      telno: trainer.telno,
      workplace: trainer.workplace,
      googleConnected: !!trainer.googleId,
    });
  });
});

// Google OAuth Routes

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Single callback handles both login and account-linking flows
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: (process.env.FRONTEND_URL || "http://localhost:3000") + "/login?error=google_auth_failed",
  }),
  async function (req, res) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // --- Link flow ---
    if (req.user && req.user.isLinkFlow) {
      const trainerId = req.session.linkTrainerId;
      if (!trainerId) {
        return res.redirect(frontendUrl + "/settings?error=session_expired");
      }

      const { googleId, email } = req.user;

      Trainer.getTrainerByGoogleId(googleId, function (err, existing) {
        if (err) return res.redirect(frontendUrl + "/settings?error=link_failed");
        if (existing && existing.id !== trainerId) {
          delete req.session.linkTrainerId;
          return res.redirect(frontendUrl + "/settings?error=google_already_linked");
        }

        Trainer.linkGoogleAccount(trainerId, googleId, email, function (err) {
          delete req.session.linkTrainerId;
          if (err) return res.redirect(frontendUrl + "/settings?error=link_failed");
          res.redirect(frontendUrl + "/settings?linked=true");
        });
      });
      return;
    }

    // --- Login flow ---
    try {
      const sessionData = await createSession({
        userId: null,
        trainerId: req.user.id,
        userAgent: req.get("user-agent") || "Unknown",
        ipAddress: req.ip || req.connection.remoteAddress || "Unknown",
        userType: "trainer",
      });

      setSecureAuthCookie(res, sessionData.token, "authToken");

      res.cookie("sessionId", sessionData.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.redirect(`${frontendUrl}/oauth-callback?id=${req.user.id}`);
    } catch (err) {
      console.error("Google OAuth session error:", err);
      res.redirect(`${frontendUrl}/login?error=session_failed`);
    }
  }
);

// Google Account Linking Routes

router.get("/auth/google/link", async function (req, res, next) {
  const token = req.cookies.authToken;
  const sessionId = req.cookies.sessionId;

  if (!token || !sessionId) {
    return res.redirect(
      (process.env.FRONTEND_URL || "http://localhost:3000") + "/login"
    );
  }

  const sessionData = await validateSession(token, sessionId);
  if (!sessionData || !sessionData.trainerId) {
    return res.redirect(
      (process.env.FRONTEND_URL || "http://localhost:3000") + "/login"
    );
  }

  // Store trainer ID in session so the callback can link the account
  req.session.linkTrainerId = sessionData.trainerId;

  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.post("/auth/google/unlink", async function (req, res) {
  const token = req.cookies.authToken;
  const sessionId = req.cookies.sessionId;

  if (!token || !sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionData = await validateSession(token, sessionId);
  if (!sessionData || !sessionData.trainerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  Trainer.unlinkGoogleAccount(sessionData.trainerId, function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to unlink Google account" });
    }
    res.status(200).json({ message: "Google account unlinked successfully" });
  });
});

//Session Management Endpoints

// Get all active sessions for current user
router.get("/sessions/user", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const sessions = await getUserSessions(req.user.id);
    res.status(200).json({ sessions });
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get all active sessions for current trainer
router.get("/sessions/trainer", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const sessions = await getTrainerSessions(req.user.id);
    res.status(200).json({ sessions });
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Logout from current device/session
router.get("/logoutUser", (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    invalidateSession(sessionId);
  }

  clearAuthCookie(res, 'authToken');
  res.clearCookie('sessionId');
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get("/logoutTrainer", (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    invalidateSession(sessionId);
  }

  clearAuthCookie(res, 'authToken');
  res.clearCookie('sessionId');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Logout from all devices
router.get("/logoutAllSessions/user", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await invalidateAllUserSessions(req.user.id);
    clearAuthCookie(res, 'authToken');
    res.clearCookie('sessionId');
    res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (err) {
    console.error('Error logging out all sessions:', err);
    res.status(500).json({ error: 'Failed to logout from all devices' });
  }
});

router.get("/logoutAllSessions/trainer", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await invalidateAllTrainerSessions(req.user.id);
    clearAuthCookie(res, 'authToken');
    res.clearCookie('sessionId');
    res.status(200).json({ message: 'Logged out from all devices successfully' });
  } catch (err) {
    console.error('Error logging out all sessions:', err);
    res.status(500).json({ error: 'Failed to logout from all devices' });
  }
});

// Close a specific session by ID
router.post("/sessions/close", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    await invalidateSession(sessionId);

    // If closing current session, clear cookies
    if (sessionId === req.cookies.sessionId) {
      clearAuthCookie(res, 'authToken');
      res.clearCookie('sessionId');
    }

    res.status(200).json({ message: 'Session closed successfully' });
  } catch (err) {
    console.error('Error closing session:', err);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

//Cleanup expired sessions periodically
setInterval(() => {
  cleanupExpiredSessions();
}, 60 * 60 * 1000); // Run every hour

module.exports = router;
