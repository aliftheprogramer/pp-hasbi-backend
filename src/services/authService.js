import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';
import * as UserService from './userService.js';

export const registerService = async (userData) => {
    // Reuse existing user creation logic
    return await UserService.createUserService(userData);
};

export const loginService = async (email, password) => {
    if (!email || !password) {
        const error = new Error('Email dan password wajib diisi.');
        error.statusCode = 400;
        throw error;
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        const error = new Error('Email atau password salah.');
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        const error = new Error('Email atau password salah.');
        error.statusCode = 401;
        throw error;
    }

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
