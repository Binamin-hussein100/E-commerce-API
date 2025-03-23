// signup and login


const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

// Helper function to generate tokens
function generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

// User sign up
async function newUser(req, res) {
    const { email, name, tel, password, role } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                tel,
                password: hashedPassword,
                role: role || "customer"
            },
        });

        const tokens = generateTokens({ id: user.id, email: user.email});

        res.cookie('token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000,
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 604800000,
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Admin sign up
// async function newAdmin(req, res) {
//     const { email, password } = req.body;
    
//     try {
//         const adminExists = await prisma.admin.findUnique({ where: { email } });

//         if (adminExists) {
//             return res.status(400).json({ message: 'Admin already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const admin = await prisma.admin.create({
//             data: {
//                 email,
//                 password: hashedPassword,
//             },
//         });

//         const tokens = generateTokens({ id: admin.id, email: admin.email });

//         res.cookie('adminToken', tokens.accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 3600000,
//         });

//         res.cookie('adminRefreshToken', tokens.refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 604800000,
//         });

//         res.status(201).json({ message: 'Admin created successfully', admin });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// User sign in
async function userSignIn(req, res, ) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
     
        if(!user){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

        res.cookie('token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000,
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 604800000,
        });

        res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Admin sign in
// async function adminSignIn(req, res) {
//     const { email, password } = req.body;

//     try {
//         const admin = await prisma.admin.findUnique({ where: { email } });

//         if (!admin || !(await bcrypt.compare(password, admin.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const tokens = generateTokens({ id: admin.id, email: admin.email});

//         res.cookie('adminToken', tokens.accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 3600000,
//         });

//         res.cookie('adminRefreshToken', tokens.refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 604800000,
//         });

//         res.json({ message: 'Login successful', admin: { id: admin.id, email: admin.email } });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// Logout
const logOut = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.clearCookie('adminToken');
    res.clearCookie('adminRefreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

// Check authentication
const checkAuth = (req, res) => {
    const token = req.cookies.token || req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({ authenticated: false, message: 'Access denied' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true, message: 'Access granted' });
    } catch (err) {
        res.status(401).json({ message: 'Access denied', error: err.message });
    }
};

const test = (req, res) => {
    res.status(200).send("Test endpoint reached");
};

module.exports = { newUser, userSignIn, checkAuth, logOut, test, prisma };
