jest.mock('../src/controllers/authController', () => ({
    ...jest.requireActual('../src/controllers/authController'),
    prisma: require('../__mocks__/prisma'),
}));

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
      },
    })),
  }));

const { newUser, userSignIn, logOut } = require('../src/controllers/authController');
const prisma = require('../__mocks__/prisma');
const prismaMock = require('../__mocks__/prisma');
const { Prisma } = require('@prisma/client');

describe('Auth Controller Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test('Signup - Should create a new user', async () => {
        const req = {
            body: { email: 'test@example.com', name: 'Test User', tel: '123456789', password: 'password' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        prisma.user.findUnique.mockResolvedValue(null); // Simulate user not found
        prisma.user.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
        });

        await newUser(req, res, prisma);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(prisma.user.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User created successfully' }));
    });

    test('Login - Should return error for invalid credentials', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'wrongpassword' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        prisma.user.findUnique.mockResolvedValue(null); // Simulate user not found

        await userSignIn(req, res, prisma);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('Logout - Should clear cookies', async () => {
        const req = {};
        const res = {
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        logOut(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
});
