/* ============================================================
   Car Deluxe — Script.js
   Shared JavaScript for all pages
   ============================================================ */

(function() {
    'use strict';

    /* 1. Mobile Navigation
       -------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            const isOpen = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close on link click
        mobileNav.querySelectorAll('.nav-link, .btn').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on overlay click (outside content)
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    /* 2. Sticky Header (shadow + background on scroll)
       -------------------------------------------------------- */
    const header = document.getElementById('header');

    if (header) {
        function updateHeader() {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    /* 3. Scroll Fade-In Animations (IntersectionObserver)
       -------------------------------------------------------- */
    var fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        var fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function(el) {
            fadeObserver.observe(el);
        });
    }

    /* 4. Stagger Children Animation
       -------------------------------------------------------- */
    var staggerGroups = document.querySelectorAll('.stagger-children');

    if (staggerGroups.length > 0 && 'IntersectionObserver' in window) {
        var staggerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var children = entry.target.children;
                    Array.prototype.forEach.call(children, function(child, i) {
                        child.style.transitionDelay = (i * 0.1) + 's';
                        child.classList.add('visible');
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        staggerGroups.forEach(function(el) {
            staggerObserver.observe(el);
        });
    }

    /* 5. Gallery Category Filter
       -------------------------------------------------------- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var filter = this.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Filter items
                galleryItems.forEach(function(item) {
                    if (filter === 'alle' || item.getAttribute('data-category') === filter) {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        item.style.display = '';
                        // Trigger reflow then animate in
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        });
                    } else {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(function() {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /* 6. Lightbox
       -------------------------------------------------------- */
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    var lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    var currentLightboxIndex = 0;
    var visibleGalleryImages = [];

    function getVisibleGalleryImages() {
        var items = document.querySelectorAll('.gallery-item');
        var visible = [];
        items.forEach(function(item) {
            if (item.style.display !== 'none') {
                var img = item.querySelector('img');
                if (img) {
                    visible.push({
                        src: img.src,
                        alt: item.getAttribute('data-caption') || img.alt
                    });
                }
            }
        });
        return visible;
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        visibleGalleryImages = getVisibleGalleryImages();
        if (index < 0 || index >= visibleGalleryImages.length) return;

        currentLightboxIndex = index;
        lightboxImg.src = visibleGalleryImages[index].src;
        lightboxImg.alt = visibleGalleryImages[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        if (lightboxImg) {
            lightboxImg.classList.remove('zoomed', 'dragging');
            lightboxImg.style.transform = '';
            lightboxImg.style.transformOrigin = '';
        }
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function navigateLightbox(direction) {
        var newIndex = currentLightboxIndex + direction;
        if (newIndex < 0) newIndex = visibleGalleryImages.length - 1;
        if (newIndex >= visibleGalleryImages.length) newIndex = 0;

        currentLightboxIndex = newIndex;
        if (lightboxImg) {
            lightboxImg.classList.remove('zoomed', 'dragging');
            lightboxImg.style.transform = '';
            lightboxImg.style.transformOrigin = '';
        }
        lightboxImg.style.opacity = '0';
        setTimeout(function() {
            lightboxImg.src = visibleGalleryImages[newIndex].src;
            lightboxImg.alt = visibleGalleryImages[newIndex].alt;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    // Gallery item click to open lightbox
    if (lightbox) {
        galleryItems.forEach(function(item, index) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                // Recalculate index based on visible items
                var visItems = getVisibleGalleryImages();
                var img = item.querySelector('img');
                if (!img) return;
                var imgSrc = img.src;
                var visIndex = 0;
                for (var i = 0; i < visItems.length; i++) {
                    if (visItems[i].src === imgSrc) {
                        visIndex = i;
                        break;
                    }
                }
                openLightbox(visIndex);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', function() { navigateLightbox(-1); });
        if (lightboxNext) lightboxNext.addEventListener('click', function() { navigateLightbox(1); });

        // Zoom + Pan on gallery lightbox image
        if (lightboxImg) {
            var galleryZoomScale = 2.5;
            var galleryPanX = 0;
            var galleryPanY = 0;
            var galleryIsDragging = false;
            var galleryDragStartX = 0;
            var galleryDragStartY = 0;
            var galleryDragStartPanX = 0;
            var galleryDragStartPanY = 0;
            var galleryHasMoved = false;

            function updateGalleryTransform() {
                if (lightboxImg.classList.contains('zoomed')) {
                    lightboxImg.style.transform = 'scale(' + galleryZoomScale + ') translate(' + galleryPanX + 'px, ' + galleryPanY + 'px)';
                } else {
                    lightboxImg.style.transform = '';
                }
            }

            function resetGalleryZoom() {
                lightboxImg.classList.remove('zoomed', 'dragging');
                galleryPanX = 0;
                galleryPanY = 0;
                galleryIsDragging = false;
                lightboxImg.style.transform = '';
            }

            lightboxImg.addEventListener('mousedown', function(e) {
                if (!lightboxImg.classList.contains('zoomed')) return;
                e.preventDefault();
                e.stopPropagation();
                galleryIsDragging = true;
                galleryHasMoved = false;
                galleryDragStartX = e.clientX;
                galleryDragStartY = e.clientY;
                galleryDragStartPanX = galleryPanX;
                galleryDragStartPanY = galleryPanY;
                lightboxImg.classList.add('dragging');
            });

            document.addEventListener('mousemove', function(e) {
                if (!galleryIsDragging) return;
                var dx = (e.clientX - galleryDragStartX) / galleryZoomScale;
                var dy = (e.clientY - galleryDragStartY) / galleryZoomScale;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) galleryHasMoved = true;
                galleryPanX = galleryDragStartPanX + dx;
                galleryPanY = galleryDragStartPanY + dy;
                updateGalleryTransform();
            });

            document.addEventListener('mouseup', function() {
                if (galleryIsDragging) {
                    galleryIsDragging = false;
                    lightboxImg.classList.remove('dragging');
                }
            });

            lightboxImg.addEventListener('click', function(e) {
                e.stopPropagation();
                if (galleryHasMoved) {
                    galleryHasMoved = false;
                    return;
                }
                if (lightboxImg.classList.contains('zoomed')) {
                    resetGalleryZoom();
                } else {
                    // Zoom in toward click position
                    var rect = lightboxImg.getBoundingClientRect();
                    var clickX = (e.clientX - rect.left) / rect.width;
                    var clickY = (e.clientY - rect.top) / rect.height;
                    lightboxImg.style.transformOrigin = (clickX * 100) + '% ' + (clickY * 100) + '%';
                    galleryPanX = 0;
                    galleryPanY = 0;
                    lightboxImg.classList.add('zoomed');
                    updateGalleryTransform();
                }
            });
        }

        // Close on background click (not on image)
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    /* 7. Smooth Scroll for Anchor Links (custom eased, luxury feel)
       -------------------------------------------------------- */
    function smoothScrollTo(targetY, duration) {
        var startY = window.pageYOffset;
        var diff = targetY - startY;
        var startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + diff * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                smoothScrollTo(top, 1200);
            }
        });
    });

    /* 8. Contact Form Handling
       -------------------------------------------------------- */
    var contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;

            // Visual feedback
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission (replace with actual backend when deployed)
            setTimeout(function() {
                submitBtn.textContent = 'Gesendet!';
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '#2d6a4f';

                // Reset form after delay
                setTimeout(function() {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 2500);
            }, 1200);
        });
    }

    /* 9. Stat Counter Animation
       -------------------------------------------------------- */
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function(el) {
            counterObserver.observe(el);
        });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.textContent.replace(/[0-9]/g, '').trim();
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + (suffix || '');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + (suffix || '');
            }
        }

        requestAnimationFrame(step);
    }

    /* 10. Subtle Hero Parallax
       -------------------------------------------------------- */
    var heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        /* Set initial scale so there's no jump on first scroll */
        heroBg.style.transform = 'translateY(0px) scale(1.1)';
        heroBg.style.willChange = 'transform';

        window.addEventListener('scroll', function() {
            var scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px) scale(1.1)';
            }
        }, { passive: true });
    }

    /* 11. 3D Tilt on Service Cards (desktop only)
       -------------------------------------------------------- */
    if (window.innerWidth > 1024) {
        var tiltCards = document.querySelectorAll('.service-card');

        tiltCards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -4;
                var rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(function() {
                    card.style.transition = '';
                }, 500);
            });
        });
    }

    /* 12. BA Lightbox (Vorher/Nachher zoom + pan)
       -------------------------------------------------------- */
    var baLightbox = document.getElementById('ba-lightbox');
    var baLightboxImg = document.getElementById('ba-lightbox-img');

    if (baLightbox && baLightboxImg) {
        var baItems = document.querySelectorAll('.ba-item');
        var baZoomScale = 2.5;
        var baPanX = 0;
        var baPanY = 0;
        var baIsDragging = false;
        var baDragStartX = 0;
        var baDragStartY = 0;
        var baDragStartPanX = 0;
        var baDragStartPanY = 0;
        var baHasMoved = false;

        function updateBaTransform() {
            if (baLightboxImg.classList.contains('zoomed')) {
                baLightboxImg.style.transform = 'scale(' + baZoomScale + ') translate(' + baPanX + 'px, ' + baPanY + 'px)';
            } else {
                baLightboxImg.style.transform = 'scale(1)';
            }
        }

        function resetBaZoom() {
            baLightboxImg.classList.remove('zoomed', 'dragging');
            baPanX = 0;
            baPanY = 0;
            baIsDragging = false;
            baLightboxImg.style.transform = 'scale(1)';
            baLightboxImg.style.transformOrigin = '';
        }

        baItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var img = item.querySelector('img');
                if (img) {
                    resetBaZoom();
                    baLightboxImg.src = img.src;
                    baLightboxImg.alt = img.alt;
                    baLightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeBaLightbox() {
            baLightbox.classList.remove('active');
            resetBaZoom();
            document.body.style.overflow = '';
        }

        // Drag to pan when zoomed
        baLightboxImg.addEventListener('mousedown', function(e) {
            if (!baLightboxImg.classList.contains('zoomed')) return;
            e.preventDefault();
            e.stopPropagation();
            baIsDragging = true;
            baHasMoved = false;
            baDragStartX = e.clientX;
            baDragStartY = e.clientY;
            baDragStartPanX = baPanX;
            baDragStartPanY = baPanY;
            baLightboxImg.classList.add('dragging');
        });

        document.addEventListener('mousemove', function(e) {
            if (!baIsDragging) return;
            var dx = (e.clientX - baDragStartX) / baZoomScale;
            var dy = (e.clientY - baDragStartY) / baZoomScale;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) baHasMoved = true;
            baPanX = baDragStartPanX + dx;
            baPanY = baDragStartPanY + dy;
            updateBaTransform();
        });

        document.addEventListener('mouseup', function() {
            if (baIsDragging) {
                baIsDragging = false;
                baLightboxImg.classList.remove('dragging');
            }
        });

        // Click to zoom in/out
        baLightboxImg.addEventListener('click', function(e) {
            e.stopPropagation();
            if (baHasMoved) {
                baHasMoved = false;
                return;
            }
            if (baLightboxImg.classList.contains('zoomed')) {
                resetBaZoom();
            } else {
                var rect = baLightboxImg.getBoundingClientRect();
                var clickX = (e.clientX - rect.left) / rect.width;
                var clickY = (e.clientY - rect.top) / rect.height;
                baLightboxImg.style.transformOrigin = (clickX * 100) + '% ' + (clickY * 100) + '%';
                baPanX = 0;
                baPanY = 0;
                baLightboxImg.classList.add('zoomed');
                updateBaTransform();
            }
        });

        // Close on background or close button click
        baLightbox.addEventListener('click', function(e) {
            if (e.target === baLightbox || e.target.classList.contains('ba-lightbox-close')) {
                closeBaLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && baLightbox.classList.contains('active')) {
                closeBaLightbox();
            }
        });
    }

    /* 13. Active Nav Link Highlight
       -------------------------------------------------------- */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav .nav-link, .mobile-nav-content .nav-link');

    navLinks.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

})();
