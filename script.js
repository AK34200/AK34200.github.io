// Portfolio Game Designer - JavaScript optimisé pour la performance
class PortfolioApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupPerformanceOptimizations();
    }

    init() {
        // Initialisation des composants principaux
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.particles = document.getElementById('particles');
        this.gameCube = document.getElementById('game-cube');
        this.projectsGrid = document.getElementById('projects-grid');
        this.projectsDevGrid = document.getElementById('projects-dev-grid');
        this.contactForm = document.getElementById('contact-form');
        this.projectModal = document.getElementById('project-modal');
        this.projectModalBody = document.getElementById('project-modal-body');

        // État de l'application
        this.isNavOpen = false;
        this.isScrolling = false;
        this.lastScrollY = 0;

        // Données des projets
        // Astuce: mets ici une image différente par projet (fichier local ou URL)
        this.projects = [
            {
                title: "Team AW - Storm on Tenroh Island",
                description: "On a Caribbean archipelago, a nonprofit organization works to combat storms and the damage they cause. When a meteorologist detects an impending storm, an alert is issued to protect civilians. After the storm passes, volunteers help with relief efforts and the reconstruction of villages, and support residents by recovering lost items, repairing structures, or simply talking with them.",
                tech: ["3D", "Singleplayer", "Unreal Engine"],
                image: "https://img.itch.zone/aW1nLzI0MzQ1OTI4LnBuZw==/315x250%23c/PYUP%2Fn.png",
                demo: "https://ak34200.itch.io/storm-on-tenroh-island",
                popupImage: "popstorm.PNG"
            },
            {
                title: "Oh Work Darwin",
                description: "Darwin is a young archivist exhausted by his work. One day he falls asleep at his desk and wakes up locked inside without a way out. His boss then gives him an ultimatum: complete the tasks in 15 minutes or lose his job. A race against time begins.",
                tech: ["Puzzle","Singleplayer", "Unreal Engine"],
                image: "https://img.itch.zone/aW1nLzIwOTI2NzEyLnBuZw==/315x250%23c/7Kb93d.png",
                demo: "https://ak34200.itch.io/oh-work-darwin",
                popupImage: "popdarwins.PNG",
            },
            {
                title: "Lost Soul of Lazarisiz",
                description: "You are Soul, a soul who has lost his father. To save him you must find the Crystal Heart, an artifact belonging to an ancient civilization. Your journey begins in the city of Lazarisiz. The residents talk about ancient guardians and traps that protect the crystal. To recover the Crystal Heart you must decipher ancient inscriptions, traverse underground labyrinths, and fight shadows. Each challenge will bring you closer to your father and the truth about what it really means to save someone you love.",
                tech: ["Platformer","singleplayer", "Unity"],
                image: "https://img.itch.zone/aW1nLzE2Mzg0MzgzLnBuZw==/315x250%23c/pzqrXG.png",
                demo: "https://ak34200.itch.io/lost-soul-of-lazarisiz",
                popupImage: "poplostsoul.PNG",
            },
            {
                title: "KrakHead",
                description: "It is a versus party game multiplayer Local where players compete in an arena surrounded by water and must push themselves beyond the limits. Events come punctuate and disrupt the game.  ",
                tech: ["Party-Game","Unreal Engine"],
                image: "KrakHead.png",
                demo: "https://warpstoneaddict.itch.io/krakhead",
                popupImage: "popkrakhead.PNG",
            },
            {
                title: "The Camera Masker",
                description: "A game prototype created during the 2026 Global Game Jam using Unreal Engine 5, with the theme of masks. ",
                tech: ["Proto"],  
                image: "The camera masker.PNG",
                demo: "https://maxibaguette.itch.io/the-camera-masker",
            }
        ];

        this.projectsInDev = [
            {
                title: "Rayman Project",
                description: "A personal project born out of my passion for Rayman and my goal of mastering Unreal Engine. Drawing on the mechanics of Rayman 2 and Rayman 3, I’m designing new mechanics and exploring new types of level design, building on the series’ fluid and playful platforming. ",
                tech:  ["Action", "aventure", "Prototype"],
                image: "rayman.png",
                
                popupImage: "raymanproject.PNG ",
            },
            {
                title: "Hunting Ground ",
                description: "One player (the Hunted) uses parkour to escape from a monster while completing tasks that unlock the level’s exit. Meanwhile, the monster tracks the player down and tries to eliminate them before they escape. ",
                tech: ["Platformer 3D","multijoueur","survival horreur","Unity"], 
                image: "huntingground.png",
                
                popupImage: "pophunting.PNG",
            }
        ];

        // Initialisation des composants
        this.initParticles();
        this.initGameCube();
        this.renderProjects();
        this.initCounters();
        this.initProjectModal();
    }

    setupEventListeners() {
        // Navigation
        this.navToggle.addEventListener('click', () => this.toggleNav());

        // Liens de navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeNav();
            });
        });

        // Scroll events optimisés
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.isScrolling = true;
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.isScrolling = false;
                });
            }
        });

        // Formulaire de contact
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Interactions du cube de jeu
        if (this.gameCube) {
            this.gameCube.addEventListener('mouseenter', () => this.pauseCubeAnimation());
            this.gameCube.addEventListener('mouseleave', () => this.resumeCubeAnimation());
            this.gameCube.addEventListener('click', () => this.triggerCubeEffect());
        }

        // Gestion des touches
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Redimensionnement de fenêtre
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
    }

    setupIntersectionObserver() {
        // Configuration de l'Intersection Observer pour les animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.about-card, .project-card, .contact-item').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupPerformanceOptimizations() {
        // Optimisation des animations avec requestAnimationFrame
        this.animationFrameId = null;

        // Désactiver les animations sur les appareils lents
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--transition-fast', '0.1s');
            document.documentElement.style.setProperty('--transition-smooth', '0.2s');
        }

        // Preload des ressources critiques
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        // Preload des polices
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);
    }

    // Navigation
    toggleNav() {
        this.isNavOpen = !this.isNavOpen;
        this.navMenu.classList.toggle('active', this.isNavOpen);
        this.navToggle.classList.toggle('active', this.isNavOpen);

        // Empêcher le scroll du body quand le menu est ouvert
        document.body.style.overflow = this.isNavOpen ? 'hidden' : '';
    }

    closeNav() {
        this.isNavOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Ajustement pour la navbar fixe
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Gestion de la navbar
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Mise à jour des liens de navigation actifs
        this.updateActiveNavLink();

        // Animation des particules basée sur le scroll
        this.updateParticlesOnScroll(currentScrollY);

        this.lastScrollY = currentScrollY;
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    // Particules
    initParticles() {
        if (!this.particles) return;

        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(0, 255, 136, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        this.particles.appendChild(particle);
    }

    updateParticlesOnScroll(scrollY) {
        const particles = document.querySelectorAll('.particle');
        const speed = scrollY * 0.1;

        particles.forEach((particle, index) => {
            const delay = index * 0.1;
            particle.style.transform = `translateY(${speed + delay}px)`;
        });
    }

    // Cube de jeu
    initGameCube() {
        if (!this.gameCube) return;
    }

    pauseCubeAnimation() {
        // Plus d'animation 3D: rien à mettre en pause
    }

    resumeCubeAnimation() {
        // Plus d'animation 3D: rien à reprendre
    }

    triggerCubeEffect() {
        if (!this.gameCube) return;

        // Petit "pulse" au clic
        this.gameCube.classList.remove('cube-pulse');
        this.gameCube.offsetHeight; // Force reflow
        this.gameCube.classList.add('cube-pulse');

        setTimeout(() => {
            this.gameCube.classList.remove('cube-pulse');
        }, 500);
    }

    // Projets
    getProjectCardHTML(project, index, source) {
        return `
            <div class="project-card" data-aos="fade-up" data-project-index="${index}" data-project-source="${source}">
                <div class="project-image">
                    <img src="${project.image || 'projet1.png'}" alt="${project.title}" class="project-image-img" loading="lazy">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description ?? ''}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    ${(project.demo || project.github) ? `
                        <div class="project-links">
                            ${project.demo ? `
                                <a href="${project.demo}" class="project-link" target="_blank" rel="noopener">
                                    <span>download</span> →
                                </a>
                            ` : ''}
                            ${project.github ? `
                                <a href="${project.github}" class="project-link" target="_blank" rel="noopener">
                                    <span>Code</span> →
                                </a>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    bindProjectCardEvents(grid, source) {
        if (!grid) return;
        const list = source === 'dev' ? this.projectsInDev : this.projects;
        grid.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.handleProjectHover(card, true));
            card.addEventListener('mouseleave', () => this.handleProjectHover(card, false));
            card.addEventListener('click', (e) => {
                if (e.target.closest('.project-link')) return;
                const index = Number(card.dataset.projectIndex);
                const project = list[index];
                if (project && project.popupImage) {
                    this.openProjectModal(project);
                }
            });
        });
    }

    renderProjects() {
        if (this.projectsGrid) {
            this.projectsGrid.innerHTML = this.projects.map((project, index) =>
                this.getProjectCardHTML(project, index, 'done')
            ).join('');
            this.bindProjectCardEvents(this.projectsGrid, 'done');
        }

        if (this.projectsDevGrid) {
            this.projectsDevGrid.innerHTML = this.projectsInDev.map((project, index) =>
                this.getProjectCardHTML(project, index, 'dev')
            ).join('');
            this.bindProjectCardEvents(this.projectsDevGrid, 'dev');
        }
    }

    initProjectModal() {
        if (!this.projectModal) return;
        this.projectModal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', () => this.closeProjectModal());
        });
    }

    openProjectModal(project) {
        if (!this.projectModal || !this.projectModalBody) return;
        this.projectModalBody.innerHTML = `
            <img src="${project.popupImage}" alt="${project.title}" class="project-modal-image" id="project-modal-title">
        `;
        this.projectModal.classList.add('is-open');
        this.projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeProjectModal() {
        if (!this.projectModal) return;
        this.projectModal.classList.remove('is-open');
        this.projectModal.setAttribute('aria-hidden', 'true');
        if (!this.isNavOpen) {
            document.body.style.overflow = '';
        }
    }

    handleProjectHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }

    // Compteurs animés
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }



    // Formulaire de contact
    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);

        // Simulation d'envoi (remplacer par vraie logique)
        this.showNotification('Message envoyé avec succès !', 'success');
        this.contactForm.reset();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--accent-color)'};
            color: var(--bg-dark);
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform var(--transition-smooth);
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Gestion des touches
    handleKeydown(e) {
        // Échapper pour fermer le menu ou le popup
        if (e.key === 'Escape') {
            if (this.projectModal && this.projectModal.classList.contains('is-open')) {
                this.closeProjectModal();
                return;
            }
            if (this.isNavOpen) {
                this.closeNav();
            }
        }

        // Navigation au clavier
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.scrollToSection('home');
                    break;
                case '2':
                    e.preventDefault();
                    this.scrollToSection('about');
                    break;
                case '3':
                    e.preventDefault();
                    this.scrollToSection('projects');
                    break;
                case '4':
                    e.preventDefault();
                    this.scrollToSection('contact');
                    break;
            }
        }
    }

    // Gestion du redimensionnement
    handleResize() {
        // Recalculer les positions si nécessaire
        this.updateActiveNavLink();

        // Ajuster les particules si nécessaire
        if (window.innerWidth < 768) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.display = 'none';
            });
        } else {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.display = 'block';
            });
        }
    }
}

// Fonctions utilitaires globales
function scrollToSection(sectionId) {
    if (window.portfolioApp) {
        window.portfolioApp.scrollToSection(sectionId);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier la compatibilité du navigateur
    if (!window.IntersectionObserver || !window.requestAnimationFrame) {
        console.warn('Votre navigateur ne supporte pas toutes les fonctionnalités. Certaines animations peuvent ne pas fonctionner.');
    }

    // Initialiser l'application
    window.portfolioApp = new PortfolioApp();

    // Optimisations supplémentaires
    if ('serviceWorker' in navigator) {
        // Enregistrer un service worker pour le cache (optionnel)
        // navigator.serviceWorker.register('/sw.js');
    }

    // Analytics ou tracking (optionnel)
    // gtag('config', 'GA_MEASUREMENT_ID');
});

// Gestion des erreurs JavaScript
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    // Optionnel: envoyer l'erreur à un service de monitoring
});

// Optimisation des performances
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Tâches non critiques à exécuter quand le navigateur est inactif
        console.log('Portfolio chargé et optimisé !');
    });
} else {
    setTimeout(() => {
        console.log('Portfolio chargé et optimisé !');
    }, 100);
}
