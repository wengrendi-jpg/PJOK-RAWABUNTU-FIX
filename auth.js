// KONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyD7FsbgyUF1jvDvcrb6wrWlEiQJUFZG3kE",
    authDomain: "pjok-sekolah-bapak-rendi.firebaseapp.com",
    projectId: "pjok-sekolah-bapak-rendi",
    databaseURL: "https://pjok-sekolah-bapak-rendi-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Inisialisasi Firebase (Cek agar tidak double init)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// FUNGSI LOGIN
function cekLogin() {
    const p = document.getElementById('passInput').value;
    if(p === 'PJOKRENDI123') {
        // Simpan sesi login
        sessionStorage.setItem('login_k6', 'true');
        alert("Login Berhasil! Selamat Datang, Pak Rendi.");
        window.location.href = "dashboard.html"; // Arahkan ke dashboard
    } else {
        alert("Password Salah!");
    }
}

// FUNGSI LOGOUT
function logout() {
    sessionStorage.removeItem('login_k6');
    window.location.href = "login.html"; // Kembali ke login
}

// CEK STATUS LOGIN (Pasang di dashboard.html)
function checkAuthStatus() {
    if(sessionStorage.getItem('login_k6') !== 'true') {
        window.location.href = "login.html";
    }
}