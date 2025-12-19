import User from '../models/User.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Helper to select fields is less needed with Mongoose's .select() but kept for logic consistency if needed.
// However, findMany in prisma accepts 'select'. Mongoose accepts projection string or object.

export const createUserService = async (userData) => {
  const { email, password, name, role } = userData;
  if (!email || !password) {
    const error = new Error('Email dan password wajib diisi.');
    error.statusCode = 400;
    throw error;
  }

  // Mongoose automatically checks uniqueness but checking beforehand allows custom error message
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email sudah terdaftar.');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'USER'
    });
    await newUser.save();
    return newUser;
  } catch (dbError) {
    console.error("Mongoose Error in createUserService:", dbError);
    const error = new Error('Gagal membuat user di database.');
    error.statusCode = 500;

    // Check for Duplicate Key Error (E11000)
    if (dbError.code === 11000 && dbError.keyPattern && dbError.keyPattern.email) {
      const specificError = new Error('Email sudah terdaftar (E11000).');
      specificError.statusCode = 400;
      throw specificError;
    }
    throw error;
  }
};

export const getAllUsersService = async () => {
  try {
    // Select specific fields + id (included by default)
    const users = await User.find({})
      .select('email name role createdAt updatedAt')
      .sort({ createdAt: -1 });
    return users;
  } catch (dbError) {
    console.error("Mongoose Error in getAllUsersService:", dbError);
    const error = new Error('Gagal mengambil data users dari database.');
    error.statusCode = 500;
    throw error;
  }
};

export const getUserByIdService = async (userId) => {
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }
  try {
    const user = await User.findById(userId)
      .select('email name role createdAt updatedAt');

    if (!user) {
      const error = new Error('User tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (dbError) {
    console.error("Mongoose Error in getUserByIdService:", dbError);
    // If ID is malformed (CastError)
    if (dbError.name === 'CastError') {
      const error = new Error('ID User tidak valid.');
      error.statusCode = 400;
      throw error;
    }
    const error = new Error('Gagal mengambil data user dari database.');
    error.statusCode = 500;
    throw error;
  }
};

export const updateUserService = async (userId, updateData) => {
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  const dataToUpdate = { ...updateData };
  if (dataToUpdate.password) {
    dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltRounds);
  }

  // Remove undefined/null/unwanted fields
  Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);
  delete dataToUpdate.laporan;
  delete dataToUpdate.createdAt;
  delete dataToUpdate.updatedAt;
  delete dataToUpdate.id;
  delete dataToUpdate._id;

  if (Object.keys(dataToUpdate).length === 0) {
    const error = new Error('Tidak ada data untuk diperbarui.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
      new: true, // Return modified document
      runValidators: true
    });

    if (!updatedUser) {
      const error = new Error('User tidak ditemukan untuk diperbarui.');
      error.statusCode = 404;
      throw error;
    }

    return updatedUser;
  } catch (dbError) {
    if (dbError.code === 11000 && dbError.keyPattern && dbError.keyPattern.email) {
      const error = new Error('Email sudah digunakan oleh user lain.');
      error.statusCode = 400;
      throw error;
    }
    if (dbError.name === 'CastError') {
      const error = new Error('ID User tidak valid.');
      error.statusCode = 404; // Or 400 depending on preference
      throw error;
    }
    console.error("Mongoose Error in updateUserService:", dbError);
    const error = new Error('Gagal memperbarui user di database.');
    error.statusCode = 500;
    throw error;
  }
};

export const deleteUserService = async (userId) => {
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      const error = new Error('User tidak ditemukan untuk dihapus.');
      error.statusCode = 404;
      throw error;
    }
  } catch (dbError) {
    if (dbError.name === 'CastError') {
      const error = new Error('User tidak ditemukan untuk dihapus.');
      error.statusCode = 404;
      throw error;
    }
    console.error("Mongoose Error in deleteUserService:", dbError);
    const error = new Error('Gagal menghapus user dari database.');
    error.statusCode = 500;
    throw error;
  }
};