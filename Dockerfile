# Gunakan Node.js image yang ringan
FROM node:18-alpine

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin file dependency terlebih dahulu (agar cache efisien)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Buka port (Next.js default di 3000)
EXPOSE 3000

# Jalankan aplikasi Next.js di mode development
CMD ["npm", "run", "dev"]
