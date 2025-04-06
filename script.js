document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    const links = document.querySelectorAll('.nav-links a');

    // Toggle mobile nav on hamburger click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('show');
        body.classList.toggle('nav-open');
    });

    // Handle nav link clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const isSamePageLink = href.startsWith('#');
            const targetId = isSamePageLink ? href : href.split('#')[1]; // Extract #section from ../index.html#section
            const targetElement = targetId ? document.querySelector(`#${targetId}`) : null;

            // Close the navbar if it’s open (mobile)
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('active');
                body.classList.remove('nav-open');
            }

            if (isSamePageLink && targetElement) {
                // In-page scrolling (e.g., on index.html)
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight; // 70px
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: window.innerWidth <= 768 ? 'auto' : 'smooth'
                });

                // Set active class
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            } else if (!isSamePageLink && targetId) {
                // Cross-page navigation (e.g., from airport.html to index.html#section)
                // Let default navigation occur, and handle scroll on the target page
                sessionStorage.setItem('scrollTo', targetId); // Store target for after navigation
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Handle scroll-to-section after page load (for cross-page navigation)
    const scrollToId = sessionStorage.getItem('scrollTo');
    if (scrollToId) {
        const targetElement = document.querySelector(`#${scrollToId}`);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Update active class
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').endsWith(`#${scrollToId}`)) {
                    link.classList.add('active');
                }
            });
        }
        sessionStorage.removeItem('scrollTo'); // Clean up
    }

    // Update active link on scroll (only for index page)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 240;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const threshold = 100;

            if (window.scrollY + windowHeight >= documentHeight - threshold) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').endsWith('#contact')) {
                        link.classList.add('active');
                    }
                });
            } else {
                sections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    const id = section.getAttribute('id');
                    if (scrollPosition >= top - 20 && scrollPosition < top + height) {
                        links.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href').endsWith(`#${id}`)) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }
        });
    }

    // Fade-in animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));
});
