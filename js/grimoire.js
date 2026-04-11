/* ============================================
   GRIMOIRE PORTFOLIO — JS LOGIC
   3D book: approach → click cover → open spread
   ============================================ */

(function () {
    const container = document.getElementById('grimoire');
    const nav = document.getElementById('grimoire-nav');
    const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X',
        'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII'];

    let currentSpread = 0;
    let totalSpreads = 0;
    let isFlipping = false;
    let bookIsOpen = false;
    let spreadTitles = [];
    let lastFocusBeforeModal = null;

    // ============ CONTENT BUILDERS ============

    // --- Left-page builders ---

    function leftDecorative(label, sigil) {
        return '<div class="left-decorative">' +
            '<div class="deco-sigil"><span class="deco-sigil-letter">' + (sigil || '\u2726') + '</span></div>' +
            '<p class="deco-label">' + label + '</p></div>';
    }

    function leftIntro() {
        return '<div class="left-inner">' +
            '<div class="portrait-placeholder">RS</div>' +
            '<p class="intro-name">' + SITE_DATA.owner.name + '</p>' +
            '<a href="' + SITE_DATA.owner.linkedin + '" target="_blank" rel="noopener noreferrer" class="linkedin-badge">' +
            '<img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn">' +
            'Connect on LinkedIn</a></div>';
    }

    function leftMedia(project) {
        let media = '';
        if (project.videoId) {
            media = '<div class="video-slot" data-video-id="' + project.videoId + '">' +
                '<img src="https://img.youtube.com/vi/' + project.videoId + '/hqdefault.jpg" alt="Watch video" loading="lazy">' +
                '<button class="video-play-btn" aria-label="Play video">\u25B6</button></div>';
        } else if (project.thumbnailUrl) {
            media = '<div class="thumb-slot"><img src="' + project.thumbnailUrl + '" alt="' + project.title + '" loading="lazy"></div>';
        } else if (project.emoji) {
            const cls = project.emojiStyle === 'text' ? 'project-emoji text-style' : 'project-emoji';
            media = '<div class="' + cls + '">' + project.emoji + '</div>';
        } else {
            media = '<div class="project-emoji">\u2726</div>';
        }
        return '<div class="left-inner">' + media + '</div>';
    }

    // --- Right-page builders ---

    function rightIntro() {
        return '<div class="right-inner">' +
            '<h2 class="page-heading">Welcome</h2>' +
            '<p class="intro-text">' + SITE_DATA.intro + '</p>' +
            '</div>';
    }

    function rightToc() {
        let items = '<p class="toc-section-label">Chapters</p>';
        items += tocEntry('Introduction', 1, 0);
        items += tocEntry('About the Author', 2, 2);
        items += '<p class="toc-section-label">Projects</p>';
        SITE_DATA.projects.forEach((p, i) => {
            let title = p.title;
            if (p.campaign) title += ' ' + p.campaign;
            if (title.length > 38) title = title.substring(0, 36) + '\u2026';
            items += tocEntry(title, i + 3, i + 3);
        });
        return '<div class="right-inner">' +
            '<h2 class="page-heading">Table of Contents</h2>' +
            '<ul class="toc-list">' + items + '</ul></div>';
    }

    function tocEntry(title, romanIdx, spreadIdx) {
        return '<li><button type="button" class="toc-entry" data-goto="' + spreadIdx + '">' +
            '<span class="toc-chapter">' + (romanNumerals[romanIdx - 1] || romanIdx) + '. ' + title + '</span>' +
            '<span class="toc-dots" aria-hidden="true"></span>' +
            '<span class="toc-page-num">' + (spreadIdx * 2 + 1) + '</span>' +
            '</button></li>';
    }

    function rightAbout() {
        const paras = SITE_DATA.about.map(function(p) { return '<p>' + p + '</p>'; }).join('');
        return '<div class="right-inner">' +
            '<h2 class="page-heading">About the Author</h2>' + paras + '</div>';
    }

    function rightProject(project) {
        let badge = '';
        if (project.badge) {
            badge = '<div style="text-align:center"><span class="project-badge ' + project.badge + '">' +
                (project.badge === 'pinned' ? '\uD83D\uDCCC Pinned' : '\uD83C\uDD95 Recent') + '</span></div>';
        }

        let campaign = project.campaign ? '<p class="project-campaign">' + project.campaign + '</p>' : '';

        let tags = '';
        if (project.tags && project.tags.length) {
            tags = '<div class="project-tags">' +
                project.tags.map(function(t, i) { return '<span class="tag ' + (i % 2 === 0 ? 'tag-green' : 'tag-purple') + '">' + t + '</span>'; }).join('') +
                '</div>';
        }

        let externalLink = project.externalLink
            ? '<a href="' + project.externalLink + '" target="_blank" rel="noopener" class="project-link">\u2197 View Campaign</a>' : '';

        let instagram = project.instagramUrl
            ? '<div class="instagram-slot"><a href="' + project.instagramUrl + '" target="_blank" rel="noopener" class="instagram-link">\uD83D\uDCF7 View on Instagram</a></div>' : '';

        let role = project.role
            ? '<p class="project-role"><span class="role-label">My Role \u2014 </span>' + project.role + '</p>' : '';

        let awards = '';
        if (project.awards && project.awards.length) {
            awards = '<h3 class="awards-heading">Awards & Recognition</h3><ul class="awards-list">' +
                project.awards.map(function(a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
        }

        return '<div class="right-inner">' +
            badge +
            '<h2 class="page-heading">' + project.title + '</h2>' +
            campaign + tags + externalLink + instagram +
            '<p>' + project.description + '</p>' +
            role + awards + '</div>';
    }

    // ============ BUILD BOOK ============

    function buildBook() {
        container.innerHTML = '';

        const book = document.createElement('div');
        book.className = 'book';
        book.id = 'book';

        // --- Front Cover (as a real button for keyboard + screen reader users) ---
        const cover = document.createElement('button');
        cover.className = 'book-cover';
        cover.id = 'book-cover';
        cover.type = 'button';
        cover.setAttribute('aria-label',
            'Open ' + SITE_DATA.owner.name + '\u2019s Grimoire of Works');
        cover.innerHTML =
            '<div class="cover-content">' +
            '<div class="cover-ornament" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
            '<h1 class="cover-title">' + SITE_DATA.owner.name + '</h1>' +
            '<p class="cover-subtitle">The Grimoire of Works</p>' +
            '<div class="cover-sigil" aria-hidden="true"><span class="cover-sigil-letter">R</span></div>' +
            '<p class="cover-tagline">' + SITE_DATA.owner.title + '</p>' +
            '<div class="cover-ornament" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
            '<p class="cover-hint" aria-hidden="true">Click to Open</p>' +
            '</div>';
        book.appendChild(cover);

        // --- Spreads Container ---
        const spreadsEl = document.createElement('div');
        spreadsEl.className = 'spreads-container';
        spreadsEl.id = 'spreads';

        // Build spread data: [ { left, right, title }, ... ]
        const spreadData = [
            { left: leftIntro(), right: rightIntro(), title: 'Welcome' },
            { left: leftDecorative('Contents', '\u2630'), right: rightToc(), title: 'Contents' },
            { left: leftDecorative('About', 'R'), right: rightAbout(), title: 'About the Author' }
        ];

        SITE_DATA.projects.forEach(function(project) {
            spreadData.push({
                left: leftMedia(project),
                right: rightProject(project),
                title: project.title
            });
        });

        totalSpreads = spreadData.length;
        spreadTitles = spreadData.map(function(s) { return s.title; });

        spreadData.forEach(function(s, i) {
            const spread = document.createElement('div');
            spread.className = 'spread' + (i === 0 ? ' active' : '');
            spread.setAttribute('data-spread', i);

            spread.innerHTML =
                '<div class="spread-left">' +
                '<span class="corner-tl">\u2726</span>' +
                '<span class="corner-bl">\u2726</span>' +
                s.left +
                '<span class="page-number">' + (i * 2) + '</span>' +
                '</div>' +
                '<div class="spread-right">' +
                '<span class="corner-tr">\u2726</span>' +
                '<span class="corner-br">\u2726</span>' +
                s.right +
                '<span class="page-number">' + (i * 2 + 1) + '</span>' +
                '</div>';

            spreadsEl.appendChild(spread);
        });

        // --- Page flip overlay (animated turning page) ---
        var flipOverlay = document.createElement('div');
        flipOverlay.className = 'page-flip-overlay';
        flipOverlay.id = 'flip-overlay';
        spreadsEl.appendChild(flipOverlay);

        book.appendChild(spreadsEl);

        // --- Page block (visible stack of pages beneath cover when closed) ---
        book.insertAdjacentHTML('beforeend',
            '<div class="page-block">' +
            '<div class="page-block-top"></div>' +
            '<div class="page-block-right"></div>' +
            '<div class="page-block-bottom"></div>' +
            '</div>');

        // --- Back cover (leather slab at the very bottom) ---
        book.insertAdjacentHTML('beforeend',
            '<div class="back-cover"></div>');

        // --- 3D structural elements ---
        book.insertAdjacentHTML('beforeend',
            '<div class="book-spine"></div>' +
            '<div class="book-top-edge"></div>' +
            '<div class="book-bottom-edge"></div>' +
            '<div class="book-right-edge"></div>' +
            '<div class="book-shadow"></div>'
        );

        container.appendChild(book);
    }

    // ============ OPEN BOOK ============

    function openBook() {
        if (bookIsOpen) return;
        bookIsOpen = true;

        var cover = document.getElementById('book-cover');
        var book = document.getElementById('book');

        // Step 1: Swing cover open (hinge animation)
        cover.classList.add('opened');

        // Step 2: Widen container + flatten perspective
        container.classList.add('open');
        book.classList.add('open');

        // Step 3: After cover halfway open, reveal spreads beneath
        setTimeout(function() {
            document.querySelector('.page-block').style.display = 'none';
            document.querySelector('.back-cover').style.display = 'none';
            var sc = document.querySelector('.spreads-container');
            sc.style.display = 'block';
        }, 500);

        // Step 4: Show navigation after everything settles, move focus to next-button
        setTimeout(function() {
            nav.classList.add('visible');
            var nextBtn = document.getElementById('nav-next');
            if (nextBtn) nextBtn.focus();
        }, 1200);

        updateIndicator();
    }

    // ============ SPREAD NAVIGATION WITH PAGE FLIP ============

    function goToSpread(idx) {
        if (isFlipping || idx < 0 || idx >= totalSpreads || idx === currentSpread) return;
        if (!bookIsOpen) return;

        isFlipping = true;
        var spreads = document.querySelectorAll('.spread');
        var flipOverlay = document.getElementById('flip-overlay');
        var direction = idx > currentSpread ? 'forward' : 'backward';

        if (direction === 'forward') {
            // Show flip overlay on top of current spread, animate it turning left
            flipOverlay.className = 'page-flip-overlay flipping-forward';

            // Halfway through the flip, swap the content
            setTimeout(function() {
                spreads[currentSpread].classList.remove('active');
                spreads[idx].classList.add('active');
                currentSpread = idx;
                updateIndicator();
            }, 350);

            // After flip finishes, hide overlay
            setTimeout(function() {
                flipOverlay.className = 'page-flip-overlay';
                isFlipping = false;
            }, 750);
        } else {
            // Flip backward: overlay starts turned left, swings back right
            flipOverlay.className = 'page-flip-overlay flipping-backward';

            // Swap content at midpoint
            setTimeout(function() {
                spreads[currentSpread].classList.remove('active');
                spreads[idx].classList.add('active');
                currentSpread = idx;
                updateIndicator();
            }, 350);

            // After flip finishes, hide overlay
            setTimeout(function() {
                flipOverlay.className = 'page-flip-overlay';
                isFlipping = false;
            }, 750);
        }
    }

    function nextSpread() { goToSpread(currentSpread + 1); }
    function prevSpread() { goToSpread(currentSpread - 1); }

    function updateIndicator() {
        var indicator = document.getElementById('page-indicator');
        var title = spreadTitles[currentSpread] || '';
        var label = 'Spread ' + (currentSpread + 1) + ' of ' + totalSpreads;
        indicator.textContent = title ? (label + ' \u2014 ' + title) : label;
    }

    // ============ NAVIGATION SETUP ============

    function setupNavigation() {
        document.getElementById('nav-prev').addEventListener('click', prevSpread);
        document.getElementById('nav-next').addEventListener('click', nextSpread);

        // Cover click
        document.addEventListener('click', function(e) {
            if (e.target.closest('#book-cover') && !bookIsOpen) {
                openBook();
            }
        });

        // Keyboard
        document.addEventListener('keydown', function(e) {
            var modal = document.getElementById('video-modal');
            if (modal && !modal.classList.contains('hidden')) return;

            if (!bookIsOpen) {
                if (e.key === 'Enter' || e.key === ' ') { openBook(); e.preventDefault(); }
                return;
            }

            switch (e.key) {
                case 'ArrowRight': case 'PageDown': e.preventDefault(); nextSpread(); break;
                case 'ArrowLeft': case 'PageUp': e.preventDefault(); prevSpread(); break;
                case 'Home': e.preventDefault(); goToSpread(0); break;
                case 'End': e.preventDefault(); goToSpread(totalSpreads - 1); break;
            }
        });

        // TOC links
        document.addEventListener('click', function(e) {
            var tocLink = e.target.closest('[data-goto]');
            if (tocLink) {
                e.preventDefault();
                goToSpread(parseInt(tocLink.getAttribute('data-goto'), 10));
            }
        });

        // Swipe
        setupSwipe();
    }

    // ============ SWIPE ============

    function setupSwipe() {
        var startX = 0;
        var tracking = false;

        container.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            tracking = true;
        }, { passive: true });

        container.addEventListener('touchend', function(e) {
            if (!tracking || !bookIsOpen) return;
            tracking = false;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) {
                if (dx < 0) nextSpread(); else prevSpread();
            }
        }, { passive: true });

        var mouseDown = false;
        container.addEventListener('mousedown', function(e) {
            if (e.target.closest('a, button')) return;
            startX = e.clientX;
            mouseDown = true;
        });

        document.addEventListener('mouseup', function(e) {
            if (!mouseDown || !bookIsOpen) return;
            mouseDown = false;
            var dx = e.clientX - startX;
            if (Math.abs(dx) > 60) {
                if (dx < 0) nextSpread(); else prevSpread();
            }
        });
    }

    // ============ VIDEO MODAL ============

    function setupVideoModal() {
        var modal = document.getElementById('video-modal');
        var iframe = document.getElementById('video-modal-iframe');
        var closeBtn = document.querySelector('.video-modal-close');

        function openModal(videoId) {
            lastFocusBeforeModal = document.activeElement;
            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
            modal.classList.remove('hidden');
            // Focus the close button so keyboard users land inside the dialog
            closeBtn.focus();
        }

        function closeModal() {
            iframe.src = '';
            modal.classList.add('hidden');
            // Restore focus to whatever opened the modal
            if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function') {
                lastFocusBeforeModal.focus();
            }
            lastFocusBeforeModal = null;
        }

        document.addEventListener('click', function(e) {
            var slot = e.target.closest('.video-slot');
            if (slot) {
                e.stopPropagation();
                openModal(slot.getAttribute('data-video-id'));
            }
        });

        closeBtn.addEventListener('click', closeModal);
        document.querySelector('.video-modal-backdrop').addEventListener('click', closeModal);

        // Focus trap: while modal is open, Tab always returns to the close button
        // (the modal has one interactive element, so this is a valid minimal trap).
        document.addEventListener('keydown', function(e) {
            if (modal.classList.contains('hidden')) return;
            if (e.key === 'Escape') { closeModal(); return; }
            if (e.key === 'Tab') {
                e.preventDefault();
                closeBtn.focus();
            }
        });
    }

    // ============ INIT ============

    document.addEventListener('DOMContentLoaded', function() {
        buildBook();
        setupNavigation();
        setupVideoModal();
    });
})();
