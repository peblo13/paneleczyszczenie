// ============================================================================
// CHATBOT FUNCTIONALITY
// ============================================================================

const chatbotResponses = {
    'ceny': 'Nasze ceny: START od 400 zł (do 3kW), STANDARD od 800 zł (3-10kW), PREMIUM od 1500 zł (10kW+). Zapytaj mnie o szczegóły! 💰',
    'dostępność': 'Działamy w całej Polsce! Najaktywniej w Warszawie, Krakowie, Wrocławiu i Poznaniu. Sprawdzę dostępność w Twojej lokalizacji - napisz mi swoje miasto! 📍',
    'gwarancja': 'Oferujemy gwarancje od 3 do 12 miesięcy w zależności od pakietu. Wszystkie prace objęte są pełną gwarancją. 🛡️',
    'umów wizytę': 'Świetnie! Możesz umówić się przez WhatsApp (+48 889 555 879), telefon, email (info@solarclean.pl) lub poprzez formularz kontaktowy. Odpowiadamy błyskawicznie! ⚡',
    'koszt': 'Koszty zaczynają się od 400 zł. Dokładną wycenę dodam po poznaniu mocy Twojej instalacji. Ile kW? 🤔',
    'jak długo': 'Średnia instalacja 5-10kW zajmuje nam 2-4 godziny. Zależy od rozmiaru i stanu paneli. ⏱️',
    'efekt': 'Wzrost wydajności wynosi od 15% do 25%! Nasi klienci oszczędzają nawet kilkanaście tysięcy złotych rocznie. 📈',
    'cześć': 'Cześć! 👋 Jak się masz? Mogę Ci pomóc z informacjami o czyszczeniu paneli. Zapytaj mnie o cokolwiek! 😊',
    'hello': 'Cześć! 👋 Mogę Ci pomóc? Pytaj o usługi, ceny, dostępność lub umów wizytę! 🌞',
};

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for direct keywords
    for (let keyword in chatbotResponses) {
        if (message.includes(keyword)) {
            return chatbotResponses[keyword];
        }
    }
    
    // Default responses
    if (message.length === 0) {
        return 'Napisz coś, a chętnie Ci pomogę! 😊';
    }
    
    const defaultResponses = [
        'To bardzo ciekawe pytanie! Czy mogę Ci pomóc w czymś konkretnym? Zapytaj mnie o ceny, dostępność, gwarancję lub umów wizytę! 😊',
        'Niesamowite! Czy potrzebujesz informacji o naszych usługach? Mogę Ci opowiedzieć o cenach, procesie czyszczenia, gwarancji lub dostępności. 💡',
        'Dzięki za zainteresowanie! Jeśli masz pytania - pisz śmiało! Jestem tutaj, aby Ci pomóc. ⚡',
        'Super! 👍 Czy chciałbyś wiedzieć coś więcej na temat czyszczenia paneli? Zapytaj mnie o ceny lub umów konsultację!'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function initChatbot() {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    
    if (!chatMessages || !chatInput || !chatSendBtn) return;
    
    function sendMessage() {
        const userText = chatInput.value.trim();
        
        if (userText === '') return;
        
        // Add user message to chat
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `<p>${escapeHtml(userText)}</p>`;
        chatMessages.appendChild(userMessageDiv);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate typing delay and send bot response
        setTimeout(() => {
            const botResponse = getBotResponse(userText);
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot-message';
            botMessageDiv.innerHTML = `<p>${botResponse}</p>`;
            chatMessages.appendChild(botMessageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    
    // Send on button click
    chatSendBtn.addEventListener('click', sendMessage);
    
    // Send on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick buttons functionality
    const quickButtons = document.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.textContent;
            setTimeout(() => {
                sendMessage();
            }, 100);
        });
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);

// ============================================================================
// ANIMATED COUNTER FOR STATS
// ============================================================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.dataset.target);
                const duration = 2500; // 2.5 seconds
                const startTime = Date.now();
                const element = entry.target;
                
                // Get the suffix (%, kWh, etc.)
                const text = element.textContent;
                const suffix = text.replace(/[\d,.\s]/g, '');
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                    const current = Math.floor(target * easeOutQuad);
                    
                    // Format number with commas
                    const formatted = current.toLocaleString('pl-PL');
                    element.textContent = formatted + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        element.dataset.animated = 'true';
                    }
                };
                
                animate();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', animateCounters);

// ============================================================================
// ANIMATED CANVAS BACKGROUND
// ============================================================================

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('canvas-bg');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.connectionDistance = 150;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                color: this.getRandomColor(),
                life: Math.random() * 100 + 50,
                maxLife: 150
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#00d4ff', '#ff006e', '#ffbe0b', '#00ff88'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * 0.5;
                particle.vy -= Math.sin(angle) * 0.5;
            }
            
            const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }
            
            const opacity = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color.replace('ff', Math.floor(255 * opacity * 0.6).toString(16).padStart(2, '0'));
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.5 + 0.5,
                    color: this.getRandomColor(),
                    life: Math.random() * 100 + 50,
                    maxLife: 150
                });
            }
        });
        
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    this.ctx.globalAlpha = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
});

