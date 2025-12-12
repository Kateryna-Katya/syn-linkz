document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ---
    lucide.createIcons();
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        touchMultiplier: 2,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // --- 2. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const links = document.querySelectorAll('.header__link');
    const body = document.body;

    const toggleMenu = () => {
        const isActive = burger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        if (isActive) { lenis.stop(); body.style.overflow = 'hidden'; } 
        else { lenis.start(); body.style.overflow = ''; }
    };

    if(burger) burger.addEventListener('click', toggleMenu);
    links.forEach(l => l.addEventListener('click', () => {
        if(nav.classList.contains('is-active')) toggleMenu();
    }));

    // --- 3. АНИМАЦИИ ---
    const heroTl = gsap.timeline({ delay: 0.1 });
    heroTl.to('.hero .reveal-hidden', {
        y: 0, opacity: 1, autoAlpha: 1,
        duration: 0.8, stagger: 0.1, ease: 'power2.out'
    });

    const hiddenElements = document.querySelectorAll('.section .reveal-hidden');
    ScrollTrigger.batch(hiddenElements, {
        start: 'top 85%',
        onEnter: batch => gsap.to(batch, {
            opacity: 1, y: 0, autoAlpha: 1,
            stagger: 0.15, duration: 0.8, ease: 'power3.out', overwrite: true
        }),
        once: true
    });

    const cards = document.querySelectorAll('.reveal-card');
    if (cards.length > 0) {
        ScrollTrigger.batch(cards, {
            start: 'top 90%',
            onEnter: batch => gsap.fromTo(batch, 
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, autoAlpha: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.2)' }
            ),
            once: true
        });
    }

    // --- 4. КОНТАКТНАЯ ФОРМА ---
    const contactForm = document.getElementById('contactForm');
    const captchaSpan = document.getElementById('captchaQuestion');
    const captchaInput = document.getElementById('captcha');
    const phoneInput = document.getElementById('phone');
    const successMsg = document.getElementById('successMessage');

    if (contactForm) {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaSpan.textContent = `${num1} + ${num2}`;
        const correctAnswer = num1 + num2;

        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (parseInt(captchaInput.value) !== correctAnswer) {
                alert('Неверный ответ в капче! Попробуйте снова.');
                return;
            }
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerText = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                successMsg.style.display = 'block';
                gsap.from(successMsg, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' });
            }, 1500);
        });
    }

    // --- 5. COOKIE POPUP (Новый блок) ---
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');
    
    // Проверка, было ли уже принято согласие
    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        // Показываем с задержкой 2 секунды
        gsap.to(cookiePopup, {
            y: 0,
            duration: 0.8,
            delay: 2,
            ease: 'power3.out'
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            // Сохраняем согласие
            localStorage.setItem('cookiesAccepted', 'true');
            // Скрываем попап
            gsap.to(cookiePopup, {
                y: 200, // Уводим вниз
                opacity: 0,
                duration: 0.6,
                ease: 'power2.in'
            });
        });
    }

    console.log('System ready with Cookies');
});