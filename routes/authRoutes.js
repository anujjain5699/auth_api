const { Router } = require('express')
const router = Router();
const authController = require('../controllers/authController')
router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

//route for password-reset
/*
method  POST
route   /reset
body    email 
*/

module.exports = router;