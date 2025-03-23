const express = require('express')
const { newUser, userSignIn, checkAuth, logOut, test} = require('../controllers/authController')
const roleMiddleware = require('../middlewares/oleMiddleware')

const router = express.Router();

router.post('/userSignUp', newUser)
router.post('/userSignIn', userSignIn)
router.get('/checkAuth', checkAuth)
router.get('/logout', logOut)
router.get('/test', test)

router.get('/admin', roleMiddleware(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});

module.exports = router;


