const {PrismaClient} = require("@prisma/client")

const prismaMock = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    admin:{
        findUnique: jest.fn(),
        create: jest.fn(),
    }

}

module.exports = prismaMock;
