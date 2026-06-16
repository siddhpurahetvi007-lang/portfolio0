document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 0. Preloader Animation
    const preloaderTl = gsap.timeline();
    let counterObj = { value: 0 };
    
    preloaderTl.to(counterObj, {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            const counterEl = document.querySelector('.preloader-counter');
            if (counterEl) {
                counterEl.innerText = Math.round(counterObj.value) + '%';
            }
        }
    })
    .to(".preloader", {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut"
    }, "+=0.2");

    // 0.5 Initial Cinematic Load Animation
    const tl = gsap.timeline({ delay: 2.5 });
    
    // Hide name initially in CSS or just start from here
    gsap.set(".name-line", { y: 50, opacity: 0 });
    gsap.set(".bottom-fade", { opacity: 0 });

    tl.to(".name-line", { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power3.out" 
    })
    .to(".cinematic-line", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out"
    }, "-=0.5")
    .to(".bottom-fade", { 
        opacity: 1, 
        duration: 1, 
        ease: "power2.out" 
    }, "-=0.5");

    // 0.5 Mouse Movement Parallax
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        gsap.to(".hero-text-layer", {
            x: x,
            y: y,
            duration: 1.5,
            ease: "power2.out"
        });
        
        gsap.to(".hero-center-art", {
            x: -x * 2,
            y: -y * 2,
            rotation: "+=0.1", // slight extra rotation on move
            duration: 1.5,
            ease: "power2.out"
        });
    });

    // 2. Parallax Watermark Background
    gsap.to(".bg-watermark", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        y: "-20%", // Move upwards slower than scroll
        ease: "none"
    });

    // 3. Hero Art Parallax / Rotation
    gsap.to(".art-glass", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        rotation: 135,
        y: 100,
        ease: "none"
    });

    // 4. Number Counters
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    // 5. Product Tour Cards Animation (Stacking effect)
    const cards = gsap.utils.toArray('.ui-card');
    
    cards.forEach((card, i) => {
        gsap.fromTo(card, 
            { 
                y: 150, 
                opacity: 0,
                scale: 0.9
            },
            {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "top 50%",
                    scrub: 1
                },
                y: 0,
                opacity: 1,
                scale: 1,
                ease: "none"
            }
        );
    });

    // 5.5 3D Card Tilt Effect
    const tiltCards = document.querySelectorAll('.project-card, .skill-category, .cert-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle rotation calculation
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    });

    // Sub-animation: fade elements on enter
    gsap.utils.toArray('.about-header h2, .about-desc, .stat-card, .fade-up').forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }
        );
    });
});
