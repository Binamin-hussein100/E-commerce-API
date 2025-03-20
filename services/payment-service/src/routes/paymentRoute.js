const express = require("express")
const {createpayment, getAllpayments,paymentById, editpayment} = require("../controller/paymentController")
const router = express.Router();

router.get("/allpayments", getAllpayments)
router.post("/payment",createpayment )
router.get("/payment/:id", paymentById)
router.get("/payment/:id", editpayment)

module.exports = router


