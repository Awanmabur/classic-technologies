const jwt = require('jsonwebtoken');
const jwtSecret = process.env.PRIVATE_KEY;
const User = require("../models/User");

exports.checkLoginStatus = (req, res, next) => {
    const token = req.session.token;
    if (token) {
        try {
            const verified = jwt.verify(token, "jwtSecret");
            req.user = verified.userId;
            req.isAuthenticated = true;
        } catch (err) {
            req.isAuthenticated = false;
        }
    } else {
        req.isAuthenticated = false;
    }
    next();
};
