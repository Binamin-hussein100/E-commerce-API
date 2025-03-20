const express = require("express")
const {createorder, getAllorders, orderById, deleteorder, editorder}  = require("../controllers/orderController")
const router = express.Router()

router.get("/all_orders", getAllorders)
router.post("/new_order", createorder)
router.get('/order/:id', orderById)
router.put('/editorder/:id', editorder)
router.delete('/deleteorder/:id', deleteorder)


module.exports = router