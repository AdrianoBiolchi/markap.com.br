import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0], // Prisma requires name
                plan: 'FREE'
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            user: {
                id: newUser.id,
                email: newUser.email,
                plan: newUser.plan,
                has_completed_onboarding: newUser.onboarded
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const userData = {
            id: user.id,
            email: user.email,
            plan: user.plan,
            has_completed_onboarding: user.onboarded
        };

        res.json({ user: userData, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update onboarding status
router.post('/complete-onboarding', async (req, res) => {
    const { userId } = req.body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { onboarded: true }
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
