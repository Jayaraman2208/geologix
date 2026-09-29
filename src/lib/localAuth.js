// ============================================
// LOCAL AUTH - No email confirmation needed
// ============================================

// Local user storage
const USERS_KEY = 'geologix_users';
const SESSION_KEY = 'geologix_session';

export const localAuth = {
  // Register user locally
  register: (email, password, userData) => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      // Check if user exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'User already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email,
        password: btoa(password), // Simple encoding (not secure, just for demo)
        full_name: userData.full_name || '',
        company: userData.company || '',
        role: 'admin',
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Auto login after registration
      localStorage.setItem(SESSION_KEY, JSON.stringify({ 
        user: { ...newUser, password: undefined } 
      }));
      
      return { success: true, user: { ...newUser, password: undefined } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login locally
  login: (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find(u => u.email === email && u.password === btoa(password));
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      localStorage.setItem(SESSION_KEY, JSON.stringify({ 
        user: { ...user, password: undefined } 
      }));
      
      return { success: true, user: { ...user, password: undefined } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current session
  getCurrentUser: () => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      return session?.user || null;
    } catch {
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  },

  // Get all users (admin only)
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }
};

export default localAuth;
