const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();

async function createnotification(req, res, next) {
    const { userId, type, message } = req.body;

    try {
        // Validate notification type
        if (!Object.values(NotificationType).includes(type)) {
            return res.status(400).json({ message: "Invalid notification type provided." });
        }

        // Check if a similar notification already exists to avoid duplicates
        const notificationExists = await prisma.notification.findFirst({
            where: {
                userId: userId,
                message: message,
                type: type
            }
        });

        if (notificationExists) {
            return res.status(400).json({
                message: "A similar notification already exists."
            });
        }

        // Create the notification
        const notification = await prisma.notification.create({
            data: {
                userId: userId,
                type: type,
                message: message,
                status: "PENDING", 
                createdAt: new Date() 
            }
        });

        res.status(201).json({
            message: "Notification successfully created",
            notificationData: notification
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
}

async function getAllnotifications(req,res, next){
    try {
        const allnotifications = await prisma.notification.findMany()

        res.json({
            status: 200,
            message:"Successfully retrieved all notifications",
            notifications: allnotifications,
            meta:{
                total: allnotifications.length,
                timestamp: new Date()
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch notifications."
        })
    }
}

async function notificationById(req, res, next){
    try {
        const notification = await prisma.notification.findUnique({
            where: {id: parseInt(req.params.id)}
        })
        if(!notification){
            return res.status(404).json({message: "notification not found."})
        }
        res.json({
            status: 200,
            message: "notification retrieved successfully.",
            notification: notification
        })

    } catch (error) {
       console.error(error)
       res.status(500).json({message: "Failed to fetch notifications."}) 
    }    
    
}

async function editnotification(req, res, next) {
    const {id} = req.params
    const { userId, type, message } = req.body;

    try {

        const notificationExists = await prisma.notification.findFirst({
            where: {
                userId: userId,
                message: message,
                type: type
            }
        })

        if (notificationExists) {
            return res.status(400).json({
                message: "A similar notification already exists."
            });
        }

        const notification = await prisma.notification.update({
            where: { id: parseInt(id)},
            data: {
                userId: userId,
                type: type,
                message: message,
                status: "PENDING", // Default status
                createdAt: new Date() // This is redundant if using default(now()) in Prisma schema
            }
        })

        res.json({
            status: 200,
            message: "notification updated successfully!",
            notification: notification
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to edit notification."}) 
    }
}

async function deletenotification(req, res, next){
    const {id} = req.params

    try {
        const notification = await prisma.notification.findUnique({
            where: {id: parseInt(id, 10)}
        })
        if(!notification){
            return res.status(404).json({message: "notification not found."})
        }

        await prisma.notification.delete({
            where:{
                id: parseInt(id, 10)
            }
        })
        res.status(204).json({
            message: "notification deleted successfully!"
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete notifications."}) 
    }
}

module.exports = {createnotification, getAllnotifications, notificationById, deletenotification, editnotification}
