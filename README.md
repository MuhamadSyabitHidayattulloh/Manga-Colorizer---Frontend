# Manga Colorizer - Frontend (React Native)

Aplikasi React Native untuk mewarnai manga menggunakan AI dengan dukungan multi-format file dan integrasi dengan backend API.

## 🚀 Fitur Utama

- **Multi-format Support**: Mendukung gambar (.jpg, .jpeg, .png, .gif, .bmp, .webp) dan arsip (.zip, .cbz)
- **AI-Powered Coloring**: Mengintegrasikan dengan backend untuk pewarnaan manga otomatis
- **Cross-Platform**: Berjalan di Android, iOS, dan Web
- **Batch Processing**: Dapat memproses multiple gambar sekaligus
- **Local Storage**: Menyimpan riwayat pewarnaan secara lokal
- **Responsive Design**: UI yang responsif untuk berbagai ukuran layar

## 🛠️ Teknologi yang Digunakan

- **React Native**: Framework utama untuk pengembangan cross-platform
- **Expo**: Platform untuk pengembangan dan deployment React Native
- **AsyncStorage**: Penyimpanan data lokal
- **Expo Document Picker**: Pemilihan file dan dokumen
- **Expo Image Picker**: Pemilihan gambar dari galeri
- **Expo File System**: Manajemen file sistem

## 📁 Struktur Proyek

```
manga-colorizer/
├── App.js                 # Komponen utama aplikasi
├── package.json           # Dependencies dan scripts
├── services/
│   └── apiService.js      # Service untuk komunikasi dengan backend API
├── utils/
│   ├── fileHandler.js     # Utility untuk handling file dan ekstraksi arsip
│   └── storage.js         # Utility untuk penyimpanan lokal
└── README.md             # Dokumentasi proyek
```

## 🔧 Instalasi dan Setup

### Prerequisites
- Node.js (v20.18.0 atau lebih baru)
- npm atau yarn
- Expo CLI

### Setup Frontend

1. **Clone repository dan masuk ke direktori proyek**
   ```bash
   git clone https://github.com/MuhamadSyabitHidayattulloh/Manga-Colorizer---Frontend.git
   cd Manga-Colorizer---Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install dependencies web tambahan**
   ```bash
   npx expo install react-dom react-native-web @expo/metro-runtime
   ```

4. **Jalankan aplikasi**
   ```bash
   # Untuk web
   npm run web
   
   # Untuk Android
   npm run android
   
   # Untuk iOS
   npm run ios
   ```

## 🎯 Cara Penggunaan

### 1. Memilih Gambar
- Klik tombol "📷 Pick Images" untuk memilih gambar dari galeri
- Klik tombol "📁 Pick Files" untuk memilih file arsip (.zip, .cbz)

### 2. Mewarnai Gambar
- Setelah memilih gambar, klik tombol "🎨 Colorize Images"
- Aplikasi akan mengirim gambar ke backend untuk diproses
- Tunggu hingga proses pewarnaan selesai

### 3. Melihat Hasil
- Hasil pewarnaan akan ditampilkan di halaman hasil
- Riwayat pewarnaan disimpan secara lokal dan dapat diakses kapan saja

## 🔐 Konfigurasi

### API Configuration
Update `API_BASE_URL` di `services/apiService.js` sesuai dengan URL backend Anda:

```javascript
const API_BASE_URL = 'http://localhost:5000'; // Untuk development
// const API_BASE_URL = 'https://your-backend-url.com'; // Untuk production
```

## 🧪 Testing

### Manual Testing
1. Jalankan backend dan frontend
2. Test pemilihan gambar tunggal
3. Test pemilihan multiple gambar
4. Test pemilihan file arsip
5. Test proses pewarnaan
6. Test penyimpanan dan riwayat

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler error**
   ```bash
   npx expo start --clear
   ```

2. **Backend tidak dapat diakses**
   - Pastikan Flask server berjalan di port 5000
   - Check firewall settings
   - Pastikan CORS dikonfigurasi dengan benar

## 📝 Development Notes

### Best Practices
- Gunakan TypeScript untuk type safety (opsional)
- Implement proper error handling
- Add loading states untuk UX yang lebih baik
- Optimize image sizes sebelum upload
- Implement caching untuk hasil pewarnaan

### Future Enhancements
- Support untuk format file tambahan (.rar, .7z)
- Batch processing dengan progress indicator
- Cloud storage integration
- User authentication
- Social sharing features
- Custom model training interface

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Authors

- **Developer**: Muhamad Syabit Hidayattulloh

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) untuk framework React Native
- Komunitas open source untuk berbagai library yang digunakan

---

**Note**: Aplikasi ini dibuat untuk tujuan edukasi dan demonstrasi.