// ============================================================================
// MOBILE MENU
// ============================================================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// ============================================================================
// FAQ TOGGLE
// ============================================================================

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        faqItem.classList.toggle('active');
    });
});

// ============================================================================
// FORM SUBMISSION
// ============================================================================

document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Wysłano!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
});

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .benefit-item, .blog-card, .cert-item').forEach(el => {
    observer.observe(el);
});

// ============================================================================
// PARALLAX EFFECT
// ============================================================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-particles');
    
    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelector('.nav-menu')?.classList.remove('active');
    }
});

// ============================================================================
// SCROLL-TO-TOP BUTTON
// ============================================================================

const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// COOKIE CONSENT BANNER
// ============================================================================

function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.querySelector('.btn-cookie-accept');
    const rejectBtn = document.querySelector('.btn-cookie-reject');

    if (!cookieBanner) return;

    // Check if cookies accepted before
    const cookiesAccepted = localStorage.getItem('cookies_accepted');
    
    if (!cookiesAccepted) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookies_accepted', 'true');
            localStorage.setItem('cookies_accepted_date', new Date().toISOString());
            cookieBanner.classList.remove('show');
            // You can add Google Analytics or other tracking here
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookies_accepted', 'false');
            cookieBanner.classList.remove('show');
        });
    }
}

// ============================================================================
// FORM VALIDATION ENHANCEMENTS
// ============================================================================

function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (!contactForm) return;

    // Email validation
    emailInput?.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorDiv = this.parentElement.querySelector('.form-error') || createErrorDiv(this);
        
        if (this.value && !emailRegex.test(this.value)) {
            errorDiv.textContent = 'Podaj prawidłowy adres email';
            errorDiv.classList.add('show');
        } else {
            errorDiv.classList.remove('show');
        }
    });

    // Phone validation (Polish format)
    phoneInput?.addEventListener('blur', function() {
        const phoneRegex = /^(\+48|48|0)?([0-9]{9}|[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{3})$/;
        const errorDiv = this.parentElement.querySelector('.form-error') || createErrorDiv(this);
        
        if (this.value && !phoneRegex.test(this.value.replace(/\s|-/g, ''))) {
            errorDiv.textContent = 'Podaj prawidłowy numer telefonu (np. +48 889 555 879)';
            errorDiv.classList.add('show');
        } else {
            errorDiv.classList.remove('show');
        }
    });

    // Name validation
    nameInput?.addEventListener('blur', function() {
        const errorDiv = this.parentElement.querySelector('.form-error') || createErrorDiv(this);
        
        if (this.value.length < 3) {
            errorDiv.textContent = 'Imię i nazwisko musi mieć co najmniej 3 znaki';
            errorDiv.classList.add('show');
        } else {
            errorDiv.classList.remove('show');
        }
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            if (input && !input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input?.classList.remove('invalid');
            }
        });

        if (isValid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success show';
            successMsg.textContent = '✓ Wysłano! Skontaktujemy się z Tobą wkrótce.';
            contactForm.appendChild(successMsg);

            // Reset form
            contactForm.reset();
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        }
    });
}

function createErrorDiv(inputElement) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    inputElement.parentElement.appendChild(errorDiv);
    return errorDiv;
}

// ============================================================================
// NEWSLETTER FORM VALIDATION
// ============================================================================

function initNewsletterValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (!newsletterForm || !newsletterEmail) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = newsletterEmail.value.trim();

        if (!emailRegex.test(email)) {
            if (newsletterMessage) {
                newsletterMessage.className = 'newsletter-message error';
                newsletterMessage.textContent = 'Podaj prawidłowy adres email';
            }
            return;
        }

        // Show success message
        if (newsletterMessage) {
            newsletterMessage.className = 'newsletter-message success';
            newsletterMessage.textContent = '✓ Dziękujemy za subskrypcję! Będziemy Cię informować o nowościach.';
        }

        newsletterForm.reset();
        
        setTimeout(() => {
            if (newsletterMessage) {
                newsletterMessage.textContent = '';
                newsletterMessage.className = 'newsletter-message';
            }
        }, 3000);
    });
}

// ============================================================================
// LAZY LOADING IMAGES
// ============================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('[data-src]');
    
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================================================
// MOBILE MENU ANIMATION
// ============================================================================

function initMobileMenuAnimation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================================================
// INITIALIZE ALL NEW FEATURES
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCookieConsent();
    initFormValidation();
    initNewsletterValidation();
    initLazyLoading();
    initMobileMenuAnimation();
    // BLOG: Expand full article on click
    document.querySelectorAll('.blog-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const full = this.parentElement.querySelector('.blog-full');
            if (!full) return;
            const isOpen = full.style.display === 'block';
            // Hide all others
            document.querySelectorAll('.blog-full').forEach(f => f.style.display = 'none');
            if (!isOpen) full.style.display = 'block';
        });
    });
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.pointerEvents = 'none';
        }, 2000);
    }
});

console.log('%c⚡ SolarClean - Powered by Modern Web Technology', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
