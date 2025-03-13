const express = require("express")
const {createProduct, getAllProducts,productById, deleteProduct, editProduct} =  require("../controllers/productControllers")
const router = express.Router();


router.get("/all_products", getAllProducts)
router.post("/newproduct", createProduct)
router.get("/product/:id", productById)
router.put("/product/:id", editProduct)

module.exports = router 