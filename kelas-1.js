// ===========================================
// FILE: assets/js/kelas-1.js
// FUNGSIONALITAS: Mengelola Materi & Koneksi Kuis Kelas 1
// ===========================================

console.log('🚀 Script Kelas 1 Berhasil Dimuat!');

// 1. DATA MATERI
const dataMateri = {
    'A': {
        judul: "A. Gerak Dasar Jalan & Lari",
        subLabel: "Gerak Lokomotor",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p><b>Pengertian:</b> Gerak Lokomotor adalah perpindahan tempat.</p><ul><li>Jalan: Langkah santai.</li><li>Lari: Langkah cepat.</li></ul>`
    },
    'B': {
        judul: "B. Gerak Lompat & Loncat",
        subLabel: "Melompat vs Meloncat",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p><b>Melompat:</b> Tumpuan satu kaki.<br><b>Meloncat:</b> Tumpuan dua kaki.</p>`
    },
    'C': {
        judul: "C. Memutar & Menekuk",
        subLabel: "Gerak Non-Lokomotor",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Gerakan diam di tempat seperti memutar tangan atau menekuk lutut.</p>`
    },
    'D': {
        judul: "D. Lempar Tangkap",
        subLabel: "Gerak Manipulatif",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Gerakan menggunakan alat bantu seperti bola.</p>`
    },
    'STS': {
        judul: "Sumatif Tengah Semester",
        subLabel: "Evaluasi Semester 1",
        video: "",
        isExam: true,
        isi: `<p>Ujian Tengah Semester untuk materi Bab A sampai D.</p>`
    },
    'E': {
        judul: "E. Sikap Tubuh",
        subLabel: "Postur Sehat",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Cara duduk, berdiri, dan berjalan yang benar.</p>`
    },
    'F': {
        judul: "F. Gerak Berirama",
        subLabel: "Senam Irama",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Gerakan mengikuti musik atau hitungan.</p>`
    },
    'G': {
        judul: "G. Aktivitas Air",
        subLabel: "Renang Dasar",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Pengenalan air dan keselamatan di kolam renang.</p>`
    },
    'H': {
        judul: "H. Kebersihan Diri",
        subLabel: "Pola Hidup Sehat",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        isi: `<p>Mandi, gosok gigi, dan cuci tangan teratur.</p>`
    },
    'SAS': {
        judul: "Sumatif Akhir Semester",
        subLabel: "Evaluasi Akhir",
        video: "",
        isExam: true,
        isi: `<p>Ujian Akhir Semester untuk seluruh materi.</p>`
    }
};

// Variabel Global
let babAktif = 'A';
let database = null;

// 2. INISIALISASI
document.addEventListener('DOMContentLoaded', () => {
    // Cek Database
    if (window.firebaseConfig && window.firebaseConfig.getDatabase) {
        database = window.firebaseConfig.getDatabase();
        console.log("✅ Database Firebase Terhubung");
    } else {
        console.error("❌ Gagal koneksi database");
    }

    // Muat Bab Awal
    gantiMateri('A');
});

// 3. FUNGSI UTAMA (Diakses oleh HTML)
window.gantiMateri = function(kode) {
    babAktif = kode;
    const data = dataMateri[kode];

    if (!data) return;

    // Update Teks
    document.getElementById('judul-materi').innerText = data.judul;
    document.getElementById('label-bab').innerText = data.subLabel;
    document.getElementById('isi-rangkuman').innerHTML = data.isi;

    // Update Video
    const areaVideo = document.getElementById('area-video');
    const iframe = document.getElementById('video-frame');
    
    if (data.isExam) {
        areaVideo.style.display = 'none';
        iframe.src = "";
    } else {
        areaVideo.style.display = 'block';
        iframe.src = data.video;
    }

    // Update Tombol Aktif
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById('btn-' + kode);
    if(btn) btn.classList.add('active');

    // Cek Status Kuis
    cekStatusKuis();
};

function cekStatusKuis() {
    if (!database) return;

    const btn = document.getElementById('btn-kuis-main');
    
    // Reset tombol
    btn.innerHTML = "⏳ CEK STATUS...";
    btn.className = "btn-action btn-locked";
    btn.onclick = null;

    // Cek database
    database.ref(`akses_soal/kelas_1/${babAktif}`).on('value', (snapshot) => {
        const isOpen = snapshot.val() === true;
        
        if (isOpen) {
            btn.innerHTML = `⚡ MULAI KUIS ${babAktif}`;
            btn.className = "btn-action btn-quiz";
            btn.onclick = () => {
                // Perhatikan path ini: Mundur 1 langkah (ke folder kelas), lalu ke file kuis
                window.location.href = `../kuis_universal.html?bab=${babAktif}&kelas=1`;
            };
        } else {
            btn.innerHTML = "🔒 TERKUNCI";
            btn.className = "btn-action btn-locked";
            btn.onclick = () => {
                alert("⛔ Maaf, kuis ini belum dibuka oleh Bapak Guru.");
            };
        }
    });
}