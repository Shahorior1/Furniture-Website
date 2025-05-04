// Import placeholder image
import pancakes from 'asset/pancakes.png';

// Import app module
import './js/app.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const createMobileMenu = () => {
        const header = document.querySelector('.header-content');
        const nav = document.querySelector('.navigation ul');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        
        header.insertBefore(mobileMenuBtn, nav.parentElement);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    };
    
    // Check if we need the mobile menu
    const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-btn')) {
                createMobileMenu();
            }
        } else {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.remove();
            }
            
            const nav = document.querySelector('.navigation ul');
            nav.classList.remove('active');
        }
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Add animation to the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 100);
    }
});
// Add animation for inspiration items
document.addEventListener('DOMContentLoaded', function() {
    const inspirationItems = document.querySelectorAll('.inspiration-item');
    
    if (inspirationItems.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });
        
        inspirationItems.forEach(item => {
            observer.observe(item);
        });
    }
});
// Add animation for beautify section
const beautifySection = document.querySelector('.beautify');
if (beautifySection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            beautifySection.classList.add('animated');
        }
    }, { threshold: 0.2 });
    
    observer.observe(beautifySection);
}

// Add animation for mailing list section
document.addEventListener('DOMContentLoaded', function() {
    const mailingList = document.querySelector('.mailing-list');
    
    if (mailingList) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                mailingList.classList.add('animated');
            }
        }, { threshold: 0.2 });
        
        observer.observe(mailingList);
    }
    
    // Handle mailing list form submission
    const mailingListForm = document.getElementById('mailingListForm');
    if (mailingListForm) {
        mailingListForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the data to your server
                alert('Thank you for joining our mailing list!');
                emailInput.value = '';
            }
        });
    }
});

// The main app.js file will handle all initialization and setup
