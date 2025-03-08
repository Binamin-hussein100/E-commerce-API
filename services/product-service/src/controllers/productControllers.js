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

async function getAllProducts(req,res, next){
    try {
        const allProducts = await prisma.product.findMany()

        res.json({
            status: 200,
            message:"Successfully retrieved all products",
            products: allProducts,
            meta:{
                total: allProducts.length,
                timestamp: new Date()
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch products."
        })
    }
}

async function productById(req, res, next){
    try {
        const product = await prisma.product.findUnique({
            where: {id: parseInt(req.params.id)}
        })
        if(!product){
            return res.status(404).json({message: "Product not found."})
        }
        res.json({
            status: 200,
            message: "Product retrieved successfully.",
            product: product
        })

    } catch (error) {
       console.error(error)
       res.status(500).json({message: "Failed to fetch products."}) 
    }    
    
}

async function editProduct(req, res, next) {
    const {id} = req.params
    const {name, price, stock} = req.body;

    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id)},
            data: {
                name,
                price,
                stock,
                editedAt: new Date
            }
        })

        res.json({
            status: 200,
            message: "Product updated successfully!",
            product: product
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to edit product."}) 
    }
}

async function deleteProduct(req, res, next){
    const {id} = req.params

    try {
        const product = await prisma.product.findUnique({
            where: {id: parseInt(id, 10)}
        })
        if(!product){
            return res.status(404).json({message: "Product not found."})
        }

        await prisma.product.delete({
            where:{
                id: parseInt(id, 10)
            }
        })
        res.status(204).json({
            message: "Product deleted successfully!"
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete products."}) 
    }
}

module.exports = {createProduct, getAllProducts, productById, deleteProduct, editProduct}
