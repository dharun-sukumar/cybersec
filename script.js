// Global variables
let isRTL = false;
let chartInstances = {}; // Store chart instances to prevent recreation

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons with fallback
    initLucideIcons();
    
    // Initialize RTL toggle
    initRTLToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize FAQ accordions
    initFAQ();
    
    // Initialize form handlers
    initForms();
    
    // Initialize password toggle
    initPasswordToggle();
    
    // Add smooth scrolling
    initSmoothScrolling();
    
    // Initialize animations
    initAnimations();
    
    // Initialize responsive handlers
    initResponsiveHandlers();
    
    // Prevent Chart.js infinite growth
    preventChartGrowth();
});

// Initialize Lucide icons with fallback
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
        } catch (error) {
            console.warn('Lucide icons initialization failed:', error);
        }
    } else {
        console.warn('Lucide icons library not loaded');
    }
}

// RTL Toggle Functionality
function initRTLToggle() {
    const rtlToggle = document.getElementById('rtlToggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', toggleRTL);
        
        // Check for saved RTL preference
        const savedRTL = localStorage.getItem('rtl-mode');
        if (savedRTL === 'true') {
            enableRTL();
        }
    }
}

function toggleRTL() {
    if (isRTL) {
        disableRTL();
    } else {
        enableRTL();
    }
}

function enableRTL() {
    isRTL = true;
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'en'); // Keep English language
    localStorage.setItem('rtl-mode', 'true');
    
    // Don't update text content - keep English
    // updateTextForRTL(); // Commented out to keep English text
    
    // Re-initialize icons to handle RTL transformations
    initLucideIcons();
}

function disableRTL() {
    isRTL = false;
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    localStorage.setItem('rtl-mode', 'false');
    
    // Don't need to restore text since we're keeping English
    // updateTextForLTR(); // Commented out since text stays English
    
    // Re-initialize icons
    initLucideIcons();
}

function updateTextForRTL() {
    // Update navigation and key text elements for Arabic/RTL
    const textMappings = {
        'Home': 'الرئيسية',
        'Home 2': 'الرئيسية 2', 
        'Services': 'الخدمات',
        'About': 'حول',
        'Contact': 'اتصل',
        'Login': 'تسجيل الدخول',
        'CyberShield Pro': 'سايبر شيلد برو',
        'Secure Your Digital Future': 'أمّن مستقبلك الرقمي',
        'Get Started': 'ابدأ الآن',
        'Explore Services': 'استكشف الخدمات',
        'Next-Generation': 'الجيل القادم',
        'Cybersecurity': 'الأمن السيبراني'
    };
    
    // Update text content
    Object.entries(textMappings).forEach(([english, arabic]) => {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (element.textContent && element.textContent.trim() === english) {
                element.textContent = arabic;
            }
        });
    });
}

function updateTextForLTR() {
    // Restore English text (would need more comprehensive implementation)
    location.reload(); // Simple approach for demo
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        // Ensure mobile menu starts hidden
        mobileMenu.classList.add('hidden');
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        // Close mobile menu on window resize to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) { // md breakpoint
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// FAQ Accordion
// function initFAQ() {
//     const faqButtons = document.querySelectorAll('.faq-button');
    
//     faqButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const content = this.nextElementSibling;
//             const icon = this.querySelector('.lucide');
            
//             // Toggle active class
//             this.classList.toggle('active');
            
//             // Toggle content visibility
//             content.classList.toggle('open');
            
//             // Rotate icon
//             if (icon) {
//                 icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
//             }
//         });
//     });
// }
// FAQ Accordion
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-button');

    faqButtons.forEach(button => {
        const content = button.nextElementSibling;
        // Ensure all start closed
        content.classList.remove('open');

        button.addEventListener('click', function () {
            const isActive = this.classList.contains('active');

            // Close all
            faqButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.classList.remove('open');
                const icon = btn.querySelector('.lucide');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });

            // If the clicked one was not active, open it
            if (!isActive) {
                this.classList.add('active');
                this.nextElementSibling.classList.add('open');
                const icon = this.querySelector('.lucide');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}




// Form Handlers
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    // Notify form (coming soon page)
    const notifyForm = document.getElementById('notifyForm');
    if (notifyForm) {
        notifyForm.addEventListener('submit', handleNotifyForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleLoginForm(e) {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    // Simulate login
    setTimeout(() => {
        // Demo: redirect based on email
        if (email.includes('admin')) {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }, 1500);
}

function handleNotifyForm(e) {
    e.preventDefault();
    alert('Thank you! We\'ll notify you when the new platform is ready.');
    e.target.reset();
}

// Password Toggle
function initPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (togglePassword && passwordInput && eyeIcon) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update icon
            eyeIcon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
            lucide.createIcons();
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.bg-gray-700, .bg-gray-800, .bg-gradient-to-br');
    animateElements.forEach(el => observer.observe(el));
}

// Responsive Handlers
function initResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Handle responsive changes
            handleResponsiveChanges();
        }, 250);
    });
    
    // Initial check
    handleResponsiveChanges();
}

