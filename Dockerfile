# Menggunakan image ubuntu/nginx sebagai dasar
FROM ubuntu/nginx:latest

# Membuka port 80
EXPOSE 80

# Menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
