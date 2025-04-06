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

    // Handle nav link clicks to close navbar and scroll
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = link.getAttribute('href');

            // Close the navbar if it’s open (mobile)
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('active');
                body.classList.remove('nav-open');
            }

            // Scroll to target section
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight; // 70px
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // 90px total offset

                // Instant scroll on mobile, smooth on desktop
                window.scrollTo({
                    top: targetPosition,
                    behavior: window.innerWidth <= 768 ? 'auto' : 'smooth'
                });

                // Manually set active class after scroll (for consistency)
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 180; // Adjusted to header height only
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            // Check if scroll position is within section bounds
            if (scrollPosition >= top - 20 && scrollPosition < top + height) { // Adjusted threshold
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    });

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
