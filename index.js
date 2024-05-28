const express = require("express");
const env = require("dotenv");
const db = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User");

const app = express();
env.config();

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "views")));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

db();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all domains during testing
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "views", "profile.html"));
  } else {
    res.redirect("/login");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        console.log(`Searching for user with Google ID: ${profile.id}`);

        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log("User not found. Creating new user...");
          // If not found, create a new user
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
          console.log("New user created successfully!");
        } else {
          console.log("User found:", user);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

app.post("/api/sendEmail", (req, res) => {
  const { sender, emailBody } = req.body;
  console.log("Email from:", sender);
  console.log("Email body:", emailBody);
  res.json({ status: "Success", message: "Email processed" });
});

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
