const express = require("express");
const passport = require("passport");

var FormData = require("form-data");
const { default: axios } = require("axios");

const router = express.Router();

router.get("/login", passport.authenticate("imgur"));
router.get(
  "/callback",
  passport.authenticate("imgur", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});

router.get("/me", function (req, res, next) {
  res.json({ user: req.user, session: req.session });
});

router.post("/upload", async (req, res) => {
  if (!req.files) {
    res.json({
      status: false,
      message: "No file found in request",
      payload: {},
    });
    return;
  }

  try {
    let file = req.files.file;

    const name = file.name;
    // const data = file.data;
    var data = new FormData();

    var config = {
      method: "post",
      url: "https://api.imgur.com/3/image",
      headers: {
        ...data.getHeaders()
      },
      data: data,
    };

    // axios(config);
      res.json({
        status: true,
        message: "File was uploaded successfuly"
      });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Unexpected problem",
      payload: {},
    });
  }
});
module.exports = router;
