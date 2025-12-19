import multer from 'multer';
import path from 'path';
import fs from 'fs'; // <-- Impor module 'fs' untuk operasi file system

// Tentukan direktori tujuan
const uploadDir = 'public/uploads/';

// Pastikan direktori ada, jika tidak, buat secara rekursif
fs.mkdirSync(uploadDir, { recursive: true });

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Gunakan variabel direktori
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file untuk hanya menerima tipe gambar tertentu
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
    'application/octet-stream' // <-- Izinkan tipe generik
  ];

  if (allowedTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, JPG) yang diizinkan!'), false); // Tolak file
  }
};


const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Batas ukuran file 5 MB
  },
  fileFilter: fileFilter
});

export default upload;