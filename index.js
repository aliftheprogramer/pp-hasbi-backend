import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'; // Impor modul 'path' dari Node.js
import { fileURLToPath } from 'url'; // Untuk mendapatkan path direktori dengan ES Modules

import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import articleRoutes from './src/routes/articleRoutes.js';
import fishRoutes from './src/routes/fishRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import connectDB from './src/config/database.js';

// Connect to Database
connectDB();

// --- BAGIAN KRUSIAL UNTUK MENDAPATKAN PATH DIREKTORI YANG BENAR ---
// Ini diperlukan saat menggunakan ES Modules (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- AKHIR BAGIAN KRUSIAL ---

const app = express();
const PORT = process.env.PORT || 3000;

// Enable request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware CORS - Allow all origins

// Middleware CORS - Allow all origins specially for Vercel and local dev
app.use(cors({
  origin: true, // Berarti allow semua origin, bisa diganti array string domain frontend
  credentials: true, // Izinkan cookie / header otorisasi
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle Preflight Requests explicitly
app.options(/.*/, cors());


// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- MIDDLEWARE UNTUK MENYAJIKAN FILE STATIS (GAMBAR) ---
// Ini harus ditempatkan SEBELUM Anda mendaftarkan rute API Anda.
// `path.join(__dirname, '../public/uploads')` akan membuat path yang benar:
// dari `src/` (lokasi __dirname) -> keluar satu level `../` -> masuk ke `public/uploads`
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));
// --- AKHIR MIDDLEWARE STATIS ---





// Daftarkan Rute
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/fish', fishRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);



app.get('/', (req, res) => {
  res.send('Selamat datang di Backend PUI App!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} diterima, menutup server...`);
    process.exit(0);
  });
});

export default app;