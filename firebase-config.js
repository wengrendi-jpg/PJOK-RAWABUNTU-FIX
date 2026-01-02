// js/firebase-config.js - Firebase Configuration
console.log('✅ firebase-config.js loaded');

const firebaseConfig = {
    apiKey: "AIzaSyD7FsbgyUF1jvDvcrb6wrWlEiQJUFZG3kE",
    authDomain: "pjok-sekolah-bapak-rendi.firebaseapp.com",
    databaseURL: "https://pjok-sekolah-bapak-rendi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pjok-sekolah-bapak-rendi",
    storageBucket: "pjok-sekolah-bapak-rendi.firebasestorage.app",
    messagingSenderId: "337016584526",
    appId: "1:337016584526:web:8534c7cf4012a35427861f"
};

// Initialize Firebase App
let firebaseApp = null;
let auth = null;
let database = null;

function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK not loaded');
            return false;
        }
        
        // Initialize if not already initialized
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase App initialized');
        } else {
            firebaseApp = firebase.app();
            console.log('🔥 Firebase App already exists');
        }
        
        // Get services
        auth = firebase.auth();
        database = firebase.database();
        
        console.log('✅ Firebase Auth & Database ready');
        return true;
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        return false;
    }
}

// Get Firebase instances
function getAuth() {
    if (!auth) initializeFirebase();
    return auth;
}

function getDatabase() {
    if (!database) initializeFirebase();
    return database;
}

// Login function
async function loginWithEmail(email, password) {
    try {
        const authInstance = getAuth();
        if (!authInstance) {
            throw new Error('Authentication service not available');
        }
        
        console.log('🔐 Attempting login for:', email);
        const userCredential = await authInstance.signInWithEmailAndPassword(email, password);
        
        console.log('✅ Login successful for:', userCredential.user.email);
        return {
            success: true,
            user: userCredential.user
        };
    } catch (error) {
        console.error('❌ Login error:', error.code, error.message);
        
        // Translate error messages
        let message = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                message = 'Email atau password salah';
                break;
            case 'auth/too-many-requests':
                message = 'Terlalu banyak percobaan. Coba lagi nanti';
                break;
            case 'auth/network-request-failed':
                message = 'Koneksi internet bermasalah';
                break;
            case 'auth/user-disabled':
                message = 'Akun ini dinonaktifkan';
                break;
        }
        
        return {
            success: false,
            message: message,
            code: error.code
        };
    }
}

// Check current user
function getCurrentUser() {
    return auth ? auth.currentUser : null;
}

// Logout
async function logout() {
    try {
        if (auth) {
            await auth.signOut();
            console.log('✅ Logout successful');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Logout error:', error);
        return false;
    }
}

// Export to window object
window.firebaseConfig = {
    config: firebaseConfig,
    initialize: initializeFirebase,
    login: loginWithEmail,
    logout: logout,
    getCurrentUser: getCurrentUser,
    getAuth: getAuth,
    getDatabase: getDatabase
};

console.log('✅ firebase-config.js ready');