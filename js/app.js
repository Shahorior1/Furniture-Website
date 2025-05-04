/**
 * Main Application
 * Initializes components and sets up event listeners
 */

import productController from './controllers/productController.js';
import cartController from './controllers/cartController.js';
import authUtil from './utils/authUtil.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.setupUI();
      this.initPages();
      this.setupEventListeners();
    });
  }

  setupUI() {
    this.setupNavigation();
    this.setupCart();
    this.updateAuthUI();
  }

  setupNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.navigation ul');
    
    if (mobileMenuBtn && nav) {
      mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      });
    }
  }

  setupCart() {
    // Create cart icon in header if it doesn't exist
    const headerNav = document.querySelector('.navigation ul');
    if (headerNav && !document.querySelector('.cart-icon')) {
      const cartItem = document.createElement('li');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <a href="#" class="cart-icon">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count ${cartController.getItemCount() === 0 ? 'hidden' : ''}">
            ${cartController.getItemCount()}
          </span>
        </a>
      `;
      headerNav.appendChild(cartItem);
      
      // Add click event to show mini cart
      const cartIcon = cartItem.querySelector('.cart-icon');
      cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMiniCart();
      });
    }
    
    // Create mini cart if it doesn't exist
    if (!document.querySelector('.mini-cart')) {
      const miniCart = document.createElement('div');
      miniCart.className = 'mini-cart';
      miniCart.innerHTML = `
        <div class="mini-cart-header">
          <h3>Shopping Cart</h3>
          <button class="close-cart-btn">&times;</button>
        </div>
        <div class="mini-cart-items"></div>
        <div class="mini-cart-footer">
          <div class="cart-total-container">
            <span>Total:</span>
            <span class="cart-total">$${cartController.getTotal().toFixed(2)}</span>
          </div>
          <button class="checkout-btn">Checkout</button>
        </div>
      `;
      document.body.appendChild(miniCart);
      
      // Close button event
      const closeBtn = miniCart.querySelector('.close-cart-btn');
      closeBtn.addEventListener('click', () => {
        miniCart.classList.remove('active');
      });
      
      // Checkout button event
      const checkoutBtn = miniCart.querySelector('.checkout-btn');
      checkoutBtn.addEventListener('click', () => {
        if (!authUtil.isLoggedIn()) {
          alert('Please login to checkout');
          miniCart.classList.remove('active');
          // Show login modal
          const loginModal = document.querySelector('#login-modal');
          if (loginModal) loginModal.classList.add('active');
        } else {
          window.location.href = 'checkout.html';
        }
      });
      
      // Update mini cart
      this.updateMiniCart();
    }
  }

  toggleMiniCart() {
    const miniCart = document.querySelector('.mini-cart');
    if (miniCart) {
      miniCart.classList.toggle('active');
      
      if (miniCart.classList.contains('active')) {
        this.updateMiniCart();
      }
    }
  }

  updateMiniCart() {
    const miniCartItems = document.querySelector('.mini-cart-items');
    const cartTotal = document.querySelector('.cart-total');
    
    if (miniCartItems && cartTotal) {
      miniCartItems.innerHTML = '';
      
      if (cartController.cart.length === 0) {
        miniCartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
      } else {
        cartController.cart.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.className = 'mini-cart-item';
          cartItem.innerHTML = `
            <div class="item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
              <h4>${item.name}</h4>
              <div class="item-price">$${item.price.toFixed(2)}</div>
              <div class="item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">&times;</button>
          `;
          
          miniCartItems.appendChild(cartItem);
          
          // Add event listeners for quantity buttons
          const minusBtn = cartItem.querySelector('.minus');
          const plusBtn = cartItem.querySelector('.plus');
          const removeBtn = cartItem.querySelector('.remove-item-btn');
          
          minusBtn.addEventListener('click', () => {
            cartController.updateQuantity(item.id, item.quantity - 1);
            this.updateMiniCart();
          });
          
          plusBtn.addEventListener('click', () => {
            cartController.updateQuantity(item.id, item.quantity + 1);
            this.updateMiniCart();
          });
          
          removeBtn.addEventListener('click', () => {
            cartController.removeItem(item.id);
            this.updateMiniCart();
          });
        });
      }
      
      cartTotal.textContent = `$${cartController.getTotal().toFixed(2)}`;
    }
  }

  updateAuthUI() {
    const authContainer = document.querySelector('.auth-container');
    
    if (!authContainer) {
      // Create auth container in header if it doesn't exist
      const headerNav = document.querySelector('.navigation ul');
      
      if (headerNav) {
        const authItem = document.createElement('li');
        authItem.className = 'auth-container';
        
        if (authUtil.isLoggedIn()) {
          // User is logged in
          authItem.innerHTML = `
            <a href="#" class="profile-link">
              <i class="fas fa-user"></i> ${authUtil.currentUser.name}
            </a>
            <div class="dropdown-menu">
              <a href="profile.html">My Profile</a>
              <a href="orders.html">My Orders</a>
              <a href="#" class="logout-btn">Logout</a>
            </div>
          `;
        } else {
          // User is not logged in
          authItem.innerHTML = `
            <a href="#" class="login-link">Login / Register</a>
          `;
        }
        
        headerNav.appendChild(authItem);
        
        // Setup event listeners
        if (authUtil.isLoggedIn()) {
          const profileLink = authItem.querySelector('.profile-link');
          const logoutBtn = authItem.querySelector('.logout-btn');
          
          profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            authItem.classList.toggle('active');
          });
          
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authUtil.logout();
            window.location.reload();
          });
        } else {
          const loginLink = authItem.querySelector('.login-link');
          
          loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal();
          });
        }
      }
    }
  }

  showAuthModal() {
    let authModal = document.querySelector('#auth-modal');
    
    if (!authModal) {
      // Create auth modal
      authModal = document.createElement('div');
      authModal.id = 'auth-modal';
      authModal.className = 'modal';
      authModal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>Login / Register</h2>
            <button class="close-modal-btn">&times;</button>
          </div>
          <div class="modal-tabs">
            <button class="tab-btn active" data-tab="login">Login</button>
            <button class="tab-btn" data-tab="register">Register</button>
          </div>
          <div class="modal-body">
            <div class="tab-content active" id="login-tab">
              <form id="login-form">
                <div class="form-group">
                  <label for="login-email">Email</label>
                  <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                  <label for="login-password">Password</label>
                  <input type="password" id="login-password" required>
                </div>
                <div class="form-error"></div>
                <button type="submit" class="btn primary-btn">Login</button>
              </form>
            </div>
            <div class="tab-content" id="register-tab">
              <form id="register-form">
                <div class="form-group">
                  <label for="register-name">Name</label>
                  <input type="text" id="register-name" required>
                </div>
                <div class="form-group">
                  <label for="register-email">Email</label>
                  <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                  <label for="register-password">Password</label>
                  <input type="password" id="register-password" required>
                </div>
                <div class="form-group">
                  <label for="register-password-confirm">Confirm Password</label>
                  <input type="password" id="register-password-confirm" required>
                </div>
                <div class="form-error"></div>
                <button type="submit" class="btn primary-btn">Register</button>
              </form>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(authModal);
      
      // Setup event listeners
      const closeBtn = authModal.querySelector('.close-modal-btn');
      const tabButtons = authModal.querySelectorAll('.tab-btn');
      const loginForm = authModal.querySelector('#login-form');
      const registerForm = authModal.querySelector('#register-form');
      
      closeBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
      });
      
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tabName = button.dataset.tab;
          
          // Update active tab button
          tabButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Update active tab content
          const tabContents = authModal.querySelectorAll('.tab-content');
          tabContents.forEach(content => content.classList.remove('active'));
          
          const activeTab = authModal.querySelector(`#${tabName}-tab`);
          activeTab.classList.add('active');
        });
      });
      
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;
        const errorElement = loginForm.querySelector('.form-error');
        
        authUtil.login(email, password)
          .then(() => {
            authModal.classList.remove('active');
            window.location.reload();
          })
          .catch(error => {
            errorElement.textContent = error.message;
          });
      });
      
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.querySelector('#register-name').value;
        const email = document.querySelector('#register-email').value;
        const password = document.querySelector('#register-password').value;
        const passwordConfirm = document.querySelector('#register-password-confirm').value;
        const errorElement = registerForm.querySelector('.form-error');
        
        if (password !== passwordConfirm) {
          errorElement.textContent = 'Passwords do not match';
          return;
        }
        
        authUtil.register({ name, email, password })
          .then(() => {
            authModal.classList.remove('active');
            window.location.reload();
          })
          .catch(error => {
            errorElement.textContent = error.message;
          });
      });
    }
    
    authModal.classList.add('active');
  }

  initPages() {
    // Detect current page and initialize accordingly
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith('products.html') || currentPath.includes('/products/')) {
      this.initProductsPage();
    } else if (currentPath.endsWith('index.html') || currentPath === '/') {
      this.initHomePage();
    }
  }

  initHomePage() {
    // Display featured products on the home page
    const featuredContainer = document.querySelector('#featured-products');
    if (featuredContainer) {
      const featuredProducts = productController.getFeaturedProducts();
      productController.renderProducts('#featured-products', featuredProducts);
    }
    
    // Initialize range/category buttons
    const rangeItems = document.querySelectorAll('.range-item a');
    rangeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const category = item.getAttribute('href').replace('#', '');
        sessionStorage.setItem('selectedCategory', category);
        window.location.href = 'products.html';
      });
    });
  }

  initProductsPage() {
    // Initialize product display and filters
    productController.initProductsPage();
    
    // Check if there's a selected category from the home page
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (selectedCategory) {
      const categoryButton = document.querySelector(`.category-filter[data-category="${selectedCategory}"]`);
      
      if (categoryButton) {
        categoryButton.click();
      }
      
      sessionStorage.removeItem('selectedCategory');
    }
  }

  setupEventListeners() {
    // Listen for cart updates
    document.addEventListener('cartUpdated', () => {
      this.updateMiniCart();
    });
    
    // Listen for user login/logout
    document.addEventListener('userLoggedIn', () => {
      this.updateAuthUI();
    });
    
    document.addEventListener('userLoggedOut', () => {
      this.updateAuthUI();
    });
  }
}

// Initialize the application
const app = new App(); 