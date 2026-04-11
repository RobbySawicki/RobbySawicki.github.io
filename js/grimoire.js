/* ============================================
   GRIMOIRE PORTFOLIO — JS LOGIC
   3D book: approach → click cover → open spread
   ============================================ */

(function () {
    const container = document.getElementById('grimoire');
    const nav = document.getElementById('grimoire-nav');

    // Inline LinkedIn "in" glyph. Previously hotlinked from Wikimedia commons
    // (https://upload.wikimedia.org/...) which is not guaranteed available.
    const LINKEDIN_SVG =
        '<svg class="linkedin-glyph" viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="currentColor">' +
        '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>' +
        '</svg>';

    // Read a CSS custom property that holds a duration (e.g. "0.7s" or "700ms")
    // and return it as milliseconds. Falls back to 0 if unparseable.
    function cssDurationMs(name) {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (!v) return 0;
        if (v.endsWith('ms')) return parseFloat(v);
        if (v.endsWith('s'))  return parseFloat(v) * 1000;
        return parseFloat(v) || 0;
    }

    // Roman numeral converter — used for chapter numbers in the TOC.
    // Replaces a hardcoded array that had no headroom for new projects.
    function toRoman(n) {
        const pairs = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],
                       ['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
        let out = '';
        for (const [k, v] of pairs) { while (n >= v) { out += k; n -= v; } }
        return out;
    }

    // Derive initials from the owner's name — no more hardcoded "RS".
    function ownerInitials() {
        return (SITE_DATA.owner.name || '')
            .split(/\s+/).filter(Boolean)
            .map(w => w.charAt(0).toUpperCase()).join('');
    }

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
            '<div class="portrait-placeholder" aria-hidden="true">' + ownerInitials() + '</div>' +
            '<p class="intro-name">' + SITE_DATA.owner.name + '</p>' +
            '<a href="' + SITE_DATA.owner.linkedin + '" target="_blank" rel="noopener noreferrer" class="linkedin-badge">' +
            LINKEDIN_SVG +
            '<span>Connect on LinkedIn</span></a></div>';
    }

    // Media schema: project.media = { type, src, textStyle?, alt? }
    //   type: 'video' | 'image' | 'glyph'
    //   src:  YouTube videoId | image URL | emoji/text glyph
    function leftMedia(project) {
        const m = project.media || { type: 'glyph', src: '\u2726' };
        let media = '';
        if (m.type === 'video') {
            const alt = m.alt || ('Watch video for ' + project.title);
            media = '<div class="video-slot" data-video-id="' + m.src + '">' +
                '<img src="https://img.youtube.com/vi/' + m.src + '/hqdefault.jpg" alt="' + alt + '" loading="lazy">' +
                '<button type="button" class="video-play-btn" aria-label="Play video for ' + project.title + '">\u25B6</button></div>';
        } else if (m.type === 'image') {
            const alt = m.alt || project.title;
            media = '<div class="thumb-slot"><img src="' + m.src + '" alt="' + alt + '" loading="lazy"></div>';
        } else { // 'glyph'
            const cls = m.textStyle ? 'project-emoji text-style' : 'project-emoji';
            media = '<div class="' + cls + '" aria-hidden="true">' + m.src + '</div>';
        }
        return '<div class="left-inner">' + media + '</div>';
    }

    // --- Right-page builders ---

    function rightIntro() {
        return '<div class="right-inner">' +
            '<h2 class="page-heading">Invocation</h2>' +
            '<div class="ornament-divider" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
            '<p class="intro-text">' + SITE_DATA.intro + '</p>' +
            '</div>';
    }

    function rightToc() {
        // Chapter number is independent of spread index: inserting a new
        // front-matter spread no longer shifts every project's Roman numeral.
        let chapterNum = 1;
        let items = '<p class="toc-section-label">Chapters</p>';
        items += tocEntry('Introduction', chapterNum++, 0);
        items += tocEntry('About the Author', chapterNum++, 2);
        items += '<p class="toc-section-label">Projects</p>';
        SITE_DATA.projects.forEach((p, i) => {
            let title = p.title;
            if (p.campaign) title += ' ' + p.campaign;
            if (title.length > 38) title = title.substring(0, 36) + '\u2026';
            items += tocEntry(title, chapterNum++, i + 3);
        });
        return '<div class="right-inner">' +
            '<h2 class="page-heading">Table of Contents</h2>' +
            '<ul class="toc-list">' + items + '</ul></div>';
    }

    function tocEntry(title, chapterNum, spreadIdx) {
        return '<li><button type="button" class="toc-entry" data-goto="' + spreadIdx + '">' +
            '<span class="toc-chapter">' + toRoman(chapterNum) + '. ' + title + '</span>' +
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
            badge = '<div class="project-badge-row"><span class="project-badge ' + project.badge + '">' +
                (project.badge === 'pinned' ? 'Pinned' : 'Recent') + '</span></div>';
        }

        let campaign = project.campaign ? '<p class="project-campaign">' + project.campaign + '</p>' : '';

        let tags = '';
        if (project.tags && project.tags.length) {
            tags = '<div class="project-tags">' +
                project.tags.map(function(t, i) { return '<span class="tag ' + (i % 2 === 0 ? 'tag-green' : 'tag-purple') + '">' + t + '</span>'; }).join('') +
                '</div>';
        }

        // Unified CTA — collapses externalLink/instagramUrl into one optional { type, url, label }.
        let cta = '';
        if (project.cta && project.cta.url) {
            if (project.cta.type === 'external') {
                const label = project.cta.label || 'View Campaign';
                cta = '<a href="' + project.cta.url + '" target="_blank" rel="noopener" class="project-link">\u2197 ' + label + '</a>';
            } else if (project.cta.type === 'instagram') {
                const label = project.cta.label || 'View on Instagram';
                cta = '<div class="instagram-slot"><a href="' + project.cta.url + '" target="_blank" rel="noopener" class="instagram-link">' + label + '</a></div>';
            }
        }

        let role = project.role
            ? '<p class="project-role"><span class="role-label">My Role \u2014 </span>' + project.role + '</p>' : '';

        let awards = '';
        if (project.awards && project.awards.length) {
            awards = '<div class="ornament-divider" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
                '<h3 class="awards-heading">Awards &amp; Recognition</h3><ul class="awards-list">' +
                project.awards.map(function(a) { return '<li>' + a + '</li>'; }).join('') + '</ul>';
        }

        return '<div class="right-inner">' +
            badge +
            '<h2 class="page-heading">' + project.title + '</h2>' +
            campaign + tags + cta +
            '<p>' + project.description + '</p>' +
            role + awards + '</div>';
    }

    // ============ BUILD BOOK ============

    function buildBook() {
        container.innerHTML = '';

        const book = document.createElement('div');
        book.className = 'book';
        book.id = 'book';

        // --- Front Cover (two-faced: cover-front shows leather + title, cover-back
        //     shows the endpaper/bookplate during the hinge swing). ---
        const cover = document.createElement('button');
        cover.className = 'book-cover';
        cover.id = 'book-cover';
        cover.type = 'button';
        cover.setAttribute('aria-label',
            'Open ' + SITE_DATA.owner.name + '\u2019s Grimoire of Works');
        cover.innerHTML =
            '<div class="cover-face cover-front">' +
              '<div class="cover-content">' +
                '<div class="cover-ornament" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
                '<h1 class="cover-title">' + SITE_DATA.owner.name + '</h1>' +
                '<p class="cover-subtitle">The Grimoire of Works</p>' +
                '<div class="cover-sigil" aria-hidden="true"><span class="cover-sigil-letter">R</span></div>' +
                '<p class="cover-tagline">' + SITE_DATA.owner.title + '</p>' +
                '<div class="cover-ornament" aria-hidden="true">\u2726 \u2727 \u2726</div>' +
                '<p class="cover-hint" aria-hidden="true">Open the tome</p>' +
              '</div>' +
            '</div>' +
            '<div class="cover-face cover-back" aria-hidden="true">' +
              '<div class="bookplate">' +
                '<div class="bookplate-ornament">\u2726 \u2727 \u2726</div>' +
                '<div class="bookplate-label">Ex Libris</div>' +
                '<div class="bookplate-sigil">' + ownerInitials() + '</div>' +
                '<div class="bookplate-owner">' + SITE_DATA.owner.name + '</div>' +
                '<div class="bookplate-ornament">\u2726 \u2727 \u2726</div>' +
              '</div>' +
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

        // Durations come from CSS custom properties so tuning the animation
        // in CSS cannot silently drift from the JS choreography.
        var coverDurMs = cssDurationMs('--cover-duration') || 1200;

        // Step 1: Swing cover open (hinge animation / mobile fade)
        cover.classList.add('opened');

        // Step 2: Widen container + flatten perspective
        container.classList.add('open');
        book.classList.add('open');

        // Step 3: Mid-swing, hide the page-block / back-cover and reveal the spreads
        // beneath. No event for "halfway through a transition" exists — so we use a
        // single timer derived from the authoritative CSS duration.
        setTimeout(function() {
            var pb = document.querySelector('.page-block');
            var bc = document.querySelector('.back-cover');
            if (pb) pb.style.display = 'none';
            if (bc) bc.style.display = 'none';
            var sc = document.querySelector('.spreads-container');
            if (sc) {
                sc.style.display = 'block';
                // Next frame: add .revealed so opacity transitions from 0 to 1
                // and the spread dissolves in under the swinging cover instead
                // of snapping on.
                requestAnimationFrame(function() { sc.classList.add('revealed'); });
            }
        }, Math.round(coverDurMs * 0.42));

        // Step 4: When the cover finishes its transform transition, reveal nav and
        // move focus so keyboard users land on an interactive control.
        function onCoverOpened(e) {
            if (e.propertyName && e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
            cover.removeEventListener('transitionend', onCoverOpened);
            nav.classList.add('visible');
            var nextBtn = document.getElementById('nav-next');
            if (nextBtn) nextBtn.focus();
        }
        cover.addEventListener('transitionend', onCoverOpened);
        // Safety net: if transitionend never fires (rare — reduced-motion edge cases),
        // force the reveal shortly after the expected duration.
        setTimeout(function() {
            if (!nav.classList.contains('visible')) {
                cover.removeEventListener('transitionend', onCoverOpened);
                nav.classList.add('visible');
                var nextBtn = document.getElementById('nav-next');
                if (nextBtn) nextBtn.focus();
            }
        }, coverDurMs + 200);

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

        // Duration comes from CSS so JS can never drift past the keyframes.
        var flipDurMs = cssDurationMs('--flip-duration') || 700;
        var midpointMs = Math.round(flipDurMs / 2);

        flipOverlay.className = 'page-flip-overlay ' +
            (direction === 'forward' ? 'flipping-forward' : 'flipping-backward');

        // Midpoint swap: when the overlay passes 90° we swap the underlying content
        // so the second half of the flip reveals the target spread.
        setTimeout(function() {
            spreads[currentSpread].classList.remove('active');
            spreads[idx].classList.add('active');
            currentSpread = idx;
            updateIndicator();
        }, midpointMs);

        // Clean up when the keyframe animation finishes — no more hardcoded tail timer.
        function onFlipEnd() {
            flipOverlay.removeEventListener('animationend', onFlipEnd);
            flipOverlay.className = 'page-flip-overlay';
            isFlipping = false;
        }
        flipOverlay.addEventListener('animationend', onFlipEnd);
    }

    function nextSpread() { goToSpread(currentSpread + 1); }
    function prevSpread() { goToSpread(currentSpread - 1); }

    function updateIndicator() {
        var indicator = document.getElementById('page-indicator');
        var title = spreadTitles[currentSpread] || '';
        var folio = 'Folio ' + toRoman(currentSpread + 1) + ' \u00B7 ' + toRoman(totalSpreads);
        indicator.textContent = title ? (folio + ' \u2014 ' + title) : folio;
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
