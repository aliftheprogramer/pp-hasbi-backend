# Admin API Documentation

Base URL: `http://localhost:3000/api`

**Authentication Required**:
*   Header: `Authorization: Bearer <token>`
*   Role: User must have `role: "ADMIN"`

---

## Dashboard

### Get Dashboard Stats
**Endpoint**: `GET /admin/dashboard`
**Description**: Mengambil statistik ringkasan untuk dashboard admin.
**Response**:
```json
{
  "success": true,
  "data": {
    "countUser": 5,
    "countReportPending": 2,
    "countReportApproved": 5,
    "countReportRejected": 3,
    "countReportSolved": 1
  }
}
```

---

## Map (Peta Persebaran)

### Get All Reports for Map
**Endpoint**: `GET /admin/map`
**Description**: Mengambil semua laporan beserta data lokasi (latitude/longitude) dan statusnya untuk ditampilkan di peta.
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "status": "PENDING",
      "photoUrl": "http://localhost:3000/uploads/photo-123.jpg",
      "fishReference": {
        "name": "Ikan Sapu-sapu",
        "dangerLevel": "MEDIUM"
      },
      "user": {
        "name": "Pelapor 1"
      }
    },
    ...
  ]
}
```

---

## Reports List (Daftar Laporan)

### Get All Reports
**Endpoint**: `GET /admin/reports`
**Description**: Mengambil semua laporan dalam bentuk list (sama dengan endpoint map, tetapi semantik untuk list view).
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "description": "Ada ikan aneh",
      "status": "PENDING",
      "user": { "name": "Budi" },
      "fishReference": { "name": "Arapaima" },
      "photoUrl": "http://localhost:3000/uploads/photo-123.jpg",
      ...
    }
  ]
}
```

---

## Report Actions (Tindakan)

### Update Report Status
**Endpoint**: `PUT /admin/reports/:id/status`
**Description**: Mengubah status laporan.
**Body** (JSON):
```json
{
  "status": "APPROVED", // "APPROVED" | "REJECTED" | "PENDING" | "SOLVED"
  "adminNote": "Laporan valid, tim segera meluncur." // Optional
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "status": "APPROVED",
    "adminNote": "Laporan valid, tim segera meluncur.",
    "updatedAt": "..."
  }
}
```
