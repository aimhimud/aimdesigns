document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const servicePanels = document.querySelectorAll('.service-panel');
    const header = document.querySelector('header');
    const sectionTitles = document.querySelectorAll('.section-title');
    const serviceCards = document.querySelectorAll('.service-card');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const contactForm = document.querySelector('.contact-form');
    const lightbox = document.getElementById('lightbox');
    const lightboxSlider = document.getElementById('lightboxSlider');
    const lightboxBeforeImg = lightboxSlider.querySelector('.before-img');
    const lightboxAfterImg = lightboxSlider.querySelector('.after-img');
    const lightboxRange = document.getElementById('lightboxRange');
    const closeBtn = document.getElementById('closeBtn');
    const expandLinks = document.querySelectorAll('.expand-img');

    // Mobile Menu Toggle
    menuBtn.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    const toggleMenu = () => {
        console.log('Toggling menu...');
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
    };
    menuBtn.addEventListener('click', toggleMenu);
    menuBtn.addEventListener('touchstart', toggleMenu);

    // Tab Functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(`Switching to tab: ${btn.getAttribute('data-tab')}`);
            tabBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            servicePanels.forEach(panel => {
                if (panel.id === `${tabId}-panel`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionTitles.forEach(title => observer.observe(title));
    serviceCards.forEach(card => observer.observe(card));
    portfolioItems.forEach(item => observer.observe(item));
    testimonialCards.forEach(card => observer.observe(card));
    observer.observe(contactForm);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                navLinks.classList.remove('open');
                menuBtn.classList.remove('active');
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.warn(`Target element for ${href} not found`);
                }
            }
        });
    });

    // Slider Functionality for Services (For Individuals)
    const sliders = document.querySelectorAll('.slider-container .slider');
    sliders.forEach(slider => {
        const container = slider.closest('.slider-container');
        const beforeImg = container.querySelector('.before-img');
        const afterImg = container.querySelector('.after-img');
        
        const beforeUrl = container.getAttribute('data-before');
        const afterUrl = container.getAttribute('data-after');
        console.log(`Slider - Before: ${beforeUrl}, After: ${afterUrl}`);
        if (beforeUrl && afterUrl) {
            beforeImg.style.backgroundImage = `url(${beforeUrl})`;
            afterImg.style.backgroundImage = `url(${afterUrl})`;
        } else {
            console.error('Missing data-before or data-after attributes');
        }

        slider.addEventListener('input', (e) => {
            const value = slider.value;
            afterImg.style.clipPath = `inset(0 0 0 ${value}%)`;
        });
    });

    // Preload Images Function
    const preloadImages = (urls, callback) => {
        let loaded = 0;
        const total = urls.length;
        urls.forEach(url => {
            const img = new Image();
            img.onload = () => {
                if (++loaded === total) callback();
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${url}`);
                if (++loaded === total) callback();
            };
            img.src = url;
        });
    };

    // Lightbox Functionality for Services
    const openLightbox = (card) => {
        console.log('Opening lightbox for card:', card);
        const sliderContainer = card.querySelector('.slider-container');
        if (sliderContainer) {
            const beforeFull = sliderContainer.getAttribute('data-full-before');
            const afterFull = sliderContainer.getAttribute('data-full-after');
            const sliderValue = sliderContainer.querySelector('.slider').value;

            console.log('Before Full:', beforeFull);
            console.log('After Full:', afterFull);
            console.log('Slider Value:', sliderValue);

            if (beforeFull && afterFull) {
                preloadImages([beforeFull, afterFull], () => {
                    console.log('Images preloaded, assigning to lightbox');
                    lightboxBeforeImg.style.backgroundImage = `url(${beforeFull})`;
                    lightboxAfterImg.style.backgroundImage = `url(${afterFull})`;
                    lightboxRange.value = sliderValue;
                    lightboxAfterImg.style.clipPath = `inset(0 0 0 ${sliderValue}%)`;
                    lightboxRange.style.display = 'block';
                    lightbox.classList.add('active');
                    console.log('Lightbox opened with slider');
                });
            } else {
                console.error('Missing data-full-before or data-full-after attributes');
            }
        } else {
            const serviceImg = card.querySelector('.service-img');
            const fullImg = serviceImg ? serviceImg.getAttribute('data-full') : null;
            console.log(`Lightbox - Full Image: ${fullImg}`);
            if (fullImg) {
                preloadImages([fullImg], () => {
                    console.log('Image preloaded, assigning to lightbox');
                    lightboxBeforeImg.style.backgroundImage = `url(${fullImg})`;
                    lightboxAfterImg.style.backgroundImage = 'none';
                    lightboxAfterImg.style.clipPath = 'inset(0 0 0 100%)';
                    lightboxRange.style.display = 'none';
                    lightbox.classList.add('active');
                    console.log('Lightbox opened without slider');
                });
            } else {
                console.error('Missing data-full attribute');
            }
        }
    };

    expandLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Expand Image clicked on desktop');
            const card = link.closest('.service-card');
            if (card) {
                openLightbox(card);
            } else {
                console.error('No service card found for this expand link');
            }
        });
        link.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log('Expand Image touched on mobile');
            const card = link.closest('.service-card');
            if (card) {
                openLightbox(card);
            }
        });
    });

    // Lightbox Slider
    lightboxRange.addEventListener('input', () => {
        const value = lightboxRange.value;
        lightboxAfterImg.style.clipPath = `inset(0 0 0 ${value}%)`;
    });

    // Lightbox Functionality for Portfolio
    portfolioItems.forEach(item => {
        const openPortfolioLightbox = () => {
            const fullImg = item.getAttribute('data-full');
            console.log(`Portfolio Lightbox - Full Image: ${fullImg}`);
            if (fullImg) {
                preloadImages([fullImg], () => {
                    lightboxBeforeImg.style.backgroundImage = `url(${fullImg})`;
                    lightboxAfterImg.style.backgroundImage = 'none';
                    lightboxAfterImg.style.clipPath = 'inset(0 0 0 100%)';
                    lightboxRange.style.display = 'none';
                    lightbox.classList.add('active');
                });
            } else {
                console.error('Missing data-full attribute in portfolio item');
            }
        };
        item.addEventListener('click', openPortfolioLightbox);
        item.addEventListener('touchstart', openPortfolioLightbox);
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        console.log('Lightbox closed');
    };
    closeBtn.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('touchstart', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    const contactFormElement = document.getElementById('contactForm');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.getElementById('close-notification');
    
    if (contactFormElement) {
        contactFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
    
            fetch(contactFormElement.action, {
                method: 'POST',
                body: new FormData(contactFormElement),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Thank you for your message! I’ll get back to you soon.', 'success');
                    contactFormElement.reset();
                } else {
                    showNotification('Oops! Something went wrong. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error sending your message. Please try again.', 'error');
            });
        });
    } else {
        console.error('Contact form element not found');
    }
    
    function showNotification(message, type) {
        notificationMessage.textContent = message;
        notification.classList.remove('success', 'error');
        notification.classList.add(type);
        notification.classList.add('show');
        notification.style.animation = 'slideIn 0.5s ease forwards';
    
        setTimeout(() => {
            hideNotification();
        }, 5000);
    
        closeNotification.onclick = hideNotification;
    }
    
    function hideNotification() {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => {
            notification.classList.remove('show');
            notification.style.animation = '';
        }, 500);
    }
});