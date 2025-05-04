/**
 * Product Controller
 * Manages product display, filtering, and search functionality
 */

import products from '../data/products.js';
import cartController from './cartController.js';

class ProductController {
  constructor() {
    this.products = products;
    this.filteredProducts = [...products];
    this.currentCategory = 'all';
    this.currentSort = 'default';
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Get featured products
  getFeaturedProducts() {
    return this.products.filter(product => product.featured);
  }

  // Get products by category
  getProductsByCategory(category) {
    if (category === 'all') {
      return [...this.products];
    }
    return this.products.filter(product => product.category === category);
  }

  // Apply filters and sort
  filterAndSortProducts(filters = {}) {
    let filtered = [...this.products];
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      this.currentCategory = filters.category;
      filtered = filtered.filter(product => product.category === filters.category);
    } else {
      this.currentCategory = 'all';
    }
    
    // Apply price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice);
    }
    
    // Apply in-stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    // Apply search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) || 
               product.description.toLowerCase().includes(searchTerm);
      });
    }
    
    // Apply sorting
    if (filters.sort) {
      this.currentSort = filters.sort;
      switch(filters.sort) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Default sorting (featured first, then by ID)
          filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.id - b.id;
          });
      }
    }
    
    this.filteredProducts = filtered;
    return filtered;
  }

  // Render products to a container element
  renderProducts(containerSelector, products = this.filteredProducts) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (products.length === 0) {
      container.innerHTML = '<div class="no-products">No products found. Try adjusting your filters.</div>';
      return;
    }
    
    // Create product cards
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${!product.inStock ? '<span class="out-of-stock">Out of Stock</span>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-rating">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '½' : ''}</span>
            <span class="reviews">(${product.reviews})</span>
          </div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''} data-product-id="${product.id}">
            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      `;
      
      container.appendChild(productCard);
      
      // Add event listener to the Add to Cart button
      const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
      if (product.inStock) {
        addToCartBtn.addEventListener('click', () => {
          cartController.addItem(product);
        });
      }
    });
  }

  // Initialize products page
  initProductsPage() {
    this.renderProducts('#products-container');
    this.initFilterListeners();
  }

  // Initialize filter and sort event listeners
  initFilterListeners() {
    // Category filter
    const categoryButtons = document.querySelectorAll('.category-filter');
    if (categoryButtons) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          
          // Update active class
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Filter products
          this.filterAndSortProducts({ category: category, sort: this.currentSort });
          this.renderProducts('#products-container');
        });
      });
    }
    
    // Sort dropdown
    const sortSelect = document.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        this.filterAndSortProducts({ 
          category: this.currentCategory, 
          sort: sortValue 
        });
        this.renderProducts('#products-container');
      });
    }
    
    // Price range slider
    const minPriceInput = document.querySelector('#min-price');
    const maxPriceInput = document.querySelector('#max-price');
    
    if (minPriceInput && maxPriceInput) {
      const updatePriceFilter = () => {
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);
        
        this.filterAndSortProducts({
          category: this.currentCategory,
          sort: this.currentSort,
          minPrice: minPrice,
          maxPrice: maxPrice
        });
        
        this.renderProducts('#products-container');
      };
      
      minPriceInput.addEventListener('change', updatePriceFilter);
      maxPriceInput.addEventListener('change', updatePriceFilter);
    }
    
    // In stock checkbox
    const inStockCheckbox = document.querySelector('#in-stock');
    if (inStockCheckbox) {
      inStockCheckbox.addEventListener('change', () => {
        this.filterAndSortProducts({
          category: this.currentCategory,
          sort: this.currentSort,
          inStock: inStockCheckbox.checked
        });
        
        this.renderProducts('#products-container');
      });
    }
    
    // Search input
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        
        this.filterAndSortProducts({
          category: this.currentCategory,
          sort: this.currentSort,
          search: searchTerm
        });
        
        this.renderProducts('#products-container');
      });
    }
  }
}

// Create and export singleton instance
const productController = new ProductController();
export default productController; 