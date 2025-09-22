// Initialize scripts when DOM is loaded
export const initScripts = () => {
    // Initialize AOS (Animate On Scroll)
    if (window.AOS) {
        window.AOS.init({
            duration: 1500,
            once: true,
            offset: 50
        });
    }

    // Initialize counters
    const initCounters = () => {
        const counters = document.querySelectorAll('.count-text');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-stop'));
            const speed = parseInt(counter.getAttribute('data-speed')) || 3000;
            let current = 0;
            const increment = target / (speed / 16);

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    };

    // Initialize counters when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const counterSections = document.querySelectorAll('.counter-text-wrap');
    counterSections.forEach(section => {
        observer.observe(section);
    });

    // Initialize scroll to top functionality
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        });
    }

    // Initialize search functionality
    const searchBtn = document.querySelector('.nav-search > button');
    const searchForm = document.querySelector('.nav-search form');

    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchForm.classList.toggle('hide');
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
                searchForm.classList.add('hide');
            }
        });
    }

    // Initialize sidebar menu
    const menuSidebarBtn = document.querySelector('.menu-sidebar button');
    const hiddenBar = document.querySelector('.hidden-bar');
    const formBackDrop = document.querySelector('.form-back-drop');
    const crossIcon = document.querySelector('.cross-icon span');

    if (menuSidebarBtn && hiddenBar) {
        menuSidebarBtn.addEventListener('click', () => {
            document.body.classList.toggle('side-content-visible');
        });
    }

    if (crossIcon && formBackDrop) {
        const closeSidebar = () => {
            document.body.classList.remove('side-content-visible');
        };

        crossIcon.addEventListener('click', closeSidebar);
        formBackDrop.addEventListener('click', closeSidebar);
    }

    // Initialize dropdown menus
    const dropdowns = document.querySelectorAll('.navigation li.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('ul');

        if (link && submenu) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    });

    // Initialize mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggle && navbarCollapse) {
        navbarToggle.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }
};

// Export for use in components
export default initScripts; 