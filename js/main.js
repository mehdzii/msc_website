document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. FORCE THEME PREFERENCE
     * Since the manual toggle button was removed, we force the site to 
     * light mode to ensure the editorial white background remains consistent.
     */
    document.body.setAttribute('data-bs-theme', 'light');

    /**
     * 2. NAVBAR SCROLL EFFECT
     * Adds the 'scrolled' class to your navbar for the glass/blur effect 
     * once the user moves 50px down the page.
     */
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /**
     * 3. SMOOTH ANCHOR SCROLLING
     * Ensures clicking 'About', 'Members', or 'Journey' in your navbar 
     * slides smoothly to the correct section ID.
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /**
     * 4. SCROLL REVEAL (INTERSECTION OBSERVER)
     * This fixes the "empty" Bento Grid by detecting when cards enter the 
     * viewport and adding the 'is-visible' class to trigger CSS animations.
     */
    const fadeElements = document.querySelectorAll('.scroll-fade-in');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adds the class that triggers the opacity and transform change
                entry.target.classList.add('is-visible');
                // Stops observing once the element is visible for better performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,      // Element is 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    /**
     * 5. COUNTDOWN TIMER
     * Live countdown to the next upcoming event.
     */
    const countdownEl = document.getElementById('eventCountdown');
    if (countdownEl) {
        const targetDate = new Date(countdownEl.dataset.target).getTime();

        function updateCountdown() {
            const now = Date.now();
            const diff = targetDate - now;

            if (diff <= 0) {
                document.getElementById('cd-days').textContent = '0';
                document.getElementById('cd-hours').textContent = '0';
                document.getElementById('cd-mins').textContent = '0';
                document.getElementById('cd-secs').textContent = '0';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cd-days').textContent = days;
            document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
            document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /**
     * 6. INFINITE CIRCULAR SCROLL FOR EVENTS
     * Clones event cards to create seamless looping scroll.
     * Starts centered so events are visible on both left and right.
     */
    const scrollWrap = document.querySelector('.events-scroll-wrap');
    const scrollTrack = document.querySelector('.events-scroll-track');

    if (scrollWrap && scrollTrack) {
        const cards = scrollTrack.querySelectorAll('.event-card-minimal');
        const cardCount = cards.length;

        // Clone all cards and append them (for forward scroll)
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            scrollTrack.appendChild(clone);
        });

        // Also prepend clones (for backward scroll)
        for (let i = cardCount - 1; i >= 0; i--) {
            const clone = cards[i].cloneNode(true);
            clone.classList.add('clone');
            scrollTrack.insertBefore(clone, scrollTrack.firstChild);
        }

        // Calculate the width of one full set of cards
        const gap = 24; // 1.5rem gap
        const cardWidth = cards[0].offsetWidth + gap;
        const oneSetWidth = cardWidth * cardCount;

        // Start scrolled to the middle set (skipping the prepended clones)
        scrollWrap.scrollLeft = oneSetWidth;

        // Listen for scroll to create the infinite loop
        let ticking = false;
        scrollWrap.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollPos = scrollWrap.scrollLeft;
                // If scrolled past the middle + original set, jump back
                if (scrollPos >= oneSetWidth * 2) {
                    scrollWrap.scrollLeft = scrollPos - oneSetWidth;
                }
                // If scrolled before the start of the middle set, jump forward
                if (scrollPos <= 0) {
                    scrollWrap.scrollLeft = scrollPos + oneSetWidth;
                }
                ticking = false;
            });
        });
    }

    /**
     * 7. ANIMATED STATS COUNTER
     * Counts stat numbers from 0 to their data-target value when they
     * scroll into view. Uses IntersectionObserver for trigger detection
     * and requestAnimationFrame for smooth animation.
     */
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => {
                        const target = parseInt(num.dataset.target);
                        const duration = 2000; // 2 seconds
                        const startTime = performance.now();

                        function animateCount(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease out cubic for smooth deceleration
                            const eased = 1 - Math.pow(1 - progress, 3);
                            num.textContent = Math.round(target * eased);

                            if (progress < 1) {
                                requestAnimationFrame(animateCount);
                            }
                        }

                        requestAnimationFrame(animateCount);
                    });
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsRow = document.querySelector('.stats-row');
        if (statsRow) statsObserver.observe(statsRow);
    }

});