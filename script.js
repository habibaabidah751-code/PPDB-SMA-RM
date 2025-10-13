document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ppdb-form');
    const formSteps = Array.from(form.querySelectorAll('.form-step'));
    const nextButtons = form.querySelectorAll('.next-btn');
    const prevButtons = form.querySelectorAll('.prev-btn');
    const progressSteps = document.querySelectorAll('.step');

    let currentStep = 0;

    const updateFormSteps = () => {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active-step', index === currentStep);
        });

        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.add('active'); // Tetap aktif untuk warna
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    };

    const validateStep = (stepIndex) => {
        const currentStepFields = formSteps[stepIndex].querySelectorAll('[required]');
        let isValid = true;
        for (const field of currentStepFields) {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error-red)';
            } else {
                field.style.borderColor = 'var(--border-color)';
            }
        }
        if (!isValid) alert('Mohon lengkapi semua data yang wajib diisi.');
        return isValid;
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < formSteps.length - 1) {
                    if(currentStep === 2) { // Sebelum ke langkah konfirmasi
                        generateSummary();
                    }
                    currentStep++;
                    updateFormSteps();
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateFormSteps();
            }
        });
    });
    
    const generateSummary = () => {
        const summaryDiv = document.getElementById('summary');
        const formData = new FormData(form);
        let summaryHTML = '<h3>Ringkasan Data Pendaftaran</h3>';
        
        const labels = {
            nama_lengkap: "Nama Lengkap",
            nisn: "NISN",
            nik: "NIK",
            tempat_lahir: "Tempat Lahir",
            tanggal_lahir: "Tanggal Lahir",
            jenis_kelamin: "Jenis Kelamin",
            nama_ayah: "Nama Ayah",
            nama_ibu: "Nama Ibu",
            no_telepon_ortu: "No. Telp Orang Tua",
            jalur_pendaftaran: "Jalur Pendaftaran",
            asal_sekolah: "Asal Sekolah"
        };

        for (const [key, value] of formData.entries()) {
            if (labels[key] && value) {
                summaryHTML += `<p><strong>${labels[key]}:</strong> ${value}</p>`;
            }
        }
        summaryDiv.innerHTML = summaryHTML;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validasi langkah terakhir (checkbox konfirmasi)
        const confirmationCheckbox = document.getElementById('konfirmasi_data');
        if (!confirmationCheckbox.checked) {
            alert('Anda harus menyetujui pernyataan konfirmasi data.');
            return;
        }

        // --- SIMULASI PENGIRIMAN DATA KE BACKEND ---
        console.log("Data siap dikirim ke server...");

        const formData = new FormData(form);
        
        // Menampilkan loading (bisa diganti dengan spinner)
        const submitButton = form.querySelector('.submit-btn');
        submitButton.textContent = 'Mengirim...';
        submitButton.disabled = true;

        try {
            // Ini adalah bagian di mana Anda akan mengirim data ke server
            // dengan menggunakan fetch() atau Axios
            
            // Contoh dengan fetch() (di-comment karena tidak ada backend nyata)
            /*
            const response = await fetch('URL_SERVER_ANDA/api/register', {
                method: 'POST',
                body: formData 
            });

            if (!response.ok) {
                throw new Error('Terjadi kesalahan pada server.');
            }

            const result = await response.json();
            console.log('Server response:', result);
            */

            // Simulasi delay jaringan selama 2 detik
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Tampilkan pesan sukses
            form.style.display = 'none';
            document.querySelector('.progress-bar').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';

        } catch (error) {
            console.error('Gagal mengirim data:', error);
            alert('Gagal mengirim pendaftaran. Silakan coba lagi.');
            submitButton.textContent = 'Kirim Pendaftaran';
            submitButton.disabled = false;
        }
    });
    
    // Inisialisasi form
    updateFormSteps();
});
// Backend (Node.js + Express) - Simulasi sederhana
const express = require('express');
const multer = require('multer'); // Untuk handle file upload
const cors = require('cors'); // Untuk mengizinkan request dari domain lain

const app = express();
const port = 3000;

// Konfigurasi untuk menyimpan file yang diupload
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Membaca body JSON
app.use(express.urlencoded({ extended: true })); // Membaca form data

// "Endpoint" atau URL yang akan dituju oleh form frontend
app.post('/api/register', upload.fields([{ name: 'file_kk' }, { name: 'file_ijazah' }]), (req, res) => {
    
    // 1. Menerima Data
    const dataSiswa = req.body; // Semua data teks dari form
    const files = req.files; // Data file (KK, Ijazah)
    
    console.log('Data Diterima:', dataSiswa);
    console.log('File Diterima:', files);

    // 2. Validasi di Server (Penting!)
    // Lakukan validasi ulang di sini untuk keamanan.
    // Contoh: cek apakah NISN sudah terdaftar, dll.

    // 3. Simpan ke Database
    // Di sini Anda akan menulis kode untuk koneksi ke database (misal: MySQL, MongoDB)
    // dan menyimpan 'dataSiswa' serta path dari 'files' ke dalam tabel siswa.
    // CONTOH: db.query('INSERT INTO siswa SET ?', dataSiswa, (err, result) => { ... });
    
    // 4. Kirim Balasan ke Frontend
    // Jika berhasil menyimpan ke database:
    res.status(200).json({ success: true, message: 'Pendaftaran berhasil diterima!' });
    
    // Jika ada error:
    // res.status(500).json({ success: false, message: 'Gagal menyimpan data.' });
});

app.listen(port, () => {
    console.log(`Server PPDB berjalan di http://localhost:${port}`);
});
