# Nodejs Express MongoDB Boilerplate

## Yêu cầu

- Node.js phiên bản >= 18
- pnpm (cài đặt thông qua lệnh `npm install -g pnpm`)

## Cài đặt

```bash
# Cài đặt dependencies
pnpm install
```

## Chạy ứng dụng

```bash
# Chạy ở môi trường phát triển với nodemon (tự động khởi động lại khi có thay đổi)
pnpm dev

# Chạy ở môi trường phát triển với Node.js watch mode
pnpm dev:watch

# Chạy ở môi trường production
pnpm start
```

## Cấu trúc dự án

```
server.js - Entry point
src/
  app.js - Express application
  controllers/ - Xử lý logic
  dbs/ - Cấu hình database
  models/ - Models cho MongoDB
    repository/ - Tầng truy xuất dữ liệu
  routes/ - Định nghĩa routes
  services/ - Business logic
```