const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registration = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).send("Please fill all the field");
        }
        if (password !== confirm_password) {
            return res.status(400).send("Please enter same password");
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("Email already exists");
        } else {
            user = await User.create({
                username,
                email,
                password,
                confirm_password,
            });
        }
        res.status(200).json({ status: "User registered succesfully", user });
    } catch (err) {
        console.log(err);
    }
};
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         console.log({ user });
//         if (user) {
//             if (!bcrypt.compareSync(password, user.password)) {
//                 return res
//                     .status(400)
//                     .send({ message: "The password is invalid" });
//             } else if (bcrypt.compareSync(password, user.password)) {
//                 const token = jwt.sign(
//                     { _id: user._id },
//                     process.env.TOKEN_SECRET
//                 );
//                 if (user.token) {
//                     user.token = token;
//                     await user.save();
//                 } else {
//                     user["token"] = token;
//                     await user.save();
//                 }
//                 res.status(200).json({ token, user });
//             }
//         } else {
//             return res
//                 .status(400)
//                 .send({ message: "The username does not exist" });
//         }
//     } catch (err) {
//         console.log(err);
//     }
// };

exports.login = async (req, res) => {
    // console.log({ " req is": req });
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log({ user });
        if (user) {
            const p = await bcrypt.compareSync(password, user.password);
            console.log({ p });
            if (p) {
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.TOKEN_SECRET
                );
                // if (!user.token) {
                //     user.token = token;
                //     await user.save();
                // }
                res.status(200).json({ token, user });
            } else {
                res.send("Wrong username or password.");
            }
        } else {
            return res
                .status(400)
                .send({ message: "The username does not exist" });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.profile = async (req, res) => {
    try {
        const profile = await User.findOne({ _id: req.params.id });
        res.status(200).json({
            status: "success",
            profile,
        });
    } catch (error) {
        res.status(500).json({ status: "error", error });
    }
};
