const jwt = require("jsonwebtoken");

const auth = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ status: "Access Denied" });
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log({ verified });
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ status: "Unauthorized User" });
    }
};

module.exports = auth;
