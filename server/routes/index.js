const express = require("express");
const passport = require("passport");
const ImgurStrategy = require("passport-imgur").Strategy;

var axios = require('axios');
var FormData = require('form-data');

passport.use(new ImgurStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/callback`
}, function verify(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}))

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email })
    })
})

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})

const router = express.Router();

router.get("/login", passport.authenticate("imgur"))
router.get("/callback", passport.authenticate("imgur", { failureRedirect: "/login", successRedirect: '/' }))
router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/')
    })
})

router.post("/upload", async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "There was no file found in request",
                payload: {},
            });
            return;
        }
        let file = req.files.file;

        console.log({ session: req.user });

        const name = file.name;
        // const data = file.data;
        var data = new FormData();
        data.append('image', 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

        var config = {
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            headers: {
                'Authorization': `Client-ID {{clientId}}`,
                ...data.getHeaders()
            },
            data: data
        };

        // axios(config)
        //     .then(function (response) {
                res.send({
                    status: true,
                    message: "File was uploaded successfuly",
                    payload: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        path: "/files/uploads/",
                        url: "https://my-ftp-server.com/bjYJGFYgjfVGHVb",
                    },
                });
            // })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Unexpected problem",
            payload: {},
        });
    }
});
module.exports = router;