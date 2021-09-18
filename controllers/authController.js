const User = require("../models/User");
const jwt = require('jsonwebtoken')
// const {requestPasswordReset,resetPassword} = require("../middleware/authMiddleware");

//handle error
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { name: '', email: '', password: '' }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    //incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'email is not registered'
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'password is incorrect'
    }

    if (err.message.includes('E11000 duplicate key error collection')) {
        errors.email = 'Email is already registered'
    }
    return errors;
}

//time to keep cookie
const maxAge = 3 * 24 * 60 * 60;

//create jwt token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWTSECRET, {
        expiresIn: maxAge
    });
}


// controller actions
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id)
        user.save()
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.login_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/');
}
