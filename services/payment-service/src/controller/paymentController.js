const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();


async function createpayment(req, res, next){
    const {orderId, amount, status} = req.body

    try {
        const paymentExists = await prisma.payment.findUnique({
            where:{orderId}
        })

        if(paymentExists){
            return res.status(400).json({
                message:"payment already exists"
            })
        }
        const payment = await prisma.payment.create({
            orderId,
            amount,
            status: 'Pending', 
            createdAt: new Date()
        }) 
        res.status(201).json({
            message: "payment successfully created",
            paymentData: payment
        })
    } catch (error) {
        
    }
}

async function getAllpayments(req,res, next){
    try {
        const allpayments = await prisma.payment.findMany()

        res.json({
            status: 200,
            message:"Successfully retrieved all payments",
            payments: allpayments,
            meta:{
                total: allpayments.length,
                timestamp: new Date()
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch payments."
        })
    }
}

async function paymentById(req, res, next){
    try {
        const payment = await prisma.payment.findUnique({
            where: {id: parseInt(req.params.id)}
        })
        if(!payment){
            return res.status(404).json({message: "payment not found."})
        }
        res.json({
            status: 200,
            message: "payment retrieved successfully.",
            payment: payment
        })

    } catch (error) {
       console.error(error)
       res.status(500).json({message: "Failed to fetch payments."}) 
    }    
    
}

async function editpayment(req, res, next) {
    const {id} = req.params
    const {orderId, amount, status} = req.body;

    try {
        const payment = await prisma.payment.update({
            where: { id: parseInt(id)},
            data: {
                orderId,
                amount,
                status,
                editedAt: new Date
            }
        })

        res.json({
            status: 200,
            message: "payment updated successfully!",
            payment: payment
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to edit payment."}) 
    }
}

async function deletepayment(req, res, next){
    const {id} = req.params

    try {
        const payment = await prisma.payment.findUnique({
            where: {id: parseInt(id, 10)}
        })
        if(!payment){
            return res.status(404).json({message: "payment not found."})
        }

        await prisma.payment.delete({
            where:{
                id: parseInt(id, 10)
            }
        })
        res.status(204).json({
            message: "payment deleted successfully!"
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete payments."}) 
    }
}

module.exports = {createpayment, getAllpayments, paymentById, deletepayment, editpayment}
