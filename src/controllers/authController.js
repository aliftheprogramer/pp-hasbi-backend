import * as AuthService from '../services/authService.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const newUser = await AuthService.registerService(req.body);
        res.status(201).json({ success: true, message: 'User berhasil dibuat.', data: newUser });
    } catch (error) {
        console.error("Controller Error - register:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // DEBUGGING: Log received payload
    console.log('Login Attempt:', {
        email,
        passwordRecieved: !!password,
        contentType: req.headers['content-type'],
        bodyRaw: req.body
    });

    try {
        const user = await AuthService.loginService(email, password);

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.error("Controller Error - login:", error.message);
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
    }
};