function handleResponsiveChanges() {
    const width = window.innerWidth;
    
    // Close mobile menu on resize to desktop
    if (width >= 768) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    // Only set Chart.js defaults if charts exist, but don't destroy/recreate them
    if (typeof Chart !== 'undefined') {
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend.display = true;
    }
}

// Function to initialize charts with proper size constraints
function initializeChartsWithConstraints() {
    // Threat chart
    const threatCanvas = document.getElementById('threatChart');
    if (threatCanvas && !chartInstances.threatChart) {
        const ctx = threatCanvas.getContext('2d');
        // Set canvas size constraints
        threatCanvas.width = 400;
        threatCanvas.height = 200;
        threatCanvas.style.maxWidth = '100%';
        threatCanvas.style.maxHeight = '200px';
        
        chartInstances.threatChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Threats Detected',
                    data: [12, 19, 8, 15, 25, 13, 18],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { labels: { color: '#D1D5DB' } } 
                },
                scales: {
                    x: { ticks: { color: '#D1D5DB' } },
                    y: { ticks: { color: '#D1D5DB' } }
                }
            }
        });
    }
    
    // Security status chart
    const securityCanvas = document.getElementById('securityChart');
    if (securityCanvas && !chartInstances.securityChart) {
        const ctx = securityCanvas.getContext('2d');
        // Set canvas size constraints
        securityCanvas.width = 400;
        securityCanvas.height = 200;
        securityCanvas.style.maxWidth = '100%';
        securityCanvas.style.maxHeight = '200px';
        
        chartInstances.securityChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Secure', 'Monitoring', 'Critical', 'Updates'],
                datasets: [{
                    data: [487, 23, 14, 56],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        labels: { color: '#D1D5DB' },
                        position: 'bottom'
                    } 
                }
            }
        });
    }
}

// Prevent Chart.js infinite growth
function preventChartGrowth() {
    if (typeof Chart !== 'undefined') {
        // Override Chart.js resize functionality
        const originalResize = Chart.prototype.resize;
        Chart.prototype.resize = function(width, height) {
            // Limit maximum dimensions
            const maxWidth = 600;
            const maxHeight = 300;
            
            width = Math.min(width || this.canvas.clientWidth, maxWidth);
            height = Math.min(height || this.canvas.clientHeight, maxHeight);
            
            return originalResize.call(this, width, height);
        };
        
        // Set up canvas size monitoring with less aggressive intervention
        setInterval(() => {
            document.querySelectorAll('canvas').forEach(canvas => {
                if (canvas.tagName === 'CANVAS' && (canvas.id.includes('Chart') || canvas.id.includes('chart'))) {
                    // Force reasonable maximum dimensions
                    if (canvas.height > 300) {
                        canvas.height = 300;
                        canvas.style.height = '300px';
                    }
                    if (canvas.width > 600) {
                        canvas.width = 600;
                        canvas.style.width = '100%';
                    }
                    canvas.style.maxHeight = '300px';
                    canvas.style.maxWidth = '100%';
                }
            });
        }, 1000); // Check every second instead of constant monitoring
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 
        type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Export functions for global use
window.CyberShieldPro = {
    toggleRTL,
    enableRTL,
    disableRTL,
    showNotification,
    formatCurrency,
    formatDate
};

// Handle page-specific functionality
function initPageSpecific() {
    const path = window.location.pathname;
    
    if (path.includes('dashboard')) {
        initDashboard();
    } else if (path.includes('contact')) {
        initContactPage();
    } else if (path.includes('coming-soon')) {
        initComingSoon();
    }
}

function initDashboard() {
    // Dashboard-specific initialization
    console.log('Dashboard initialized');
    
    // Initialize charts with proper constraints
    if (typeof Chart !== 'undefined') {
        // Set global defaults to prevent infinite growth
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.animation.duration = 0; // Disable animations to prevent resize issues
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            initializeChartsWithConstraints();
        }, 200);
    }
}

function initContactPage() {
    // Contact page-specific initialization
    console.log('Contact page initialized');
}

function initComingSoon() {
    // Coming soon page-specific initialization
    console.log('Coming soon page initialized');
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', initPageSpecific);