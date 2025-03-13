const express = require('express')
const router = express.Router()
const users = require('../controllers/userController')

router.get("/allUsers",users.allUsers)

module.exports  = router