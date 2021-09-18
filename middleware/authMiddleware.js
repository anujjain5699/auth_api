const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const requireAuth = (req, res, next) => {

    //fetch cookie
    const token = req.cookies.jwt;
    //check json web token exits
    if (token) {
        jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login')
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

//check current user
const checkUser = (req, res, next) => {
    //fetch cookie
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWTSECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null
                next()
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null
        next();
    }
}

module.exports = { requireAuth ,checkUser}