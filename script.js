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

    // Function to update the active link based on scroll position
    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 240;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const threshold = 100;
        const sections = document.querySelectorAll('section[id]');

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
    };

    // Handle nav link clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const isSamePageLink = href.startsWith('#');
            let targetId = isSamePageLink ? href.substring(1) : href.split('#')[1]; // Extract section without the #

            // Handle case when there's no hash in the URL
            if (!targetId && !isSamePageLink) {
                // Regular navigation to another page without hash
                return; // Let the default navigation happen
            }

            const targetElement = targetId ? document.querySelector(`#${targetId}`) : null;

            if (targetElement) {
                // Prevent default only if we found a target on this page
                e.preventDefault();

                // Close the navbar if it's open (mobile)
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                    body.classList.remove('nav-open');
                }

                // Calculate scroll position (accounting for fixed header)
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                // Use requestAnimationFrame to ensure DOM updates before scrolling
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: targetPosition,
                        // Always use smooth scrolling on both mobile and desktop
                        behavior: 'smooth'
                    });

                    // Set active class
                    links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            } else if (!isSamePageLink && targetId) {
                // Cross-page navigation (e.g., from airport.html to index.html#section)
                sessionStorage.setItem('scrollTo', targetId);
            }
        });
    });

    // Handle scroll-to-section after page load (for cross-page navigation)
    const scrollToId = sessionStorage.getItem('scrollTo');
    if (scrollToId) {
        const targetElement = document.querySelector(`#${scrollToId}`);
        if (targetElement) {
            // Wait for the page to fully load before scrolling
            setTimeout(() => {
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
            }, 100);
        }
        sessionStorage.removeItem('scrollTo');
    }

    // Update active link on scroll (for all pages with sections)
    if (document.querySelectorAll('section[id]').length > 0) {
        window.addEventListener('scroll', updateActiveLink);
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
