// ===========================================
// FILE: assets/js/quiz.js
// FUNGSIONALITAS: Menangani Logika Kuis, Skor, dan Upload ke Firebase
// ===========================================

// Variabel Global
let database = null;
let currentBab = '';
let currentSoal = null;

// 1. Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek koneksi database
    if (window.firebaseConfig && window.firebaseConfig.getDatabase) {
        database = window.firebaseConfig.getDatabase();
    } else {
        alert("Gagal memuat database. Silakan refresh halaman.");
    }

    // Ambil Parameter URL (?bab=A&kelas=1)
    const urlParams = new URLSearchParams(window.location.search);
    currentBab = urlParams.get('bab');
    const kelas = urlParams.get('kelas');

    // Validasi Data Soal
    if (!currentBab || !window.BANK_SOAL || !window.BANK_SOAL[currentBab]) {
        alert("Soal tidak ditemukan atau Kode Bab salah!");
        window.history.back();
        return;
    }

    // Simpan data soal ke variabel global
    currentSoal = window.BANK_SOAL[currentBab];
    
    // Ubah Judul Halaman
    document.getElementById('judul-kuis').innerText = `Kuis PJOK Bab ${currentBab}`;
});

// 2. Fungsi Mulai Kuis
function mulaiKuis() {
    const nama = document.getElementById('inputNama').value;
    const guru = document.getElementById('inputGuru').value;

    if (!nama || !guru) {
        alert("Mohon lengkapi Nama Siswa dan Nama Guru!");
        return;
    }

    // Sembunyikan Form, Tampilkan Kuis
    document.getElementById('form-identitas').style.display = 'none';
    document.getElementById('lembar-kuis').style.display = 'block';
    
    renderSoal();
}

// 3. Render Soal ke HTML
function renderSoal() {
    const container = document.getElementById('container-soal');
    let html = '';

    // --- BAGIAN I: PILIHAN GANDA (Wajib Ada) ---
    if (currentSoal.pg && currentSoal.pg.length > 0) {
        html += `<div class="section-header">BAGIAN I: PILIHAN GANDA</div>`;
        currentSoal.pg.forEach((item, index) => {
            html += `
            <div class="soal-card">
                <span class="soal-text">${index + 1}. ${item.q}</span>
                ${item.opt.map((opt, i) => `
                    <label class="option-label">
                        <input type="radio" name="pg_${index}" value="${i}"> 
                        ${String.fromCharCode(65 + i)}. ${opt}
                    </label>
                `).join('')}
            </div>`;
        });
    }

    // --- BAGIAN II: ISIAN (Cek apakah ada datanya) ---
    // Logika perbaikan: Bab A/B tidak punya isian, jadi kita cek dulu
    if (currentSoal.isian && currentSoal.isian.length > 0) {
        html += `<div class="section-header">BAGIAN II: ISIAN SINGKAT</div>`;
        currentSoal.isian.forEach((soal, index) => {
            html += `
            <div class="soal-card">
                <span class="soal-text">Soal ${index + 1}: ${soal}</span>
                <input type="text" class="form-control" id="isian_${index}" placeholder="Jawaban Anda...">
            </div>`;
        });
    }

    // --- BAGIAN III: ESSAY (Biasanya ada) ---
    if (currentSoal.essay && currentSoal.essay.length > 0) {
        html += `<div class="section-header">BAGIAN III: URAIAN / ESSAY</div>`;
        currentSoal.essay.forEach((soal, index) => {
            html += `
            <div class="soal-card">
                <span class="soal-text">Soal ${index + 1}: ${soal}</span>
                <textarea class="form-control" id="essay_${index}" rows="3" placeholder="Jelaskan jawabanmu..."></textarea>
            </div>`;
        });
    }

    container.innerHTML = html;
    window.scrollTo(0, 0);
}

// 4. Hitung Nilai & Kirim ke Firebase
function kirimJawaban() {
    if (!confirm("Yakin ingin mengirim jawaban? Periksa kembali ya!")) return;

    // A. HITUNG SKOR PG
    let skorPG = 0;
    let benar = 0;
    let totalPG = currentSoal.pg ? currentSoal.pg.length : 0;

    if (totalPG > 0) {
        currentSoal.pg.forEach((item, index) => {
            const radio = document.querySelector(`input[name="pg_${index}"]:checked`);
            if (radio) {
                const jawabanSiswa = parseInt(radio.value);
                if (jawabanSiswa === item.ans) {
                    benar++;
                }
            }
        });
        // Rumus Nilai 0-100
        skorPG = Math.round((benar / totalPG) * 100);
    }

    // B. AMBIL JAWABAN ISIAN (Jika Ada)
    let jawabanIsian = [];
    if (currentSoal.isian) {
        currentSoal.isian.forEach((_, index) => {
            const val = document.getElementById(`isian_${index}`).value;
            jawabanIsian.push(val || "-");
        });
    }

    // C. AMBIL JAWABAN ESSAY
    let jawabanEssay = [];
    if (currentSoal.essay) {
        currentSoal.essay.forEach((_, index) => {
            const val = document.getElementById(`essay_${index}`).value;
            jawabanEssay.push(val || "-");
        });
    }

    // D. PERSIAPAN DATA UNTUK DATABASE
    const siswaData = {
        nama: document.getElementById('inputNama').value,
        kelas: document.getElementById('inputKelas').value,
        guru: document.getElementById('inputGuru').value,
        sekolah: document.getElementById('inputSekolah').value,
        bab: currentBab,
        
        // Data Nilai
        nilai_pg: skorPG,
        jml_benar_pg: benar,
        total_soal_pg: totalPG,
        
        // Jawaban Teks (Untuk diperiksa manual)
        jawaban_isian: jawabanIsian,
        jawaban_essay: jawabanEssay,
        
        waktu_selesai: new Date().toLocaleString()
    };

    simpanKeFirebase(siswaData, skorPG);
}

function simpanKeFirebase(dataSiswa, skorAkhir) {
    const loading = document.getElementById('loading-overlay');
    const quizArea = document.getElementById('lembar-kuis');
    const hasilArea = document.getElementById('hasil-area');

    quizArea.style.display = 'none';
    loading.style.display = 'block';

    // Buat ID unik berdasarkan Nama + Jam
    const cleanName = dataSiswa.nama.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const unikId = `${cleanName}_${Date.now()}`;

    // Path Database: hasil_kuis / kelas_1 / BAB_A / uid
    const dbPath = `hasil_kuis/kelas_1/${currentBab}/${unikId}`;

    database.ref(dbPath).set(dataSiswa)
        .then(() => {
            console.log("✅ Data berhasil disimpan!");
            loading.style.display = 'none';
            hasilArea.style.display = 'block';
            document.getElementById('skor-akhir').innerText = skorAkhir;
        })
        .catch((error) => {
            console.error("❌ Gagal menyimpan:", error);
            loading.style.display = 'none';
            alert("Maaf, terjadi kesalahan koneksi. Silakan coba kirim ulang.");
            quizArea.style.display = 'block'; // Tampilkan soal lagi jika gagal
        });
}