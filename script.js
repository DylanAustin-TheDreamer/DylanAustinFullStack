// =====================
// Smooth Scrolling Navigation
// =====================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =====================
    // Contact Form Handling
    // =====================
    document.getElementById("lead-form").addEventListener("submit", function (e) {
            e.preventDefault();
            submitForm();
        });

    const contactForm = document.getElementById('lead-form');
    let errorPage = "errorpage.html";

    async function submitForm() {
        const btn = document.querySelector('button[type="submit"]');
        // Get form values
        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        
        // Validate form
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
            btn.disabled = true;
            const res = await fetch("https://gentle-morning-6754.austindylan0.workers.dev/", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });

            const data = await res.json();
            
            // Redirect to confirmation page on success
            window.location = "confirmation.html";

        } catch (err) {
            if(err != null){
                console.error("Submission failed:", err);
                // Redirect to error page on failure
                window.location = errorPage;
            }
        }
    };

    // =====================
    // Navbar Scroll Effect
    // =====================

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // =====================
    // Intersection Observer for Animations
    // =====================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe skill cards and project cards
    document.querySelectorAll('.skill-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
