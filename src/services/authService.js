import User from '../models/User.js';
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

    const user = await User.findOne({ email });

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

    // Return user object without password
    // Mongoose toObject/toJSON usually handles cleanup if configured, but explicit cleanup is safe.
    // The model configuration sets virtuals: true for keys, but we need to ensure password is not sent if possible.
    // Explicitly destructuring here.
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};
