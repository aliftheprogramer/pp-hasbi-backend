# User API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### Register
**Endpoint**: `POST /auth/register`
**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "USER" // Optional, default is USER
}
```

### Login
**Endpoint**: `POST /auth/login`
**Body** (JSON):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbG..." // Gunakan token ini untuk request yang membutuhkan autentikasi
  }
}
```

---

## User Profile

### Get My Profile
**Endpoint**: `GET /users/profile`
**Headers**: `Authorization: Bearer <token>`
**Description**: Mengambil data profil user yang sedang login.
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "..."
  }
}
```

### Update User (Self/Admin)
**Endpoint**: `PUT /users/:id`
**Description**: Update data user.
**Body**: `{ "name": "New Name", "email": "new@mail.com" }`

---

## Articles (Edukasi)

### Get All Articles
**Endpoint**: `GET /articles`
**Description**: Mengambil daftar semua artikel edukasi.

### Get Article By ID
**Endpoint**: `GET /articles/:id`
**Description**: Mengambil detail satu artikel.

---

## Fish References (Ensiklopedia Ikan)

### Get All Fish
**Endpoint**: `GET /fish`
**Description**: Mengambil daftar referensi ikan predator/hama.

### Get Fish By ID
**Endpoint**: `GET /fish/:id`
**Description**: Mengambil detail referensi ikan.

---

## Reports (Pelaporan)

### Create Report
**Endpoint**: `POST /reports`
**Headers**:
- `Authorization`: `Bearer <token>`
- `Content-Type`: `multipart/form-data`
**Body** (Form-Data):
- `photo`: File gambar (Wajib)
- `description`: Text deskripsi laporan (Wajib)
- `latitude`: Koordinat latitude (Wajib, decimal)
- `longitude`: Koordinat longitude (Wajib, decimal)
- `addressText`: Alamat teks (Opsional)
- `fishReferenceId`: ID dari referensi ikan jika diketahui (Opsional)
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "PENDING",
    "photoUrl": "http://localhost:3000/uploads/..."
    ...
  }
}
```

### Get My Reports
**Endpoint**: `GET /reports/my-reports`
**Headers**: `Authorization: Bearer <token>`
**Description**: Mengambil daftar laporan yang dibuat oleh user yang sedang login.

### Get Public Approved Reports
**Endpoint**: `GET /reports/public/approved`
**Headers**: `Authorization: Bearer <token>`
**Description**: Mengambil semua laporan yang sudah disetujui (APPROVED) untuk ditampilkan ke publik/informasi.

### Get All Reports (General)
**Endpoint**: `GET /reports`
**Headers**: `Authorization: Bearer <token>`
**Description**: Mengambil semua laporan (bisa difilter ?status=...).

### Get Report By ID
**Endpoint**: `GET /reports/:id`
**Headers**: `Authorization: Bearer <token>`

### Update Report
**Endpoint**: `PUT /reports/:id`
**Headers**: `Authorization: Bearer <token>`
**Body**: JSON fields to update.

### Delete Report
**Endpoint**: `DELETE /reports/:id`
**Headers**: `Authorization: Bearer <token>`
