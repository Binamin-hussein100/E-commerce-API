const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new cart
async function createCart(req, res) {
    const { userId, items } = req.body;
    try {
        const cart = await prisma.cart.create({
            data: {
                userId,
                items: {
                    create: items
                }
            }
        });
        res.status(201).json(cart);
    } catch (error) {
        console.error('Failed to create cart:', error);
        res.status(500).json({ message: 'Failed to create cart' });
    }
}

// Get a cart by ID
async function getCart(req, res) {
    const { id } = req.params;
    try {
        const cart = await prisma.cart.findUnique({
            where: { id },
            include: { items: true }
        });
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve cart:', error);
        res.status(500).json({ message: 'Failed to retrieve cart' });
    }
}

// Update a cart
async function updateCart(req, res) {
    const { id } = req.params;
    const { items } = req.body;
    try {
        const cart = await prisma.cart.update({
            where: { id },
            data: {
                items: {
                    upsert: items.map(item => ({
                        where: { id: item.id },
                        update: item,
                        create: item
                    }))
                }
            }
        });
        res.json(cart);
    } catch (error) {
        console.error('Failed to update cart:', error);
        res.status(500).json({ message: 'Failed to update cart' });
    }
}

// Delete a cart
async function deleteCart(req, res) {
    const { id } = req.params;
    try {
        await prisma.cart.delete({
            where: { id }
        });
        res.status(204).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Failed to delete cart:', error);
        res.status(500).json({ message: 'Failed to delete cart' });
    }
}

module.exports = {
    createCart,
    getCart,
    updateCart,
    deleteCart
};