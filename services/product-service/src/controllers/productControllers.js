const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();


async function createProduct(req, res, next){
    const {name, price, stock} = req.body

    try {
        const productExists = await prisma.product.findUnique({
            where:{name}
        })

        if(productExists){
            return res.status(400).json({
                message:"Product already exists"
            })
        }
        const product = await prisma.product.create({
            name,
            price,
            stock, 
            createdAt: new Date()
        }) 
        res.status(201).json({
            message: "Product successfully created",
            productData: product
        })
    } catch (error) {
        
    }
}

async function getAllProducts(){
    
}

module.exports = {createProduct, getAllProducts}
