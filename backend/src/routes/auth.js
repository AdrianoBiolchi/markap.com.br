import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import auth from '../middleware/auth.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { userId, businessType, taxRegime, onboardingGoal } = req.body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                onboarded: true,
                businessType,
                taxRegime,
                onboardingGoal
            }
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        // Sempre retornar sucesso — não revelar se e-mail existe
        if (!user) return res.json({ success: true });

        // Gerar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Invalidar códigos anteriores
        await prisma.passwordReset.updateMany({
            where: { email, used: false },
            data: { used: true }
        });

        // Salvar novo código
        await prisma.passwordReset.create({
            data: { email, code, expiresAt }
        });

        // Enviar e-mail
        await resend.emails.send({
            from: 'Markap <noreply@markap.com.br>',
            to: email,
            subject: 'Código de recuperação de senha — Markap',
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <h2 style="font-size: 24px; color: #0F0E0C; margin-bottom: 8px;">Recuperar senha</h2>
          <p style="color: #6B7280; margin-bottom: 32px;">Use o código abaixo para redefinir sua senha. Ele expira em <strong>15 minutos</strong>.</p>
          <div style="background: #F7F7F7; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <div style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #1A5C3A;">${code}</div>
          </div>
          <p style="color: #9CA3AF; font-size: 13px;">Se você não solicitou isso, ignore este e-mail.</p>
        </div>
      `
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const reset = await prisma.passwordReset.findFirst({
            where: {
                email,
                code,
                used: false,
                expiresAt: { gt: new Date() }
            }
        });
        if (!reset) return res.status(400).json({ error: 'Código inválido ou expirado' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const reset = await prisma.passwordReset.findFirst({
            where: {
                email,
                code,
                used: false,
                expiresAt: { gt: new Date() }
            }
        });
        if (!reset) return res.status(400).json({ error: 'Código inválido ou expirado' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashed }
        });
        await prisma.passwordReset.update({
            where: { id: reset.id },
            data: { used: true }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/profile', auth, async (req, res) => {
    const { name } = req.body;
    try {
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }
        await prisma.user.update({
            where: { id: req.user.id },
            data: { name }
        });
        res.json({ success: true, name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Senha atual incorreta' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashed }
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/account', auth, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.user.id }
        });
        res.json({ success: true, message: 'Account deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
