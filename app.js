// ADmyBRAND AI Suite Landing Page JavaScript

class LandingPage {
    constructor() {
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCarousel();
        this.initializeScrollAnimations();
        this.initializeFAQ();
        this.startCarouselAutoplay();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('nav__menu--open');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                        navMenu.classList.remove('nav__menu--open');
                    }
                }
            });
        });

        // CTA Button handlers
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                
                if (buttonText.includes('Start Free Trial') || buttonText.includes('Try Demo')) {
                    this.handleTrialSignup(e, button);
                } else if (buttonText.includes('Contact Sales')) {
                    this.handleContactSales(e, button);
                } else if (buttonText.includes('Watch Demo')) {
                    this.handleWatchDemo(e, button);
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
        });

        // Testimonial carousel pause on hover
        const carousel = document.querySelector('.testimonials__carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.pauseCarousel();
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.resumeCarousel();
            });
        }
    }

    initializeCarousel() {
        const dots = document.querySelectorAll('.testimonials__dot');
        const track = document.getElementById('testimonialsTrack');
        
        if (!dots.length || !track) return;

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToTestimonial(index);
            });
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const carousel = document.querySelector('.testimonials__carousel');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseCarousel();
            });

            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });

            carousel.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextTestimonial();
                    } else {
                        this.prevTestimonial();
                    }
                }
                
                this.resumeCarousel();
            });
        }
    }

    goToTestimonial(index) {
        if (this.isAnimating) return;
        
        const track = document.getElementById('testimonialsTrack');
        const dots = document.querySelectorAll('.testimonials__dot');
        const testimonials = document.querySelectorAll('.testimonial-card');
        
        if (!track || !dots.length || !testimonials.length) return;

        this.isAnimating = true;
        this.currentTestimonial = index;

        // Update active dot
        dots.forEach(dot => dot.classList.remove('testimonials__dot--active'));
        dots[index].classList.add('testimonials__dot--active');

        // Calculate transform based on screen size
        let translateX = 0;
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 1024) {
            // Desktop: show 3 cards
            translateX = -index * (100 / 3);
        } else if (screenWidth >= 768) {
            // Tablet: show 2 cards
            translateX = -index * 50;
        } else {
            // Mobile: show 1 card
            translateX = -index * 100;
        }

        track.style.transform = `translateX(${translateX}%)`;

        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    nextTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const nextIndex = (this.currentTestimonial + 1) % testimonials.length;
        this.goToTestimonial(nextIndex);
    }

    prevTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const prevIndex = this.currentTestimonial === 0 ? testimonials.length - 1 : this.currentTestimonial - 1;
        this.goToTestimonial(prevIndex);
    }

    startCarouselAutoplay() {
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }

    pauseCarousel() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
            this.testimonialInterval = null;
        }
    }

    resumeCarousel() {
        if (!this.testimonialInterval) {
            this.startCarouselAutoplay();
        }
    }

    initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-item__question');
        
        faqQuestions.forEach((question) => {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const faqItem = question.closest('.faq-item');
                if (!faqItem) return;
                
                const isCurrentlyActive = faqItem.classList.contains('faq-item--active');
                
                // Close all FAQ items first
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('faq-item--active');
                });
                
                // If the clicked item wasn't active, open it
                if (!isCurrentlyActive) {
                    faqItem.classList.add('faq-item--active');
                    
                    // Scroll the opened FAQ into view if needed
                    setTimeout(() => {
                        const rect = faqItem.getBoundingClientRect();
                        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                        
                        if (rect.bottom > window.innerHeight) {
                            const scrollTop = window.pageYOffset + rect.top - navHeight - 20;
                            window.scrollTo({
                                top: scrollTop,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            });
        });

        // Also handle keyboard navigation
        faqQuestions.forEach((question) => {
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = [
            '.feature-card',
            '.pricing-card',
            '.testimonial-card',
            '.faq-item'
        ];

        animatedElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.classList.add('animate-on-scroll');
                element.style.animationDelay = `${index * 0.1}s`;
                observer.observe(element);
            });
        });

        // Hero metrics animation
        const heroMetrics = document.querySelectorAll('.hero__metric-fill');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 500);
                }
            });
        }, { threshold: 0.5 });

        heroMetrics.forEach(metric => {
            heroObserver.observe(metric);
        });
    }

    handleNavbarScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        if (window.scrollY > 100) {
            nav.style.background = 'rgba(252, 252, 249, 0.95)';
        } else {
            nav.style.background = 'var(--glass-bg)';
        }
    }

    handleTrialSignup(e, button) {
        e.preventDefault();
        
        // Add loading state
        const originalText = button.textContent;
        button.classList.add('btn--loading');
        button.textContent = 'Starting Trial...';
        
        // Simulate API call
        setTimeout(() => {
            button.classList.remove('btn--loading');
            button.textContent = originalText;
            
            // Show success message or redirect
            this.showNotification('Free trial started! Check your email for next steps.', 'success');
        }, 2000);
    }

    handleContactSales(e, button) {
        e.preventDefault();
        
        // Add loading state
        const originalText = button.textContent;
        button.classList.add('btn--loading');
        button.textContent = 'Connecting...';
        
        setTimeout(() => {
            button.classList.remove('btn--loading');
            button.textContent = originalText;
            
            this.showNotification('Thank you! Our sales team will contact you within 24 hours.', 'success');
        }, 1500);
    }

    handleWatchDemo(e, button) {
        e.preventDefault();
        
        // Create and show modal
        this.showDemoModal();
    }

    showDemoModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal" id="demoModal">
                <div class="modal__backdrop"></div>
                <div class="modal__content">
                    <div class="modal__header">
                        <h3>Watch ADmyBRAND Demo</h3>
                        <button class="modal__close" id="closeDemoModal">&times;</button>
                    </div>
                    <div class="modal__body">
                        <div class="demo-video">
                            <div class="demo-video__placeholder">
                                <div class="demo-video__icon">▶</div>
                                <h4>Interactive Demo</h4>
                                <p>See how ADmyBRAND transforms your marketing in just 3 minutes</p>
                                <button class="btn btn--primary" onclick="landingPage.startDemo()">Start Demo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--duration-normal) var(--ease-standard);
                }
                
                .modal.modal--open {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal__backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                }
                
                .modal__content {
                    position: relative;
                    background: var(--color-surface);
                    border-radius: var(--radius-lg);
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: auto;
                    transform: scale(0.9);
                    transition: transform var(--duration-normal) var(--ease-standard);
                }
                
                .modal--open .modal__content {
                    transform: scale(1);
                }
                
                .modal__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-20);
                    border-bottom: 1px solid var(--color-border);
                }
                
                .modal__header h3 {
                    margin: 0;
                    font-size: var(--font-size-xl);
                }
                
                .modal__close {
                    background: none;
                    border: none;
                    font-size: var(--font-size-2xl);
                    cursor: pointer;
                    color: var(--color-text-secondary);
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal__body {
                    padding: var(--space-20);
                }
                
                .demo-video {
                    text-align: center;
                }
                
                .demo-video__placeholder {
                    background: var(--color-bg-1);
                    border: 2px dashed var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-32);
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .demo-video__icon {
                    font-size: 3rem;
                    color: var(--color-primary);
                    margin-bottom: var(--space-16);
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform var(--duration-fast) var(--ease-standard);
                }
                
                .demo-video__icon:hover {
                    transform: scale(1.1);
                }
                
                .demo-video h4 {
                    margin-bottom: var(--space-8);
                    font-size: var(--font-size-2xl);
                }
                
                .demo-video p {
                    color: var(--color-text-secondary);
                    margin-bottom: var(--space-20);
                }
            </style>
        `;

        // Insert modal into DOM
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('demoModal');
        const closeBtn = document.getElementById('closeDemoModal');
        const backdrop = modal.querySelector('.modal__backdrop');

        // Show modal
        setTimeout(() => {
            modal.classList.add('modal--open');
        }, 10);

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('modal--open');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    startDemo() {
        const demoPlaceholder = document.querySelector('.demo-video__placeholder');
        if (demoPlaceholder) {
            demoPlaceholder.innerHTML = `
                <div class="demo-progress">
                    <h4>Demo Loading...</h4>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p>Preparing your personalized demo experience</p>
                </div>
            `;

            // Add progress bar styles
            const progressStyles = `
                <style>
                    .demo-progress {
                        text-align: center;
                    }
                    
                    .progress-bar {
                        width: 100%;
                        height: 6px;
                        background: var(--color-secondary);
                        border-radius: var(--radius-full);
                        overflow: hidden;
                        margin: var(--space-16) 0;
                    }
                    
                    .progress-fill {
                        height: 100%;
                        background: var(--gradient-primary);
                        width: 0%;
                        transition: width 3s ease-out;
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', progressStyles);

            // Animate progress
            setTimeout(() => {
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = '100%';
                }
            }, 100);

            // Complete demo loading
            setTimeout(() => {
                demoPlaceholder.innerHTML = `
                    <div class="demo-complete">
                        <div class="demo-complete__icon">✓</div>
                        <h4>Demo Ready!</h4>
                        <p>Your personalized demo has been prepared. Our team will contact you shortly to schedule a live walkthrough.</p>
                        <button class="btn btn--primary" onclick="document.getElementById('closeDemoModal').click()">Got it!</button>
                    </div>
                `;

                // Add completion styles
                const completeStyles = `
                    <style>
                        .demo-complete__icon {
                            font-size: 3rem;
                            color: var(--color-success);
                            width: 80px;
                            height: 80px;
                            border-radius: 50%;
                            background: rgba(var(--color-success-rgb), 0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto var(--space-16);
                            border: 2px solid rgba(var(--color-success-rgb), 0.2);
                        }
                    </style>
                `;
                document.head.insertAdjacentHTML('beforeend', completeStyles);
            }, 3200);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notificationStyles')) {
            const notificationStyles = `
                <style id="notificationStyles">
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 3000;
                        background: var(--color-surface);
                        border: 1px solid var(--color-border);
                        border-radius: var(--radius-lg);
                        box-shadow: var(--shadow-lg);
                        max-width: 400px;
                        transform: translateX(100%);
                        transition: transform var(--duration-normal) var(--ease-standard);
                    }
                    
                    .notification--show {
                        transform: translateX(0);
                    }
                    
                    .notification--success {
                        border-left: 4px solid var(--color-success);
                    }
                    
                    .notification--error {
                        border-left: 4px solid var(--color-error);
                    }
                    
                    .notification__content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: var(--space-16);
                    }
                    
                    .notification__message {
                        font-size: var(--font-size-sm);
                        color: var(--color-text);
                    }
                    
                    .notification__close {
                        background: none;
                        border: none;
                        font-size: var(--font-size-lg);
                        cursor: pointer;
                        color: var(--color-text-secondary);
                        padding: 0;
                        margin-left: var(--space-12);
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', notificationStyles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 10);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Manual close
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize the landing page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.landingPage = new LandingPage();
});

// Handle window resize for carousel responsiveness
window.addEventListener('resize', () => {
    if (window.landingPage) {
        window.landingPage.goToTestimonial(window.landingPage.currentTestimonial);
    }
});