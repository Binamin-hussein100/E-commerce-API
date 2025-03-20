const express = require("express");
const router = express.Router();

// Import the cart controller functions
const { createCart, getCart, updateCart, deleteCart } = require('../controllers/cartController');

// Route to create a new cart
router.post('/new_cart', createCart);

// Route to get a cart by ID
router.get('/cart/:id', getCart);

// Route to update a cart by ID
router.put('/cart/:id', updateCart);

// Route to delete a cart by ID
router.delete('/cart/:id', deleteCart);

module.exports = router;