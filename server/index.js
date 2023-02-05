require("dotenv").config();

const express = require("express");
const session = require("client-sessions");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const cors = require("cors")
const fileUpload = require("express-fileupload");
const appRouter = require("./routes");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(fileUpload())
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "../build")))

app.use(session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    cookie: {
        ephemeral: true
    }
}))

passport.use(passport.authenticate("session"))

app.use("/api", appRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build", "index.html"));
})

app.listen(PORT, () => {
    console.log(`Server started...`)
})