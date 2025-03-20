const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();

async function createorder(req, res, next) {
    const { userId, userName, userEmail, items } = req.body;

    try {
        // Check if an order with the same ID already exists
        const orderExists = await prisma.order.findFirst({
            where: { userId } // Assuming you want to check uniqueness by userId
        });

        if (orderExists) {
            return res.status(400).json({
                message: "Order already exists for this user"
            });
        }

        const totalAmount = items.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId,
                userName,
                userEmail,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        productPrice: item.productPrice,
                        quantity: item.quantity
                    }))
                },
                status: 'Pending', // Default status, can be overridden by req.body if needed
                createdAt: new Date(), // This is handled by default in your schema
                totalAmount
            },
            include: { items: true } 
        });

        res.status(201).json({
            message: "Order successfully created",
            orderData: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
}
async function getAllorders(req,res, next){
    try {
        const allorders = await prisma.order.findMany({
            include: { items: true }
        })

        res.json({
            status: 200,
            message:"Successfully retrieved all orders",
            orders: allorders,
            meta:{
                total: allorders.length,
                timestamp: new Date()
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch orders."
        })
    }
}

async function orderById(req, res, next) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({
            status: 200,
            message: "Order retrieved successfully.",
            order: order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch order." });
    }    
}

async function editorder(req, res, next) {
    try {
        const { id } = req.params; // Extract order ID from params
        const updateData = {}; // Initialize an empty object to store updates

        // Loop through request body and add only provided fields to updateData
        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }

        // Ensure `items` is handled properly (if provided)
        if (updateData.items) {
            if (!Array.isArray(updateData.items)) {
                return res.status(400).json({ message: "Items must be an array." });
            }

            updateData.items = {
                create: updateData.items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    quantity: item.quantity
                }))
            };
        }

        // Update only the provided fields
        const order = await prisma.order.update({
            where: { id },
            data: updateData
        });

        res.json({
            status: 200,
            message: "Order updated successfully!",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to edit order.", error: error.message });
    }
}


async function deleteorder(req, res, next) {
    try {
        const orderId = req.params.id || req.body.id; 
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        // Find the order before deletion
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true } 
        });
        
        if (order && order.items.length > 0) {
            return res.status(400).json({ message: "Cannot delete an order with items. Remove items first." });
        }
        
        

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Delete the order
        await prisma.order.delete({
            where: { id: orderId }
        });

        res.status(200).json({ message: "Order deleted successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete order.", error: error.message });
    }
}


module.exports = {createorder, getAllorders, orderById, deleteorder, editorder}
