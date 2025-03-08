const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();

async function createorder(req, res, next) {
    const { userId, userName, userEmail, items } = req.body;

    try {
        // Check if an order with the same ID already exists
        const orderExists = await prisma.order.findUnique({
            where: { userId } // Assuming you want to check uniqueness by userId
        });

        if (orderExists) {
            return res.status(400).json({
                message: "Order already exists for this user"
            });
        }

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
                createdAt: new Date() // This is handled by default in your schema
            }
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
        const allorders = await prisma.order.findMany()

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

async function orderById(req, res, next){
    try {
        const order = await prisma.order.findUnique({
            where: {id: parseInt(req.params.id)}
        })
        if(!order){
            return res.status(404).json({message: "order not found."})
        }
        res.json({
            status: 200,
            message: "order retrieved successfully.",
            order: order
        })

    } catch (error) {
       console.error(error)
       res.status(500).json({message: "Failed to fetch orders."}) 
    }    
    
}

async function editorder(req, res, next) {
    const {id} = req.params
    const { userId, userName, userEmail, items } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id: parseInt(id)},
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
                status: 'Pending', 
                createdAt: new Date() 
            }
        })

        res.json({
            status: 200,
            message: "order updated successfully!",
            order: order
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to edit order."}) 
    }
}

async function deleteorder(req, res, next){
    const {id} = req.params

    try {
        const order = await prisma.order.findUnique({
            where: {id: parseInt(id, 10)}
        })
        if(!order){
            return res.status(404).json({message: "order not found."})
        }

        await prisma.order.delete({
            where:{
                id: parseInt(id, 10)
            }
        })
        res.status(204).json({
            message: "order deleted successfully!"
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete orders."}) 
    }
}

module.exports = {createorder, getAllorders, orderById, deleteorder, editorder}
