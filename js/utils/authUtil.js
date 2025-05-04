/**
 * Authentication Utility
 * Handles user registration, login, and session management
 */

class AuthUtil {
  constructor() {
    this.currentUser = null;
    this.loadUser();
  }

  // Load user data from localStorage
  loadUser() {
    const userData = localStorage.getItem('furnitureUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        document.dispatchEvent(new CustomEvent('userLoggedIn', { 
          detail: { user: this.currentUser } 
        }));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        this.currentUser = null;
      }
    }
  }

  // Save user data to localStorage
  saveUser(userData) {
    this.currentUser = userData;
    localStorage.setItem('furnitureUser', JSON.stringify(userData));
  }

  // Register a new user
  register(userData) {
    // In a real app, this would be a server call
    return new Promise((resolve, reject) => {
      // Simulate server validation
      if (!userData.email || !userData.password || !userData.name) {
        return reject(new Error('All fields are required'));
      }
      
      // Check if user exists in localStorage (simulating DB check)
      const users = this.getAllUsers();
      const existingUser = users.find(user => user.email === userData.email);
      
      if (existingUser) {
        return reject(new Error('User with this email already exists'));
      }
      
      // Create user with ID
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        // In a real app, password would be hashed on the server
        password: userData.password,
        createdAt: new Date().toISOString()
      };
      
      // Add to "database"
      users.push(newUser);
      localStorage.setItem('furnitureUsers', JSON.stringify(users));
      
      // Log the user in
      const { password, ...userDataWithoutPassword } = newUser;
      this.saveUser(userDataWithoutPassword);
      
      // Trigger login event
      document.dispatchEvent(new CustomEvent('userLoggedIn', { 
        detail: { user: userDataWithoutPassword } 
      }));
      
      resolve(userDataWithoutPassword);
    });
  }

  // Login a user
  login(email, password) {
    // In a real app, this would be a server call
    return new Promise((resolve, reject) => {
      // Simulate server validation
      if (!email || !password) {
        return reject(new Error('Email and password are required'));
      }
      
      // Find user
      const users = this.getAllUsers();
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        return reject(new Error('Invalid email or password'));
      }
      
      // Log in - don't store password in localStorage
      const { password: _, ...userDataWithoutPassword } = user;
      this.saveUser(userDataWithoutPassword);
      
      // Trigger login event
      document.dispatchEvent(new CustomEvent('userLoggedIn', { 
        detail: { user: userDataWithoutPassword } 
      }));
      
      resolve(userDataWithoutPassword);
    });
  }

  // Logout the current user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('furnitureUser');
    
    // Trigger logout event
    document.dispatchEvent(new CustomEvent('userLoggedOut'));
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.currentUser;
  }

  // Get all registered users (for demo purposes)
  getAllUsers() {
    try {
      const usersData = localStorage.getItem('furnitureUsers');
      return usersData ? JSON.parse(usersData) : [];
    } catch (e) {
      console.error('Failed to parse users data', e);
      return [];
    }
  }

  // Update user profile
  updateProfile(userData) {
    if (!this.currentUser) {
      return Promise.reject(new Error('User not logged in'));
    }
    
    return new Promise((resolve, reject) => {
      // Update in "database"
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === this.currentUser.id);
      
      if (userIndex === -1) {
        return reject(new Error('User not found'));
      }
      
      // Update user data
      const updatedUser = { ...users[userIndex], ...userData };
      users[userIndex] = updatedUser;
      
      // Save to localStorage
      localStorage.setItem('furnitureUsers', JSON.stringify(users));
      
      // Update current user
      const { password, ...userDataWithoutPassword } = updatedUser;
      this.saveUser(userDataWithoutPassword);
      
      resolve(userDataWithoutPassword);
    });
  }
}

// Create and export singleton instance
const authUtil = new AuthUtil();
export default authUtil; 