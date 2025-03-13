const {PrismaClient} = require("@prisma/client")


const prisma = new PrismaClient();


async function allUsers(req, res) {
    try {
        const allUsers = await prisma.user.findMany()

        res.json({
            status: 200,
            message: "Successfully retrieved users list",
            total: allUsers.length,
            Users: allUsers  
       
        })
        }
        catch(e){
            console.error(e)
            res.status(500).json({ message: 'Failed to fetch users' })
            }
} 

module.exports = {allUsers}