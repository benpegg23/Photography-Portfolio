document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const heroImage = document.querySelector('.hero img');
    const heroText = document.querySelector('.hero-text');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const portfolioSection = document.querySelector('.portfolio-grid');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const colorSwitcher = document.querySelector('.color-switcher');
    const colorSwitcherIcon = colorSwitcher.querySelector('img');
    const logoImg = document.querySelector('.logo img');
    const logo = document.querySelector('.logo');
    const colors = ['white', 'teal', 'pink', 'yellow', 'green'];
    let currentColorIndex = 0;

    // Preload all logo and star images
    const preloadImages = () => {
        const imageUrls = colors.flatMap(color => [
            color === 'white' ? 'images/bp_logo_v1.png' : `images/bp_logo_${color}.png`,
            `images/stars_${color}.png`
        ]);

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    };
    preloadImages();

    // Logo click handler for confetti
    logo.addEventListener('click', (e) => {
        // Only trigger confetti if we're on the home page
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            e.preventDefault();
            
            const themeColors = {
                'white': '#ffffff80',
                'teal': '#00ffff80',
                'pink': '#ff00ff80',
                'yellow': '#ffff0080',
                'green': '#00ff0080'
            };
            
            // Create multiple confetti bursts with different patterns
            const rect = logo.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2 / window.innerWidth;
            const y = (rect.top + rect.bottom) / 2 / window.innerHeight;
            
            // Create 3 bursts with different patterns
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * 360;
                const spread = 80 + Math.random() * 80; // Random spread between 80-160
                const drift = -2 + Math.random() * 4; // Random drift between -2 and 2
                
                confetti({
                    particleCount: 20,
                    spread: spread,
                    origin: { x, y },
                    colors: Object.values(themeColors),
                    ticks: 100 + Math.random() * 60, // Random duration
                    gravity: 0.8 + Math.random() * 0.4, // Random gravity
                    scalar: 0.8 + Math.random() * 0.4, // Random size
                    shapes: ['star'],
                    startVelocity: 8 + Math.random() * 8, // Random initial velocity
                    angle: angle,
                    drift: drift,
                    decay: 0.88,
                    random: Math.random(),
                    flat: Math.random() > 0.5, // Randomly make some stars flat
                    shapeOptions: {
                        rotate: Math.random() > 0.5 // Randomly rotate some stars
                    }
                });
            }
        }
    });

    // Mouse parallax for portfolio items
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        let rafId = null;
        
        // Set initial position for portraits image
        if (item.getAttribute('href') === '/portraits') {
            img.style.objectPosition = 'center 20%';
        }
        
        item.addEventListener('mousemove', (e) => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            
            rafId = requestAnimationFrame(() => {
                const rect = item.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const xPercent = (mouseX / rect.width - 0.5) * 2;
                const yPercent = (mouseY / rect.height - 0.5) * 2;
                
                const moveX = xPercent * 7;
                const moveY = yPercent * 7;
                
                img.style.transform = `scale(1.15) translate(${moveX}%, ${moveY}%)`;
            });
        });
        
        item.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            img.style.transform = 'scale(1)';
        });
    });

    // Color switcher functionality
    colorSwitcher.addEventListener('click', () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        const newColor = colors[currentColorIndex];
        
        // Update theme
        document.body.dataset.theme = newColor;
        
        // Update images without fade
        colorSwitcherIcon.src = `images/stars_${newColor}.png`;
        logoImg.src = newColor === 'white' ? 
            'images/bp_logo_v1.png' : 
            `images/bp_logo_${newColor}.png`;
    });
    
    // Handle scroll indicator click
    scrollIndicator.addEventListener('click', () => {
        scrollIndicator.classList.add('hidden');
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Scroll effects
    let lastScrollPosition = window.pageYOffset;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollPosition = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(lastScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    });

    function handleScroll(scrolled) {
        // Update navigation background
        if (scrolled > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide scroll indicator when scrolling starts
        if (scrolled > 20) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
        
        // Parallax effect for hero image and text fade
        if (scrolled < window.innerHeight) {
            const moveAmount = scrolled * 0.4;
            heroImage.style.transform = `translateY(${moveAmount}px)`;
            
            // Calculate distances for fade
            const heroTextRect = heroText.getBoundingClientRect();
            const navHeight = nav.offsetHeight;
            const buffer = 300; // Much larger buffer for earlier, more gradual fade
            
            // Start fade when top of text is navHeight + buffer away from top of window
            const fadeStart = heroTextRect.height + navHeight + buffer;
            const fadeEnd = fadeStart - (navHeight + buffer);
            
            // Calculate opacity based on distance from nav
            const opacity = Math.max(0, Math.min(1, (heroTextRect.top - navHeight) / buffer));
            heroText.style.opacity = opacity;
        }
    }
});
