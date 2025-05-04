/**
 * Shopping Cart Controller
 * Handles all cart-related functionality including
 * adding/removing items and storing cart in localStorage
 */

class CartController {
  constructor() {
    this.cart = [];
    this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem('furnitureCart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        this.cart = [];
      }
    }
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('furnitureCart', JSON.stringify(this.cart));
    this.updateCartUI();
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    this.saveCart();
    this.showNotification(`${product.name} added to cart`);
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // Remove item from cart
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  // Clear the entire cart
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Calculate cart total
  getTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Get cart item count
  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 2000);
    }, 10);
  }

  // Update cart UI components
  updateCartUI() {
    // Update cart count badge
    const cartCountElements = document.querySelectorAll('.cart-count');
    const itemCount = this.getItemCount();
    
    cartCountElements.forEach(element => {
      element.textContent = itemCount;
      element.classList.toggle('hidden', itemCount === 0);
    });
    
    // Update cart total if mini cart is open
    const cartTotalElements = document.querySelectorAll('.cart-total');
    const total = this.getTotal();
    
    cartTotalElements.forEach(element => {
      element.textContent = `$${total.toFixed(2)}`;
    });

    // Dispatch custom event so other components can react
    document.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: this.cart, total: total, itemCount: itemCount } 
    }));
  }
}

// Create and export singleton instance
const cartController = new CartController();
export default cartController; 