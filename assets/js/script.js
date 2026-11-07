// Panier
        let cart = [];

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            // Masquer le preloader
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }
            }, 1000);

            // Initialiser les composants
            initMobileMenu();
            initScrollAnimations();
            initBackToTop();
            initContactForm();
            initCart();
            initSearchAndFilters();
        }

        function initMobileMenu() {
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            const closeMobileMenu = document.getElementById('closeMobileMenu');

            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.remove('translate-x-full');
                });

                closeMobileMenu.addEventListener('click', () => {
                    mobileMenu.classList.add('translate-x-full');
                });

                document.querySelectorAll('#mobileMenu a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.add('translate-x-full');
                    });
                });
            }
        }

        function initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }

        function initBackToTop() {
            const backToTop = document.getElementById('backToTop');
            
            if (backToTop) {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.remove('opacity-0', 'invisible');
                        backToTop.classList.add('opacity-100', 'visible');
                    } else {
                        backToTop.classList.remove('opacity-100', 'visible');
                        backToTop.classList.add('opacity-0', 'invisible');
                    }
                });

                backToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }

        function initContactForm() {
            const contactForm = document.getElementById('contactForm');
            
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitButton.innerHTML;
                    
                    submitButton.innerHTML = 'Envoi en cours...';
                    submitButton.disabled = true;
                    
                    setTimeout(() => {
                        submitButton.innerHTML = 'Message Envoyé!';
                        submitButton.classList.remove('bg-primary');
                        submitButton.classList.add('bg-green-500');
                        
                        setTimeout(() => {
                            submitButton.innerHTML = originalText;
                            submitButton.disabled = false;
                            submitButton.classList.remove('bg-green-500');
                            submitButton.classList.add('bg-primary');
                            contactForm.reset();
                        }, 2000);
                    }, 1500);
                });
            }
        }

        function initCart() {
            const cartButton = document.getElementById('cartButton');
            const cartCount = document.getElementById('cartCount');

            function updateCartDisplay() {
                if (cartCount) {
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                    if (totalItems > 0) {
                        cartCount.textContent = totalItems;
                        cartCount.classList.remove('hidden');
                    } else {
                        cartCount.classList.add('hidden');
                    }
                }
            }

            window.addToCart = function(productId) {
                const product = getProductById(productId);
                if (product) {
                    const existingItem = cart.find(item => item.id === productId);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1
                        });
                    }
                    
                    updateCartDisplay();
                    
                    const button = document.querySelector(`[data-product-id="${productId}"]`);
                    if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = 'Ajouté!';
                        button.classList.remove('bg-primary');
                        button.classList.add('bg-green-500');
                        
                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.classList.remove('bg-green-500');
                            button.classList.add('bg-primary');
                        }, 1000);
                    }
                }
            };

            // Données des produits pour le panier
            function getProductById(productId) {
                const products = {
                    1: { id: 1, name: "Rapport PDF Premium : Analyse Match", price: "29,99€" },
                    2: { id: 2, name: "Pack d'Analyses Saisonnier", price: "199,99€" },
                    3: { id: 3, name: "Abonnement Mensuel Ultime", price: "24,99€/mois" }
                };
                return products[productId];
            }

            // Événements pour les boutons d'achat
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-product-id'));
                    addToCart(productId);
                });
            });

            if (cartButton) {
                cartButton.addEventListener('click', function() {
                    if (cart.length === 0) {
                        alert('Votre panier est vide');
                    } else {
                        alert(`Vous avez ${cart.reduce((sum, item) => sum + item.quantity, 0)} article(s) dans votre panier`);
                    }
                });
            }

            updateCartDisplay();
        }

        function initSearchAndFilters() {
            const searchInput = document.getElementById('searchInput');
            const loadMoreButton = document.getElementById('loadMore');

            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    filterArticles(searchTerm);
                });
            }

            if (loadMoreButton) {
                loadMoreButton.addEventListener('click', function() {
                    this.innerHTML = 'Chargement...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = 'Afficher Plus';
                        this.disabled = false;
                        alert('Plus d\'articles chargés!');
                    }, 1000);
                });
            }

            function filterArticles(searchTerm) {
                const articles = document.querySelectorAll('.article-card');
                articles.forEach(article => {
                    const title = article.querySelector('h3').textContent.toLowerCase();
                    const excerpt = article.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                        article.style.display = 'flex';
                    } else {
                        article.style.display = 'none';
                    }
                });
            }
        }

        // Scripts essentiels seulement
        document.addEventListener('DOMContentLoaded', function() {
            // Initialisation basique
            initMobileMenu();
            initScrollAnimations();
        });

        function initMobileMenu() {
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            const closeMobileMenu = document.getElementById('closeMobileMenu');

            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.remove('translate-x-full');
                });

                closeMobileMenu.addEventListener('click', () => {
                    mobileMenu.classList.add('translate-x-full');
                });
            }
        }

        // Carrousel Hero
        class HeroCarousel {    
            constructor() {
                this.slides = document.querySelectorAll('.carousel-slide');
                this.indicators = document.querySelectorAll('.carousel-indicator');
                this.prevBtn = document.querySelector('.carousel-prev');
                this.nextBtn = document.querySelector('.carousel-next');
                this.currentSlide = 0;
                this.interval = null;
                this.slideDuration = 5000; // 5 secondes entre chaque slide
                
                this.init();
            }
        
            init() {
                // Démarrer avec le premier slide
                this.showSlide(0);
        
                // Démarrer le défilement automatique
                this.startAutoPlay();
        
                // Événements
                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.resetAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });
        
        // Indicateurs
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showSlide(index);
                this.resetAutoPlay();
            });
        });
        
        // Pause au survol
        const carousel = document.getElementById('heroCarousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Pause quand la page n'est pas visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }

        showSlide(index) {
            // Masquer tous les slides
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            });
        
            // Désactiver tous les indicateurs
            this.indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
        
            // Afficher le slide actuel
            this.currentSlide = index;
            this.slides[index].classList.add('active');
            this.slides[index].style.opacity = '1';
            this.indicators[index].classList.add('active');
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }

        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex);
        }

        startAutoPlay() {
            this.stopAutoPlay(); // Arrêter l'intervalle existant
            this.interval = setInterval(() => {
                this.nextSlide();
            }, this.slideDuration);
        }

        stopAutoPlay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
        }

        // Initialiser le carrousel quand la page est chargée
        document.addEventListener('DOMContentLoaded', () => {
            new HeroCarousel();
        });

        
        // Initialisez EmailJS avec votre User ID
        (function() {
            emailjs.init("jvRx-x5VPnY9072V_"); // Remplacez par votre User ID d'EmailJS
        })();

        document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault();
    
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Envoi en cours...";
            submitBtn.disabled = true;
    
            // Récupérer les valeurs
            const nom = this.querySelector('input[name="nom"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const sujet = this.querySelector('input[name="sujet"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
    
            // Envoyer via EmailJS
            emailjs.send("service_43hrc49", "template_jfoqb3x", {
                from_name: nom,
                from_email: email,
                subject: sujet,
                message: message,
                to_email: "analystguide.f@gmail.com"
           })
           .then(function(response) {
               showMessage("✅ Message envoyé avec succès !", "success");
               document.getElementById('contactForm').reset();
           }, function(error) {
                showMessage("❌ Une erreur est survenue. Veuillez réessayer.", "error");
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });

        function showMessage(text, type) {
            const messageDiv = document.getElementById('formMessage');
            messageDiv.textContent = text;
            messageDiv.className = type === 'success' ? 
                'mt-4 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'mt-4 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            messageDiv.classList.remove('hidden');
    
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }