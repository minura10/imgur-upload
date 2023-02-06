require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const appRouter = require("./routes");
const ImgurStrategy = require("passport-imgur").Strategy;
const MemoryStore = require("memorystore")(session);

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(fileUpload());
app.use(express.static(path.resolve(__dirname, "../build")));

const store = new MemoryStore({
  checkPeriod: 86400000,
});

app.use(
  session({
    cookieName: "imgur-session",
    secret: process.env.SESSION_SECRET,
    store,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      maxAge: 360000,
      secure: false,
    },
  })
);

passport.use(
  new ImgurStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/callback`,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      const data = {
        accessToken,
        email: profile.email,
        id: profile.id,
      };
      return cb(null, data);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log("S", { user });
    return cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log("D", { user });
    return cb(null, user);
  });
});

passport.use(passport.authenticate("session"));

app.use("/api", appRouter);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started...`);
});
