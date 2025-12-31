// FUNGSI NAVIGASI HALAMAN (PINDAH BAB)
function bukaHalaman(id, btn) {
    // Sembunyikan semua section
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    // Reset tombol aktif di sidebar
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Tampilkan section target
    const target = document.getElementById('view-' + id);
    if(target) {
        target.classList.add('active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Highlight tombol
    if(btn) btn.classList.add('active');
}

// FUNGSI REMOTE RECEIVER (PENERIMA SINYAL DARI ADMIN)
// Pastikan nama channel sesuai dengan kelasnya
const channel = new BroadcastChannel('pjok_kelas_6'); 

channel.onmessage = (event) => {
    const { action, target } = event.data;
    
    // Update status koneksi di pojok kanan bawah (jika ada elemennya)
    const statusEl = document.getElementById('conn-status');
    if(statusEl) {
        statusEl.innerText = "Menerima: " + action;
        statusEl.style.background = "#00c853";
    }

    if (action === 'navigate') {
        // Cari tombol di sidebar yang sesuai ID target
        const btn = document.getElementById('nav-' + target);
        if(btn) bukaHalaman(target, btn);
    } 
    else if (action === 'scroll') {
        // Scroll ke elemen tertentu (misal Kisi-kisi)
        if(typeof tampilKisi === 'function') {
            tampilKisi(target.replace('kisi-',''));
        }
    }
    else if (action === 'quiz') {
        // Buka Kuis (perlu fungsi cekDanBukaSoal di file lain/utama)
        if(typeof cekDanBukaSoal === 'function') {
            cekDanBukaSoal(target);
        }
    }
};