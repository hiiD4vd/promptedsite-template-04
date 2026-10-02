gsap.registerPlugin(ScrollTrigger,SplitText);


  window.REQUIRED_CODE_ERROR_MESSAGE = 'Veuillez choisir un code pays';
  window.LOCALE = 'fr';
  window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = 'Les informations que vous avez fournies ne sont pas valides. Veuillez vérifier le format du champ et réessayer.';

  window.REQUIRED_ERROR_MESSAGE = 'Vous devez renseigner ce champ. ';

  window.GENERIC_INVALID_MESSAGE = 'Les informations que vous avez fournies ne sont pas valides. Veuillez vérifier le format du champ et réessayer.';

  window.translation = {
    common: {
      selectedList: '{quantity} liste sélectionnée',
      selectedLists: '{quantity} listes sélectionnées',
      selectedOption: '{quantity} sélectionné',
      selectedOptions: '{quantity} sélectionnés',
    },
  };

  var AUTOHIDE = Boolean(0);



  (function () {
    var loaded = false;
    var SITEKEY = '6LdZ5AItAAAAAJWqGB18hm6iVFIjtftN1adjVFym';

    function loadRecaptcha() {
      if (loaded) return;
      loaded = true;
      var s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js?render=' + SITEKEY + '&hl=fr';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }

    var emailInput = document.getElementById('EMAIL');
    if (emailInput) {
      // charge reCAPTCHA au premier focus / survol du champ email
      emailInput.addEventListener('focus', loadRecaptcha, { once: true });
      emailInput.addEventListener('pointerenter', loadRecaptcha, { once: true });
    }
  })();



  document.addEventListener('DOMContentLoaded', () => {
    // #region Helpers

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // Debounce util (mutualisé pour colors / video)
    const debounce = (fn, ms = 150) => {
      let t = null;
      return (...args) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          fn(...args);
          t = null;
        }, ms);
      };
    };

    // Breakpoints

    const bp = {
      mobile: window.matchMedia('(max-width: 991px)'),
      desktop: window.matchMedia('(min-width: 992px)'),
    };

    const isMobile = () => bp.mobile.matches;
    const isDesktop = () => bp.desktop.matches;

    // SplitText

    const createLinesMask = (el, options = {}) => {
      const { stagger = 0.08, duration = 0.7, ease = 'power3.out' } = options;

      const split = new SplitText(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
      });
      const targets = split.lines;

      gsap.set(targets, { yPercent: 110 });

      return {
        in: ({ delay = 0 } = {}) =>
          gsap.to(targets, {
            yPercent: 0,
            duration,
            ease,
            stagger,
            delay,
            overwrite: true,
          }),
        out: ({ delay = 0 } = {}) =>
          gsap.to(targets, {
            yPercent: -110,
            duration,
            ease,
            stagger,
            delay,
            overwrite: true,
          }),
        revert: () => split.revert(),
      };
    };

    const createCharsMask = (el, options = {}) => {
      const { stagger = 0.01, duration = 0.6, ease = 'power3.out' } = options;

      const split = new SplitText(el, {
        type: 'lines,chars',
        mask: 'lines',
        linesClass: 'line',
      });
      const targets = split.chars;

      gsap.set(targets, { yPercent: 110 });

      return {
        in: ({ delay = 0 } = {}) =>
          gsap.to(targets, {
            yPercent: 0,
            duration,
            ease,
            stagger,
            delay,
            overwrite: true,
          }),
        out: ({ delay = 0 } = {}) =>
          gsap.to(targets, {
            yPercent: -110,
            duration,
            ease,
            stagger,
            delay,
            overwrite: true,
          }),
        revert: () => split.revert(),
      };
    };

    const initAnimations = (parent = document, excludeSelector = '') => {
      const all = $$('[data-anim]', parent);
      const els = excludeSelector ? [...all].filter((el) => !el.closest(excludeSelector)) : [...all];
      if (!els.length) return null;

      const instances = [];

      els.forEach((el) => {
        const type = el.dataset.anim;
        const stagger = parseFloat(el.dataset.animStagger) || undefined;
        const duration = parseFloat(el.dataset.animDuration) || undefined;
        const ease = el.dataset.animEase || undefined;

        const opts = { stagger, duration, ease };
        let anim = null;

        if (type === 'lines-mask') {
          anim = createLinesMask(el, opts);
        }

        if (type === 'chars-mask') {
          anim = createCharsMask(el, opts);
        }

        if (anim) instances.push(anim);
      });

      if (!instances.length) return null;

      return {
        in: (opts) => instances.forEach((a) => a.in(opts)),
        out: (opts) => instances.forEach((a) => a.out(opts)),
        revert: () => instances.forEach((a) => a.revert()),
      };
    };

    // #region Loader

    const initLoader = () => {
      const loaderWrapper = $('.loader');
      const loaderPercent = $('.loader_percent');
      const loaderVideo = $('.loader_video');
      const gammeContainer = $('.gamme_container');
      const navbar = $('.navbar');
      const hud = $('.hud');
      const hudLeft = $('.hud_left');
      const hudRight = $('.hud_right');
      const canvas = $('canvas');

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      window.scrollTo(0, 0);
      window.lenis?.scrollTo(0, { immediate: true });

      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        window.lenis?.scrollTo(0, { immediate: true });
      });

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        window.lenis?.scrollTo(0, { immediate: true });
      });

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();

      const hideTargets = [gammeContainer, navbar, hud, canvas].filter(Boolean);
      hideTargets.forEach((el) => gsap.set(el, { autoAlpha: 0 }));
      gsap.set(document.body, { '--loader-reveal': '100vh' });

      let sceneReady = false;
      let videoEnded = false;
      let entered = false;

      const percentObj = { value: 0 };
      const updatePercent = () => {
        if (loaderPercent) loaderPercent.textContent = `${Math.round(percentObj.value)}%`;
      };
      updatePercent();

      const enterScene = async () => {
        if (entered || !videoEnded || !sceneReady) return;
        entered = true;

        gsap.killTweensOf(percentObj);
        gsap.to(percentObj, {
          value: 100,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: updatePercent,
        });
        gsap.to(loaderPercent, { autoAlpha: 0, duration: 0.4, ease: 'power2.in', delay: 0.3 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          delay: 0.5,
          onComplete: () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            window.lenis?.start();

            if (window.ScrollTrigger) ScrollTrigger.refresh();
          },
        });

        if (hud) tl.set(hud, { autoAlpha: 1 }, 0);

        tl.to(
          loaderWrapper,
          {
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => gsap.set(loaderWrapper, { display: 'none' }),
          },
          0,
        )
          .to(canvas, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0)
          .to(document.body, { '--loader-reveal': '0vh', duration: 1, ease: 'power2.out' }, 0.2)
          .fromTo(navbar, { autoAlpha: 0, yPercent: -120 }, { autoAlpha: 1, yPercent: 0, duration: 0.9 }, 0.3)
          .fromTo(hudLeft, { autoAlpha: 0, x: '-10rem' }, { autoAlpha: 1, x: '0rem', duration: 0.9 }, 0.4)
          .fromTo(hudRight, { autoAlpha: 0, x: '10rem' }, { autoAlpha: 1, x: '0rem', duration: 0.9 }, 0.4)
          .fromTo(gammeContainer, { autoAlpha: 0 }, { autoAlpha: 1, yPercent: 0, duration: 1 }, 0.5);

        if (typeof window.loader?.play === 'function') {
          await window.loader.play();
        }
      };

      const onSceneReady = () => {
        if (sceneReady) return;
        sceneReady = true;
        enterScene();
      };
      window.addEventListener('carousel:ready', onSceneReady);
      if (window.carousel && window.__sceneReady) {
        onSceneReady();
      }

      const startFakePercent = () => {
        gsap.to(percentObj, {
          value: 90,
          duration: 8,
          ease: 'power1.out',
          onUpdate: updatePercent,
        });
      };

      if (loaderVideo) {
        loaderVideo.muted = true;
        loaderVideo.playsInline = true;
        loaderVideo.loop = false;

        let videoStarted = false;
        const videoTimeout = setTimeout(() => {
          if (!videoStarted && !videoEnded) {
            videoEnded = true;
            startFakePercent();
            enterScene();
          }
        }, 3000);

        loaderVideo.addEventListener('playing', () => {
          videoStarted = true;
          clearTimeout(videoTimeout);
        });

        const onTimeUpdate = () => {
          const d = loaderVideo.duration;
          if (!d || !isFinite(d)) return;
          const target = Math.min((loaderVideo.currentTime / d) * 99, 99);
          if (target > percentObj.value) {
            percentObj.value = target;
            updatePercent();
          }
        };

        const onEnded = () => {
          videoEnded = true;
          percentObj.value = Math.max(percentObj.value, 99);
          updatePercent();
          enterScene();
        };

        loaderVideo.addEventListener('timeupdate', onTimeUpdate);
        loaderVideo.addEventListener('ended', onEnded);

        loaderVideo.addEventListener('error', () => {
          clearTimeout(videoTimeout);
          videoEnded = true;
          startFakePercent();
          enterScene();
        });

        const playPromise = loaderVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            clearTimeout(videoTimeout);
            videoEnded = true;
            startFakePercent();
            enterScene();
          });
        }
      } else {
        videoEnded = true;
        startFakePercent();
      }
    };

    // #region Navbar

    // Sound Button

    const initSoundToggle = () => {
      const sound = $('.navbar_sound');
      if (!sound) return;

      const label = $('div:first-child', sound);
      const bars = $$('svg rect', sound);
      let isMuted = false;
      let playing = false;

      const animateBar = (bar) => {
        if (!playing) return;
        const h = gsap.utils.random(2, 8, 0.1);
        gsap.to(bar, {
          attr: { height: h, y: (8 - h) / 2 },
          duration: gsap.utils.random(0.2, 0.5),
          ease: 'power1.inOut',
          onComplete: () => animateBar(bar),
        });
      };

      const start = () => {
        playing = true;
        bars.forEach(animateBar);
      };

      const stop = () => {
        playing = false;
        gsap.killTweensOf(bars);
        gsap.to(bars, {
          attr: { height: 2, y: 3 },
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      sound.addEventListener('click', () => {
        isMuted = !isMuted;
        sound.classList.toggle('is-muted', isMuted);
        label.textContent = isMuted ? 'OFF' : 'ON';
        isMuted ? stop() : start();
      });

      start();
    };

    // Scroll Button

    const initScrollIcon = () => {
      const wrappers = $$('.icon-scroll_wrapper');
      if (!wrappers.length) return;

      wrappers.forEach((wrapper) => {
        const arrows = $$('svg > g', wrapper);
        if (arrows.length !== 3) return;

        const [first, middle, last] = arrows;

        gsap.set([first, middle, last], { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
        gsap.set(first, { y: 100 });
        gsap.set(last, { y: -100 });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

        tl.to(first, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }).to(middle, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4').to(last, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4').to(
          [first, middle, last],
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            stagger: 0.25,
          },
          '+=0.3',
        );
      });
    };

    // Menu Button

    const initMenuButton = () => {
      if (!isDesktop()) return;

      const button = $('.navbar_menu-button');
      if (!button) return;

      const circles = $$('svg circle', button);
      if (!circles.length) return;

      gsap.set(circles, { transformOrigin: '50% 50%' });

      let tl = null;

      button.addEventListener('mouseenter', () => {
        if (tl) tl.kill();
        gsap.set(circles, { scale: 1 });

        tl = gsap.timeline({ repeat: -1 });
        tl.to(circles, {
          scale: 0.5,
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: { each: 0.1, from: 'start' },
        }).to(circles, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.inOut',
          stagger: { each: 0.1, from: 'start' },
        });
      });

      button.addEventListener('mouseleave', () => {
        if (tl) tl.kill();
        tl = null;
        gsap.to(circles, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    };

    // Arrow Button

    const initCarouselArrowsHover = () => {
      if (!isDesktop()) return;

      const arrows = $$('.carousel_arrow');
      if (!arrows.length) return;

      arrows.forEach((arrow) => {
        const shapes = $$('svg path, svg rect', arrow);
        if (!shapes.length) return;

        gsap.set(shapes, { transformOrigin: '50% 50%' });

        let tl = null;

        arrow.addEventListener('mouseenter', () => {
          if (tl) tl.kill();
          gsap.set(shapes, { scale: 1 });

          tl = gsap.timeline({ repeat: -1 });
          tl.to(shapes, {
            scale: 0.5,
            duration: 0.4,
            ease: 'power2.inOut',
            stagger: { each: 0.08, from: 'start' },
          }).to(shapes, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut',
            stagger: { each: 0.08, from: 'start' },
          });
        });

        arrow.addEventListener('mouseleave', () => {
          if (tl) tl.kill();
          tl = null;
          gsap.to(shapes, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true,
          });
        });
      });
    };

    // Menu Open/close

    const initMenuToggle = () => {
      const button = $('.navbar_menu-button');
      const menu = $('.navbar_menu');
      if (!button || !menu) return;

      const links = $$('.navbar_link', menu);
      if (!links.length) return;

      const middle = $('.navbar_middle', menu);
      const bottom = $('.navbar_bottom', menu);
      const mobileExtras = [middle, bottom].filter(Boolean);

      const linkReveals = [...links].map((link) => createLinesMask(link, { duration: 0.6, stagger: 0.05 }));

      let isOpen = false;
      let animating = false;

      const getOpenHeight = () => (isMobile() ? '100svh' : 'auto');

      gsap.set(menu, { height: 0, opacity: 0, display: 'none', overflow: 'hidden' });
      gsap.set(mobileExtras, { autoAlpha: 0, y: 30 });

      const open = () => {
        if (animating || isOpen) return;
        animating = true;
        isOpen = true;
        button.classList.add('is-open');

        const mobile = isMobile();
        const menuDuration = mobile ? 0.8 : 0.6;
        const linkStagger = mobile ? 0.1 : 0.06;
        const linkDelay = mobile ? 0.45 : 0.3;

        gsap.set(menu, { display: 'flex' });

        gsap.to(menu, {
          height: getOpenHeight(),
          opacity: 1,
          duration: menuDuration,
          ease: 'power3.inOut',
          onComplete: () => {
            animating = false;
          },
        });

        linkReveals.forEach((reveal, i) => {
          reveal.in({ delay: linkDelay + i * linkStagger });
        });

        if (mobile) {
          const extrasDelay = linkDelay + links.length * linkStagger + 0.15;
          gsap.to(mobileExtras, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            delay: extrasDelay,
          });
        }
      };

      const close = () => {
        if (animating || !isOpen) return;
        animating = true;
        isOpen = false;
        button.classList.remove('is-open');

        const mobile = isMobile();
        const menuDuration = mobile ? 0.7 : 0.5;
        const closeDelay = mobile ? 0.45 : 0.3;

        if (mobile) {
          gsap.to(mobileExtras, {
            autoAlpha: 0,
            y: 30,
            duration: 0.4,
            ease: 'power2.in',
            stagger: 0.08,
          });
        }

        linkReveals.forEach((reveal, i) => {
          reveal.out({ delay: i * 0.05 });
        });

        gsap.to(menu, {
          height: 0,
          opacity: 0,
          duration: menuDuration,
          ease: 'power3.inOut',
          delay: closeDelay,
          onComplete: () => {
            gsap.set(menu, { display: 'none' });
            gsap.set(mobileExtras, { autoAlpha: 0, y: 30 });
            animating = false;
          },
        });
      };

      button.addEventListener('click', () => {
        isOpen ? close() : open();
      });

      links.forEach((link) => {
        link.addEventListener('click', () => {
          if (isMobile()) close();
        });
      });

      document.addEventListener('click', (e) => {
        if (!isOpen || isMobile()) return;
        if (menu.contains(e.target) || button.contains(e.target)) return;
        close();
      });

      bp.mobile.addEventListener('change', () => {
        if (!isOpen) return;
        gsap.set(menu, { height: getOpenHeight() });
        if (isMobile()) gsap.set(mobileExtras, { autoAlpha: 1, y: 0 });
      });
    };

    // #region Carousel

    // Carousel Text

    const initCarouselText = () => {
      const slides = $$('.carousel_slide');
      const descs = $$('.carousel_desc');
      const titles = $$('.carousel_title-b');
      if (!slides.length || !window.carousel) return null;

      const createMultiReveal = (container, selector, factory) => {
        const els = $$(selector, container);
        if (!els.length) return null;

        const instances = [...els].map((el) => factory(el));

        return {
          in: (opts) => instances.forEach((a) => a.in(opts)),
          out: (opts) => instances.forEach((a) => a.out(opts)),
        };
      };

      const descReveals = [...descs].map((desc) => {
        const lines = createMultiReveal(desc, '[data-anim="lines-mask"]', (el) => createLinesMask(el));
        const chars = createMultiReveal(desc, '[data-anim="chars-mask"]', (el) => createCharsMask(el));
        return {
          in: (opts) => {
            lines?.in(opts);
            chars?.in(opts);
          },
          out: (opts) => {
            lines?.out(opts);
            chars?.out(opts);
          },
        };
      });

      const titleReveals = [...titles].map((title) => createMultiReveal(title, '[data-anim="chars-mask"]', (el) => createCharsMask(el)));
      const slideReveals = [...slides].map((slide) => createMultiReveal(slide, '[data-anim="chars-mask"]', (el) => createCharsMask(el)));

      const fade = (els, activeIndex) => {
        els.forEach((el, i) => {
          gsap.to(el, {
            autoAlpha: i === activeIndex ? 1 : 0,
            duration: 0.5,
            ease: 'power2.inOut',
            overwrite: true,
          });
        });
      };

      slides.forEach((el, i) => gsap.set(el, { autoAlpha: i === window.carousel.index ? 1 : 0 }));
      descs.forEach((el, i) => gsap.set(el, { autoAlpha: i === window.carousel.index ? 1 : 0 }));
      titles.forEach((el, i) => gsap.set(el, { autoAlpha: i === window.carousel.index ? 1 : 0 }));

      window.carousel.changed.connect(({ index, previous }) => {
        fade(slides, index);
        fade(descs, index);
        fade(titles, index);

        descReveals[previous]?.out();
        descReveals[index]?.in({ delay: 0.3 });

        titleReveals[previous]?.out();
        titleReveals[index]?.in({ delay: 0.3 });

        slideReveals[previous]?.out();
        slideReveals[index]?.in({ delay: 0.3 });
      });

      slideReveals[window.carousel.index]?.in({ delay: 0.3 });

      return {
        inActive: (opts) => {
          descReveals[window.carousel.index]?.in(opts);
          titleReveals[window.carousel.index]?.in(opts);
        },
        outActive: (opts) => {
          descReveals[window.carousel.index]?.out(opts);
          titleReveals[window.carousel.index]?.out(opts);
        },
      };
    };

    // Carousel Nav

    const initCarouselNav = () => {
      const prev = $('.carousel_arrow.is-prev');
      const next = $('.carousel_arrow.is-next');
      if (!window.carousel) return;

      prev?.addEventListener('click', () => window.carousel.previous());
      next?.addEventListener('click', () => window.carousel.next());
    };

    const initCarouselPagination = () => {
      const container = $('.carousel_pagination');
      if (!container || !window.carousel) return;

      const svg = $('svg', container);
      const dot = $('.carousel_pagination-dot', container);
      const slides = $$('.carousel_slide');
      const count = slides.length;
      if (!count) return;

      const viewBoxWidth = 1000;
      const padding = 20;
      const usable = viewBoxWidth - padding * 2;

      const indexToX = (i) => padding + (usable / Math.max(count - 1, 1)) * i;
      const xToIndex = (x) => Math.round(((x - padding) / usable) * (count - 1));

      gsap.set(dot, {
        attr: { cx: indexToX(window.carousel.index) },
        transformBox: 'fill-box',
        transformOrigin: '50% 50%',
        x: 0,
      });

      let dotTl = null;

      window.carousel.changed.connect(({ index, previous }) => {
        const delta = index - previous;
        const isWrap = Math.abs(delta) > count / 2;

        if (dotTl) dotTl.kill();
        gsap.killTweensOf(dot);

        if (isWrap) {
          const exitRight = previous > index;
          const slide = 150;
          const exitX = exitRight ? slide : -slide;
          const enterX = exitRight ? -slide : slide;

          dotTl = gsap.timeline();
          dotTl
            .to(dot, { x: exitX, scale: 0, duration: 0.3, ease: 'power2.in' })
            .set(dot, { attr: { cx: indexToX(index) }, x: enterX })
            .to(dot, { x: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
        } else {
          dotTl = gsap.timeline();
          dotTl.to(dot, { attr: { cx: indexToX(index) }, scale: 1, x: 0, duration: 0.6, ease: 'power3.out' });
        }
      });

      const getXFromEvent = (e) => {
        const rect = svg.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const ratio = (clientX - rect.left) / rect.width;
        return clamp(ratio * viewBoxWidth, padding, viewBoxWidth - padding);
      };

      let dragging = false;

      const updateFromPointer = (e) => {
        const x = getXFromEvent(e);
        const targetIndex = clamp(xToIndex(x), 0, count - 1);
        if (targetIndex !== window.carousel.index) {
          window.carousel.goTo(targetIndex);
        }
      };

      container.addEventListener('pointerdown', (e) => {
        dragging = true;
        container.setPointerCapture(e.pointerId);
        updateFromPointer(e);
      });

      container.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        updateFromPointer(e);
      });

      container.addEventListener('pointerup', () => {
        dragging = false;
      });

      container.addEventListener('pointercancel', () => {
        dragging = false;
      });
    };

    // Carousel Gradient Angulaire

    const initRangeGradient = () => {
      const gradient = $('.gamme_gradient');
      if (!gradient || !window.carousel) return;

      const slides = $$('.carousel_slide');
      if (!slides.length) return;

      const step = 360 / slides.length;
      let current = 0;

      gsap.set(gradient, { rotation: 0 });

      window.carousel.changed.connect(({ index, previous }) => {
        let delta = index - previous;
        if (delta > slides.length / 2) delta -= slides.length;
        if (delta < -slides.length / 2) delta += slides.length;

        current -= delta * step;

        gsap.to(gradient, {
          rotation: current,
          duration: 0.8,
          ease: 'power2.inOut',
          overwrite: true,
        });
      });
    };

    // Carousel Color

    const initCarouselColors = () => {
      const slides = $$('.carousel_slide');
      if (!slides.length || !window.carousel) return;

      const root = document.documentElement;

      const applyColors = (slide) => {
        const primary = slide.dataset.tastePrimary;
        const secondary = slide.dataset.tasteSecondary;
        if (primary) root.style.setProperty('--color-scheme-1--taste-primary', primary);
        if (secondary) root.style.setProperty('--color-scheme-1--taste-secondary', secondary);
      };

      applyColors(slides[window.carousel.index]);

      const apply = debounce((index) => applyColors(slides[index]), 150);
      window.carousel.changed.connect(({ index }) => apply(index));
    };

    // Carousel Video

    const initCarouselVideo = () => {
      const section = $('.section.is-argument');
      if (!section || !window.carousel) return;

      const items = [...$$('.argument_video', section)].map((wrapper) => ({ wrapper, video: $('video', wrapper) })).filter((it) => it.video);
      if (!items.length) return;

      let inView = false;

      const activate = (video) => {
        video.setAttribute('autoplay', '');
        if (video.readyState === 0) video.load();

        const tryPlay = () => video.play().catch(() => {});
        if (video.readyState >= 2) tryPlay();
        else video.addEventListener('canplay', tryPlay, { once: true });
      };

      const deactivate = (video) => {
        video.removeAttribute('autoplay');
        video.pause();
      };

      const goTo = (i) => {
        items.forEach(({ wrapper, video }, idx) => {
          if (idx === i) {
            if (inView) activate(video);
            gsap.to(wrapper, { autoAlpha: 1, duration: 0.6, ease: 'power2.inOut', overwrite: true });
          } else {
            gsap.to(wrapper, {
              autoAlpha: 0,
              duration: 0.6,
              ease: 'power2.inOut',
              overwrite: true,
              onComplete: () => deactivate(video),
            });
          }
        });
      };

      items.forEach(({ wrapper }) => gsap.set(wrapper, { autoAlpha: 0 }));

      const apply = debounce((index) => {
        if (inView) goTo(index);
      }, 150);
      window.carousel.changed.connect(({ index }) => apply(index));

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: ({ isActive }) => {
          inView = isActive;
          if (isActive) goTo(window.carousel.index);
          else items.forEach(({ video }) => deactivate(video));
        },
      });
    };

    // #region Sections

    // Section Range

    const initSectionRange = () => {
      const section = $('.section.is-gamme');
      if (!section) return;

      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to('.carousel_pagination, .icon-scroll_wrapper, .carousel_arrow.is-prev, .scroll_discover, .gamme_gradient-wrapper', { autoAlpha: 0 });

      if (isDesktop()) {
        tl.to('.carousel_title-collection', { autoAlpha: 0 }, '<');
        tl.to('.carousel_nav', { maxWidth: '55%' }, '<');
      }

      if (isMobile()) {
        tl.to('.carousel_arrow.is-next', { autoAlpha: 0 }, '<');
        tl.to('.carousel_title-collection', { y: '-2.5rem' }, '<');
      }
    };

    // Section Profile

    const initSectionProfile = () => {
      const section = $('.section.is-profile');
      if (!section) return;

      const container = $('.profile_container', section);
      if (!container) return;

      const gammeContainer = $('.gamme_container');
      const reveal = initAnimations(section, '.carousel_desc, .carousel_title-b');

      gsap
        .timeline({
          defaults: { duration: 0.5, ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom bottom',
            toggleActions: 'play reverse play reverse',
            onEnter: () => {
              document.body.classList.add('is-profile-active');
              reveal?.in({ delay: 0 });
              window.carouselText?.inActive({ delay: 0 });
            },
            onEnterBack: () => {
              reveal?.in({ delay: 0 });
              window.carouselText?.inActive({ delay: 0 });
              gsap.to(gammeContainer, { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' });
            },
            onLeave: () => {
              reveal?.out();
              window.carouselText?.outActive();
              gsap.to(gammeContainer, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });
            },
            onLeaveBack: () => {
              document.body.classList.remove('is-profile-active');
              reveal?.out();
              window.carouselText?.outActive();
            },
          },
        })
        .fromTo(container, { autoAlpha: 0 }, { autoAlpha: 1 })
        .fromTo('.carousel_title-bis-wrapper', { autoAlpha: 0 }, { autoAlpha: 1 }, '<');
    };

    // Section Benefits

    const initSectionBenefits = () => {
      const sections = $$('.section.is-benefits');
      if (!sections.length) return;
      sections.forEach((section) => {
        const container = $('.benefits_container', section);
        if (!container) return;
        const reveal = initAnimations(section);

        gsap.set(section, { '--line': 0 });

        gsap
          .timeline({
            defaults: { duration: 0.5, ease: 'power2.inOut' },
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom bottom',
              toggleActions: 'play reverse play reverse',
              onEnter: () => {
                reveal?.in({ delay: 0.35 });
                gsap.fromTo(section, { '--benefits-line': 0 }, { '--benefits-line': 1, duration: 0.8, ease: 'power3.out', delay: 1 });
              },
              onEnterBack: () => {
                reveal?.in({ delay: 0.35 });
                gsap.fromTo(section, { '--benefits-line': 0 }, { '--benefits-line': 1, duration: 0.8, ease: 'power3.out', delay: 1 });
              },
              onLeave: () => reveal?.out(),
              onLeaveBack: () => reveal?.out(),
            },
          })
          .fromTo(container, { autoAlpha: 0 }, { autoAlpha: 1, delay: 0.35 });
      });
    };

    const initBenefitsNav = () => {
      const nav = $('.benefits_nav');
      const sections = $$('.section.is-benefits');
      const profileSection = $('.section.is-profile');
      if (!nav || !sections.length || !profileSection) return;

      const icons = $$('.benefits_icon-wrapper', nav);

      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: profileSection,
          start: 'top bottom',
          endTrigger: sections[sections.length - 1],
          end: 'bottom bottom',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(nav, { autoAlpha: 0 }, { autoAlpha: 1 });

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom bottom',
          onToggle: ({ isActive }) => icons[i]?.classList.toggle('is-active', isActive),
        });
      });
    };

    // Section Argument

    const initSectionArgument = () => {
      const section = $('.section.is-argument');
      if (!section) return;

      const svgShapes = $$('.argument_svg svg path, .argument_svg svg polygon', section);
      const svgBlur = $('.argument_svg-blur', section);

      gsap.set(svgShapes, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
      if (svgBlur) gsap.set(svgBlur, { autoAlpha: 0 });

      const animateSvgIn = () => {
        gsap.to(svgShapes, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.04,
          delay: 0.4,
          overwrite: true,
        });
        if (svgBlur) {
          gsap.to(svgBlur, {
            autoAlpha: 1,
            duration: 0.4,
            ease: 'power2.out',
            delay: 1,
            overwrite: true,
          });
        }
      };

      const animateSvgOut = () => {
        gsap.to(svgShapes, {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.4,
          ease: 'power2.in',
          overwrite: true,
        });
        if (svgBlur) {
          gsap.to(svgBlur, {
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.in',
            overwrite: true,
          });
        }
      };

      gsap
        .timeline({
          defaults: { duration: 0.5, ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom bottom',
            toggleActions: 'play reverse play reverse',
            onEnter: animateSvgIn,
            onEnterBack: animateSvgIn,
            onLeave: animateSvgOut,
            onLeaveBack: animateSvgOut,
          },
        })
        .fromTo('.argument_container', { autoAlpha: 0 }, { autoAlpha: 1 })
        .fromTo('.gradient_overlay', { autoAlpha: 1 }, { autoAlpha: 0 }, '<');
    };

    // Section Full Range

    const initSectionFullRange = () => {
      const section = $('.section.is-full-gamme');
      if (!section) return;

      gsap.timeline({
        defaults: { duration: 0.5, ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom bottom',
          toggleActions: 'play reverse play reverse',
          onEnter: () => document.body.classList.remove('is-profile-active'),
          onLeaveBack: () => document.body.classList.add('is-profile-active'),
        },
      });
    };

    // Section FAQ (mobile : fade out du HUD)

    const initSectionFaq = () => {
      if (!isMobile()) return;

      const section = $('.section.is-faq');
      if (!section) return;

      gsap.fromTo(
        '.hud_container',
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    };

    // #region Init

    const initWhenCarousel = (fn) => {
      if (window.carousel) {
        fn();
      } else {
        window.addEventListener('carousel:ready', fn, { once: true });
      }
    };

    const setupCarouselText = () => {
      window.carouselText = initCarouselText();
    };

    initLoader();
    initSoundToggle();
    initMenuButton();
    initMenuToggle();
    initScrollIcon();
    initCarouselArrowsHover();
    initWhenCarousel(setupCarouselText);
    initWhenCarousel(initCarouselNav);
    initWhenCarousel(initCarouselPagination);
    initWhenCarousel(initCarouselColors);
    initWhenCarousel(initRangeGradient);
    initWhenCarousel(initCarouselVideo);
    initSectionRange();
    initSectionProfile();
    initSectionBenefits();
    initBenefitsNav();
    initSectionArgument();
    initSectionFullRange();
    initSectionFaq();
  });



  document.addEventListener('DOMContentLoaded', () => {
    // === CONFIG : tes sons ===
    const SOUNDS = {
      change: '/69fb53371d5b8e9c3f4e4c69/6a1931adeeccb22ae319671f_a05ee47a5e61560727f7dfe21194a4b9_PROMPTEDSITE-ENERGY-defilementui.mp3', // changement de canette
      enter: '/69fb53371d5b8e9c3f4e4c69/6a1932a8b13b5bf33b3a1339_c5c6e6976127365d417e66b413c7973e_PROMPTEDSITE-ENERGY-doubleclic-canette.mp3', // 1ère -> 2e section
      benefits: '/69fb53371d5b8e9c3f4e4c69/6a19377501bbf3759e07daeb_3c593ea845e9d3018a1e70a20d53b230_PROMPTEDSITE-ENERGY-transition2.mp3', // transition vers section benefits
      click: '/69fb53371d5b8e9c3f4e4c69/6a193703d7e9f8e098677ed1_dd3a7d784cae6dde94102dfd0857c348_PROMPTEDSITE-ENERGY-Clickui.mp3', // bouton menu + liens menu
    };

    const VOLUME = 0.5; // 0 à 1

    // === Moteur Web Audio ===
    let ctx = null;
    const buffers = {};
    let unlocked = false;

    const initCtx = () => {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    };

    const loadSound = async (name, url) => {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        buffers[name] = await ctx.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.warn('[promptedsiteSound] échec chargement', name, e);
      }
    };

    const preload = () => {
      initCtx();
      Object.entries(SOUNDS).forEach(([name, url]) => loadSound(name, url));
    };

    // Respecte le bouton son de la navbar (.navbar_sound.is-muted)
    const isMuted = () => {
      const btn = document.querySelector('.navbar_sound');
      return btn ? btn.classList.contains('is-muted') : false;
    };

    const play = (name, { volume = 1, rate = 1 } = {}) => {
      if (!ctx || !buffers[name] || !unlocked || isMuted()) return;

      const source = ctx.createBufferSource();
      source.buffer = buffers[name];
      source.playbackRate.value = rate;

      const gain = ctx.createGain();
      gain.gain.value = VOLUME * volume;

      source.connect(gain).connect(ctx.destination);
      source.start(0);
    };

    // === Déblocage au 1er geste (autoplay policy) ===
    const unlock = () => {
      initCtx();
      if (ctx.state === 'suspended') ctx.resume();
      unlocked = true;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('wheel', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('wheel', unlock);

    preload();

    // Contrôle manuel : window.promptedsiteSound.play('change')
    window.promptedsiteSound = { play };

    // === Verrou navigation menu : coupe les sons de scroll pendant un scrollTo programmatique ===
    const nav = { lock: false, timer: null };
    const lockNav = (ms = 1800) => {
      nav.lock = true;
      clearTimeout(nav.timer);
      nav.timer = setTimeout(() => (nav.lock = false), ms);
    };

    // === 1. Son au changement de canette active ===
    const bindCarousel = () => {
      if (!window.carousel || !window.carousel.changed) return false;
      window.carousel.changed.connect(() => play('change'));
      return true;
    };
    if (!bindCarousel()) {
      window.addEventListener('carousel:ready', bindCarousel, { once: true });
    }

    // === 2. Son au DÉBUT de la transition 1ère -> 2e section ===
    const bindSectionEnter = () => {
      if (!window.lenis) return false;

      let boundary = 0; // top de la section 2 = hauteur de la section 1
      const computeBoundary = () => {
        const first = document.querySelector('section');
        boundary = first ? first.clientHeight : 0;
      };
      computeBoundary();
      window.addEventListener('resize', computeBoundary);

      const fireAt = () => Math.max(boundary * 0.03, 24);

      let inHome = true;
      let last = window.lenis.animatedScroll || 0;

      window.lenis.on('scroll', () => {
        const cur = window.lenis.animatedScroll;
        const goingDown = cur > last;
        const threshold = fireAt();

        if (inHome && cur >= threshold) {
          inHome = false;
          if (goingDown && !nav.lock) play('enter');
        } else if (!inHome && cur < threshold) {
          inHome = true;
        }
        last = cur;
      });

      return true;
    };
    if (!bindSectionEnter()) {
      window.addEventListener('carousel:ready', bindSectionEnter, { once: true });
    }

    // === 3. Son à chaque transition vers une section benefits (montée ET descente) ===
    const bindBenefits = () => {
      if (!window.lenis) return false;

      const wrap = (v, min, max) => {
        const size = max - min;
        v = v % size;
        if (v < 0) v += size;
        return v + min;
      };

      let sections = [];
      const buildSections = () => {
        let top = 0;
        sections = [...document.querySelectorAll('section')].map((el) => {
          const item = { top, isBenefits: el.classList.contains('is-benefits') };
          top += el.clientHeight;
          return item;
        });
      };
      buildSections();
      window.addEventListener('resize', buildSections);

      const currentIndex = (pos) => {
        let best = 0;
        let dist = Infinity;
        sections.forEach((it, i) => {
          const d = Math.abs(it.top - pos);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        return best;
      };

      let lastIdx = currentIndex(0);

      window.lenis.on('scroll', () => {
        const max = window.lenis.dimensions.scrollHeight - window.lenis.dimensions.height;
        if (max <= 0) return;
        const pos = wrap(window.lenis.animatedScroll, 0, max);
        const idx = currentIndex(pos);

        if (idx !== lastIdx) {
          // |delta| === 1 => déplacement section par section (filtre le saut de loop infini)
          const adjacent = Math.abs(idx - lastIdx) === 1;
          if (adjacent && sections[idx]?.isBenefits && !nav.lock) play('benefits');
          lastIdx = idx;
        }
      });

      return true;
    };

    if (!bindBenefits()) {
      window.addEventListener('carousel:ready', bindBenefits, { once: true });
    }

    // === 4. Son au clic sur le bouton menu et les liens du menu ===
    const initMenuClicks = () => {
      document.querySelector('.navbar_menu-button')?.addEventListener('click', () => play('click'));

      document.querySelectorAll('.navbar_link').forEach((link) => {
        link.addEventListener('click', () => {
          play('click'); // seul le son de clic part
          lockNav(); // verrouille les sons de scroll le temps du scrollTo
        });
      });

      // Nav benefits : son + verrou (scrollTo vers benefits)
      document.querySelectorAll('.benefits_icon-wrapper').forEach((icon) => {
        icon.addEventListener('click', () => {
          play('benefits');
          lockNav();
        });
      });

      // FAQ : son seul (accordéon, pas de scroll)
      document.querySelectorAll('.faq_question').forEach((q) => {
        q.addEventListener('click', () => play('click'));
      });
    };
    initMenuClicks();
  });



  document.addEventListener('DOMContentLoaded', () => {
    // BUTTON HOVER ANIMATION (desktop only)
    if (window.innerWidth > 991) {
      document.querySelectorAll('.button').forEach((btn) => {
        if (btn.closest('.sib-form')) return; // ⬅️ ne pas toucher au bouton Brevo (loader interne)

        const icon = btn.querySelector('.button_icon');
        const iconClone = icon?.cloneNode(true);
        icon?.remove();

        const chars = btn.textContent
          .trim()
          .split('')
          .map((char) => `<span class="char" style="display:inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        btn.innerHTML = `
  <div class="button_text" style="overflow:hidden; display:inline-flex; position:relative;">
  <div class="layer-top">${chars}</div>
  <div class="layer-bottom" style="position:absolute; top:0; left:0;">${chars}</div>
  </div>`;

        if (iconClone) btn.prepend(iconClone);

        const top = btn.querySelectorAll('.layer-top .char');
        const bottom = btn.querySelectorAll('.layer-bottom .char');
        const stagger = Math.min(0.025, 0.25 / top.length);

        gsap.set(bottom, {
          y: '110%',
        });

        btn.addEventListener('mouseenter', () => {
          gsap.killTweensOf([top, bottom]);
          gsap
            .timeline()
            .to(top, { y: '-110%', stagger, duration: 0.4, ease: 'power3.inOut' }, 0)
            .to(bottom, { y: '0%', stagger, duration: 0.4, ease: 'power3.inOut' }, 0);
        });

        btn.addEventListener('mouseleave', () => {
          gsap.killTweensOf([top, bottom]);
          gsap
            .timeline()
            .to(bottom, { y: '110%', stagger, duration: 0.4, ease: 'power3.inOut' }, 0)
            .to(top, { y: '0%', stagger, duration: 0.4, ease: 'power3.inOut' }, 0);
        });
      });
    }
  });


gsap.registerPlugin(ScrollTrigger,SplitText);