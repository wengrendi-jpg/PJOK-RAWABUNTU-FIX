// ===========================================
// === 1. FUNGSI UNTUK MENGAMBIL DATA SISWA ===
// ===========================================

function getSiswaInfo() {
    const nama = localStorage.getItem('namaSiswa');
    const sekolah = localStorage.getItem('asalSekolah');
    return { nama, sekolah };
}

// ===========================================
// === 2. FUNGSI PROSES LOGIN (index.html) ===
// ===========================================

function prosesLogin() {
    const namaSiswaInput = document.getElementById('namaSiswa').value.trim();
    const asalSekolahInput = document.getElementById('asalSekolah').value.trim();
    const pesanError = document.getElementById('pesanError');

    // Cek apakah input kosong
    if (namaSiswaInput === "" || asalSekolahInput === "") {
        pesanError.style.display = 'block';
        return; // Hentikan proses jika ada input kosong
    }

    // Jika input terisi, simpan ke Local Storage
    localStorage.setItem('namaSiswa', namaSiswaInput);
    localStorage.setItem('asalSekolah', asalSekolahInput);
    
    // Redirect ke halaman dashboard
    window.location.href = "dashboard.html";
}

// ===========================================
// === 3. FUNGSI PROSES LOGOUT (dashboard.html) ===
// ===========================================

function logout() {
    // Hapus data siswa dari Local Storage
    localStorage.removeItem('namaSiswa');
    localStorage.removeItem('asalSekolah');
    
    // Redirect kembali ke halaman login
    window.location.href = "index.html";
}

// ===========================================
// === 4. FUNGSI UNTUK MEMUAT DATA DI DASHBOARD ===
// (Ini dipanggil saat dashboard.html dibuka)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const siswa = getSiswaInfo();

    // Logika Pengamanan Halaman
    if (currentPath.includes('dashboard.html') || currentPath.includes('materi-kelas-')) {
        if (!siswa.nama) {
            // Jika tidak ada data siswa, paksa kembali ke login
            alert('Akses ditolak! Silakan login terlebih dahulu.');
            window.location.href = "index.html";
            return;
        }
        
        // Update sapaan di Dashboard
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            // Mengambil hanya nama depan (jika ada spasi)
            const namaDepan = siswa.nama.split(' ')[0];
            greetingElement.textContent = `Halo, ${namaDepan}! Selamat Belajar PJOK.`;
        }
    }
    
    // Logika Pengamanan Halaman Login (index.html)
    if (currentPath.includes('index.html') && siswa.nama) {
        // Jika sudah login, langsung ke dashboard
        // window.location.href = "dashboard.html"; // Komentar ini untuk mempermudah testing
    }
});