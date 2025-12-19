// src/controllers/userController.js
import * as UserService from '../services/userService.js'; // Path relatif dari src/controllers/ ke src/services/
import jwt from 'jsonwebtoken';
// ... (semua fungsi controller Anda: registerUser, getAllUsers, dll.)
// Logika internal fungsi-fungsi ini tetap sama.
// Contoh:
// export const registerUser = async (req, res) => { ... } // Pindah ke AuthController
// Logika internal fungsi-fungsi ini tetap sama.
// Contoh:
export const getAllUsers = async (req, res) => { /* ... kode Anda ... */
  try {
    const users = await UserService.getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Controller Error - getAllUsers:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};
export const getUserById = async (req, res) => { /* ... kode Anda ... */
  try {
    const user = await UserService.getUserByIdService(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Controller Error - getUserById:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'User tidak ditemukan atau terjadi kesalahan.' });
  }
};
export const updateUser = async (req, res) => { /* ... kode Anda ... */
  try {
    const updatedUser = await UserService.updateUserService(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'User berhasil diperbarui.', data: updatedUser });
  } catch (error) {
    console.error("Controller Error - updateUser:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};
export const deleteUser = async (req, res) => { /* ... kode Anda ... */
  try {
    await UserService.deleteUserService(req.params.id);
    res.status(200).json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    console.error("Controller Error - deleteUser:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan pada server.' });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    // req.user populated by authMiddleware
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID tidak ditemukan dalam token.' });
    }
    const user = await UserService.getUserByIdService(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Controller Error - getMyProfile:", error.message);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Terjadi kesalahan saat mengambil profil.' });
  }
};

// --- KONTROLER BARU UNTUK LOGIN ---
// --- KONTROLER LOGIN DIPINDAH KE AUTH CONTROLLER ---
// export const loginUser = ...


// --- KONTROLER BARU UNTUK LOGOUT ---
// --- KONTROLER LOGOUT BISA DIHAPUS ATAU DIPINDAH ---
// export const logoutUser = ...