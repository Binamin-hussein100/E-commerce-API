const express = require('express')
const { newUser, userSignIn, checkAuth, logOut} = require('../controllers/authController')

const router = express.Router();

router.post('/userSignUp', newUser)
router.post('/userSignIn', userSignIn)
router.get('/checkAuth', checkAuth)
router.get('/logout', logOut)

module.exports = router;


