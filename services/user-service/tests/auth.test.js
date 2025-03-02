const request  = require('supertest');
const app = require('./app');
const prisma = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');

describe('Auth routes', () => {
    beforeAll( async () =>{
        await prisma.user.deleteMany();
    })

    test("Should register a new user with a hashed password", async () =>{
        
    })

    test("Should return an error if user already exists", async ()=>{
        await prisma.user.create()
    })
})


