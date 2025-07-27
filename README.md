# Manga Colorizer - React Native App

Aplikasi React Native untuk mewarnai manga menggunakan AI dengan dukungan multi-format file dan integrasi model Hugging Face.

## 🚀 Fitur Utama

- **Multi-format Support**: Mendukung gambar (.jpg, .jpeg, .png, .gif, .bmp, .webp) dan arsip (.zip, .cbz)
- **AI-Powered Coloring**: Menggunakan model Hugging Face untuk pewarnaan manga otomatis
- **Cross-Platform**: Berjalan di Android, iOS, dan Web
- **Batch Processing**: Dapat memproses multiple gambar sekaligus
- **Local Storage**: Menyimpan riwayat pewarnaan secara lokal
- **Responsive Design**: UI yang responsif untuk berbagai ukuran layar

## 🛠️ Teknologi yang Digunakan

### Frontend (React Native)
- **React Native**: Framework utama untuk pengembangan cross-platform
- **Expo**: Platform untuk pengembangan dan deployment React Native
- **AsyncStorage**: Penyimpanan data lokal
- **Expo Document Picker**: Pemilihan file dan dokumen
- **Expo Image Picker**: Pemilihan gambar dari galeri
- **Expo File System**: Manajemen file sistem

### Backend (Flask API)
- **Flask**: Framework web Python untuk API
- **Flask-CORS**: Handling Cross-Origin Resource Sharing
- **Pillow (PIL)**: Pemrosesan gambar
- **NumPy**: Operasi array dan matematika
- **Requests**: HTTP client untuk komunikasi dengan Hugging Face API

### AI Model
- **Hugging Face**: Platform untuk model AI
- **Model**: Keiser41/Example_Based_Manga_Colorization
- **Type**: Image-to-Image transformation untuk pewarnaan manga

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

manga-colorizer-backend/
├── app.py                # Server Flask utama
├── requirements.txt      # Dependencies Python
├── uploads/              # Folder untuk file upload sementara
└── results/              # Folder untuk hasil pewarnaan
```

## 🔧 Instalasi dan Setup

### Prerequisites
- Node.js (v20.18.0 atau lebih baru)
- Python 3.11+
- npm atau yarn
- Expo CLI

### Setup Frontend

1. **Clone repository dan masuk ke direktori proyek**
   ```bash
   cd manga-colorizer
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

### Setup Backend

1. **Masuk ke direktori backend**
   ```bash
   cd manga-colorizer-backend
   ```

2. **Install dependencies Python**
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Jalankan server Flask**
   ```bash
   python3 app.py
   ```

Server akan berjalan di `http://localhost:5000`

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

## 🔌 API Endpoints

### Backend Flask API

#### Health Check
```
GET /health
```
Mengecek status kesehatan API.

#### Colorize Single Image
```
POST /colorize
Content-Type: multipart/form-data

Parameters:
- image: File gambar yang akan diwarnai
- reference: (Optional) File gambar referensi untuk pewarnaan
```

#### Colorize Batch Images
```
POST /colorize_batch
Content-Type: multipart/form-data

Parameters:
- images: Multiple file gambar yang akan diwarnai
- reference: (Optional) File gambar referensi untuk pewarnaan
```

#### Get Available Models
```
GET /models
```
Mendapatkan daftar model AI yang tersedia.

#### Download Result
```
GET /download/<filename>
```
Mengunduh file hasil pewarnaan.

## 🤖 Model AI

Aplikasi ini menggunakan model **Keiser41/Example_Based_Manga_Colorization** dari Hugging Face:

- **Jenis**: Conditional Generative Adversarial Network (cGAN)
- **Input**: Gambar manga grayscale
- **Output**: Gambar manga berwarna
- **Fitur**: Mendukung pewarnaan berdasarkan gambar referensi

### Cara Kerja Model
1. **Color Embedding Layer**: Mengekstrak fitur warna dari gambar referensi
2. **Content Embedding**: Mengekstrak fitur konten dari gambar grayscale
3. **Progressive Feature Formalization Block (PFFB)**: Menggabungkan fitur warna dan konten
4. **Discriminator**: Memastikan kualitas hasil pewarnaan

## 🌐 Deployment

### Web Deployment (Expo)
Aplikasi dapat di-deploy sebagai web app menggunakan Expo:

```bash
npm run web
```

### Production Deployment
Untuk deployment production, gunakan:

```bash
expo build:web
```

## 🔐 Konfigurasi

### Environment Variables
Buat file `.env` di direktori backend dengan konfigurasi berikut:

```env
HUGGING_FACE_TOKEN=your_hugging_face_token_here
MODEL_URL=https://api-inference.huggingface.co/models/Keiser41/Example_Based_Manga_Colorization
```

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

### API Testing
Gunakan tools seperti Postman atau curl untuk test API endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Test colorize endpoint
curl -X POST -F "image=@test_image.jpg" http://localhost:5000/colorize
```

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

3. **Model Hugging Face timeout**
   - Model mungkin sedang "cold start"
   - Tunggu beberapa menit dan coba lagi
   - Check Hugging Face API status

4. **File upload gagal**
   - Check ukuran file (maksimal yang didukung)
   - Pastikan format file didukung
   - Check permissions folder upload

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

- **Developer**: Manus AI Assistant
- **Model**: Keiser41/Example_Based_Manga_Colorization (Hugging Face)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) untuk platform AI model
- [Expo](https://expo.dev/) untuk framework React Native
- [Flask](https://flask.palletsprojects.com/) untuk backend framework
- Komunitas open source untuk berbagai library yang digunakan

---

**Note**: Aplikasi ini dibuat untuk tujuan edukasi dan demonstrasi. Pastikan untuk mematuhi terms of service dari Hugging Face dan model yang digunakan.

