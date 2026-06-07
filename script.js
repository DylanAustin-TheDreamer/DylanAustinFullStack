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

    const reviews = [
        {
            name: "Billy D",
            business: "Billy D Fitness",
            rating: 5,
            text: "Absolutely brilliant service from start to finish! I needed a professional website built for my fitness business and Dylan exceeded all expectations. The design is sleek, modern, and exactly what I was looking for. His attention to detail, programming skills, and ability to bring my vision to life were top-tier. Communication was fantastic throughout the entire build. If you need a high-quality website from a talented developer who genuinely cares about the project, look no further than Dylan. Highly recommended!",
            link: "https://share.google/St6vj8AhETTlqqTk4",
        },
        {
            name: "Lee Dyson",
            business: "Wood Farm Fisheries",
            rating: 5,
            text: "Absolutely amazing lad. I wanted something that looked professional and was also able to update and this was delivered with no hesitation. Communication from start to finish was on point along with every little detail and even through I. Some ideas which made it “pop” even more. Thankyou very much much. Will definitely be recommending you to others 5*****",
            link: "https://maps.app.goo.gl/vxk78Dq155dX8XWi8",
        },
    ];

    const reviewsGrid = document.getElementById("reviews-grid");
    const reviewTransitionDuration = 1300;
    const reviewCycleDelay = 5000;
    let reviewTransitionTimeout = null;
    let reviewCycleTimeout = null;
    let isReviewTransitioning = false;

    function buildStars(rating) {
        const safeRating = Math.max(0, Math.min(5, rating));
        return "★★★★★".slice(0, safeRating);
    }

    function renderReviews(startIndex = 0, animate = true) {
        if (!reviewsGrid) {
            return;
        }

        if (reviews.length === 0) {
            reviewsGrid.innerHTML = '<div class="review-empty">Add your Google reviews to the reviews array in script.js.</div>';
            return;
        }
        
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const reviewsToShow = isMobile ? 1 : 3;

        const visibleReviews = Array.from({ length: reviewsToShow }, (_, offset) => {
            return reviews[(startIndex + offset) % reviews.length];
        });

        const reviewsMarkup = visibleReviews.map(review => `
            <article class="review-card">
                <div class="review-card-top">
                    <div>
                        <h3>${review.name}</h3>
                        <p class="review-business">${review.business}</p>
                    </div>
                    <span class="review-source">Google</span>
                </div>
                <div class="review-stars" aria-label="${review.rating} out of 5 stars">${buildStars(review.rating)}</div>
                <p class="review-text">${review.text.slice(0,100)}... <a href="${review.link}" target="_blank" style="color: blue; text-decoration: none;">See More.</a></p>
            </article>
        `).join("");

        const finishRender = () => {
            reviewsGrid.innerHTML = reviewsMarkup;
            window.requestAnimationFrame(() => {
                reviewsGrid.querySelectorAll(".review-card").forEach(card => {
                    card.classList.add("show");
                });
            });
            isReviewTransitioning = false;
        };

        if (!animate || !reviewsGrid.children.length) {
            finishRender();
            return;
        }

        if (isReviewTransitioning) {
            return;
        }

        isReviewTransitioning = true;

        reviewsGrid.querySelectorAll(".review-card").forEach(card => {
            card.classList.remove("show");
        });

        if (reviewTransitionTimeout) {
            window.clearTimeout(reviewTransitionTimeout);
        }

        reviewTransitionTimeout = window.setTimeout(finishRender, reviewTransitionDuration);
    }

    if (reviewsGrid) {
        let currentIndex = 0;
        renderReviews(currentIndex, false);

        if (reviews.length > 1) {
            const scheduleNextReview = () => {
                reviewCycleTimeout = window.setTimeout(() => {
                    currentIndex = (currentIndex + 1) % reviews.length;
                    renderReviews(currentIndex);
                    scheduleNextReview();
                }, reviewCycleDelay);
            };

            scheduleNextReview();
        }

        window.addEventListener("beforeunload", () => {
            if (reviewTransitionTimeout) {
                window.clearTimeout(reviewTransitionTimeout);
            }

            if (reviewCycleTimeout) {
                window.clearTimeout(reviewCycleTimeout);
            }
        });
    }

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
