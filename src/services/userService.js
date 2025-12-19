// src/services/userService.js
import prisma from '../prismaClient.js'; // Path relatif dari src/services/ ke src/
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Fungsi helper untuk memilih data user yang akan dikembalikan (tanpa password)
const selectUserPublicData = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};


// ... (semua fungsi service Anda: createUserService, getAllUsersService, dll.)
// Logika internal fungsi-fungsi ini tetap sama.
// Contoh:
export const createUserService = async (userData) => {
  const { email, password, name, role } = userData;
  if (!email || !password) {
    const error = new Error('Email dan password wajib diisi.');
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('Email sudah terdaftar.');
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: role || 'USER' },
    });
    return newUser;
  } catch (dbError) {
    console.error("Prisma Error in createUserService:", dbError);
    const error = new Error('Gagal membuat user di database.');
    error.statusCode = 500;
    if (dbError.code === 'P2002' && dbError.meta?.target?.includes('email')) {
      const specificError = new Error('Email sudah terdaftar (P2002).');
      specificError.statusCode = 400;
      throw specificError;
    }
    throw error;
  }
};

export const getAllUsersService = async () => { /* ... kode Anda ... */
  try {
    const users = await prisma.user.findMany({
      select: selectUserPublicData, // Hanya ambil data yang diperlukan
      orderBy: { createdAt: 'desc' },
    });
    return users;
  } catch (dbError) {
    console.error("Prisma Error in getAllUsersService:", dbError);
    const error = new Error('Gagal mengambil data users dari database.');
    error.statusCode = 500;
    throw error;
  }
};
export const getUserByIdService = async (userId) => { /* ... kode Anda ... */
  // const id = parseInt(userId, 10);
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: selectUserPublicData, // Hanya ambil data yang diperlukan
    });
    if (!user) {
      const error = new Error('User tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (dbError) {
    console.error("Prisma Error in getUserByIdService:", dbError);
    const error = new Error('Gagal mengambil data user dari database.');
    error.statusCode = 500;
    throw error;
  }
};
export const updateUserService = async (userId, updateData) => { /* ... kode Anda ... */
  // const id = parseInt(userId, 10);
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }
  const dataToUpdate = { ...updateData };
  if (dataToUpdate.password) {
    dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltRounds);
  }
  Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);
  delete dataToUpdate.laporan; delete dataToUpdate.createdAt; delete dataToUpdate.updatedAt; delete dataToUpdate.id;
  if (Object.keys(dataToUpdate).length === 0) {
    const error = new Error('Tidak ada data untuk diperbarui.');
    error.statusCode = 400;
    throw error;
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    return updatedUser;
  } catch (dbError) {
    if (dbError.code === 'P2025') {
      const error = new Error('User tidak ditemukan untuk diperbarui.');
      error.statusCode = 404;
      throw error;
    }
    if (dbError.code === 'P2002' && dbError.meta?.target?.includes('email')) {
      const error = new Error('Email sudah digunakan oleh user lain.');
      error.statusCode = 400;
      throw error;
    }
    console.error("Prisma Error in updateUserService:", dbError);
    const error = new Error('Gagal memperbarui user di database.');
    error.statusCode = 500;
    throw error;
  }
};
export const deleteUserService = async (userId) => { /* ... kode Anda ... */
  // const id = parseInt(userId, 10);
  if (!userId) {
    const error = new Error('ID User tidak valid.');
    error.statusCode = 400;
    throw error;
  }
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (dbError) {
    if (dbError.code === 'P2025') {
      const error = new Error('User tidak ditemukan untuk dihapus.');
      error.statusCode = 404;
      throw error;
    }
    console.error("Prisma Error in deleteUserService:", dbError);
    const error = new Error('Gagal menghapus user dari database.');
    error.statusCode = 500;
    throw error;
  }
};


// --- FUNGSI BARU UNTUK LOGIN ---
// --- FUNGSI LOGIN DIPINDAH KE AUTH SERVICE ---
// export const loginUserService = ...