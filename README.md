# Dokumentasi Run Docker

## Untuk Development
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Untuk Production
```bash
# Note: Kamu mungkin perlu oper env var manual atau tetap pakai env_file untuk tes lokal
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```
