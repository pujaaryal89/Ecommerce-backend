const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secret001",
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: true,
    })
);
app.use((req, res, next) => {
    res.locals.username = req.session.user_name;
    res.locals.userProfile = req.session.userProfile;
    next();
});

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.get("/", function (req, res) {
    return res.send("Hello World");
});
module.exports = app;
