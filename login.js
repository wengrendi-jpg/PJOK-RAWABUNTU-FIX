// js/login.js - Login Page Logic
console.log('✅ login.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Login page initialized');
    
    // Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorElement = document.getElementById('error-message');
    const loadingElement = document.getElementById('loading');
    
    // Initialize Firebase
    if (window.firebaseConfig) {
        const initialized = window.firebaseConfig.initialize();
        console.log('Firebase initialized:', initialized);
        
        // Check if already logged in
        const currentUser = window.firebaseConfig.getCurrentUser();
        if (currentUser) {
            console.log('Already logged in as:', currentUser.email);
            redirectToDashboard();
            return;
        }
    } else {
        console.error('firebaseConfig not found!');
        showError('Sistem login tidak tersedia. Silakan refresh halaman.');
        return;
    }
    
    // Auto-fill demo email
    if (emailInput) {
        emailInput.value = 'siswa@demo.sch.id';
        emailInput.focus();
    }
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Login button click
    if (loginButton) {
        loginButton.addEventListener('click', handleLoginSubmit);
    }
    
    console.log('✅ Login page setup complete');
});

// Handle login
async function handleLoginSubmit(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    
    // Validation
    if (!email || !password) {
        showError('Email dan password harus diisi');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Format email tidak valid');
        return;
    }
    
    // Show loading state
    setLoading(true);
    clearError();
    
    try {
        // Call Firebase login
        const result = await window.firebaseConfig.login(email, password);
        
        if (result.success) {
            console.log('✅ Login successful! Redirecting...');
            
            // Show success
            const loginBtn = document.getElementById('loginButton');
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
                loginBtn.classList.add('success');
                loginBtn.disabled = true;
            }
            
            // Redirect after short delay
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
            
        } else {
            // Show error
            showError(result.message || 'Login gagal');
            setLoading(false);
        }
    } catch (error) {
        console.error('Login handler error:', error);
        showError('Terjadi kesalahan saat login');
        setLoading(false);
    }
}

// Redirect to dashboard
function redirectToDashboard() {
    console.log('Redirecting to dashboard...');
    window.location.href = 'dashboard.html'; // Ganti dengan halaman dashboard Anda
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        console.error('Error:', message);
        alert(message); // Fallback
    }
}

function clearError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function setLoading(isLoading) {
    const loginButton = document.getElementById('loginButton');
    const loadingElement = document.getElementById('loading');
    
    if (loginButton) {
        if (isLoading) {
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            loginButton.disabled = true;
        } else {
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
            loginButton.disabled = false;
        }
    }
    
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }
}