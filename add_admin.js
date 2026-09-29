// ============================================
// ADD ADMIN TO LOCALSTORAGE
// Run this in browser console (F12)
// ============================================

// Admin account details
const adminUser = {
    email: 'geologix_admin@geologix.com',
    name: 'GEOLOGIX Admin',
    role: 'admin',
    isDemo: true,
    password: 'Admin@123456'
};

// Save to localStorage
localStorage.setItem('geologix_user', JSON.stringify(adminUser));

// Verify
console.log('✅ Admin account created!');
console.log('📧 Email: geologix_admin@geologix.com');
console.log('🔑 Password: Admin@123456');

// Get all users
const users = JSON.parse(localStorage.getItem('geologix_users') || '{}');
users['geologix_admin@geologix.com'] = {
    password: 'Admin@123456',
    name: 'GEOLOGIX Admin',
    company: 'GEOLOGIX',
    role: 'admin'
};
localStorage.setItem('geologix_users', JSON.stringify(users));

console.log('✅ Admin added to users list!');
