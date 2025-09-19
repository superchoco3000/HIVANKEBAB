(function() {
  "use strict";

  // Función para verificar si un elemento existe antes de usarlo
  function safeQuerySelector(selector) {
    return document.querySelector(selector);
  }

  function safeQuerySelectorAll(selector) {
    return document.querySelectorAll(selector) || [];
  }

  // Toggle scrolled class
  const selectBody = safeQuerySelector('body');
  if (selectBody) {
    const toggleScrolled = () => {
      selectBody.classList.toggle('scrolled', window.scrollY > 100);
    };
    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);
  }

  // Mobile navigation toggle
  const mobileNavToggleBtn = safeQuerySelector('.mobile-nav-toggle');
  if (mobileNavToggleBtn) {
    const mobileNavToggle = () => {
      const body = safeQuerySelector('body');
      if (body) {
        body.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }
    };
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);

    // Close mobile nav when clicking on menu items
    safeQuerySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (safeQuerySelector('.mobile-nav-active')) {
          mobileNavToggle();
        }
      });
    });
  }

  // Dropdown toggle
  safeQuerySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      if (this.parentNode.nextElementSibling) {
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      }
      e.stopImmediatePropagation();
    });
  });

  // Smooth scrolling for anchor links
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = safeQuerySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  // Navigation scrollspy
  let navmenulinks = safeQuerySelectorAll('.navmenu a');
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = safeQuerySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        safeQuerySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // GLightbox initialization (solo si existe)
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });

    const purebox = GLightbox({
      selector: '.pure-glightbox'
    });

    const galleryLightbox = GLightbox({
      selector: '.gallery-lightbox'
    });
  } else {
    console.warn('GLightbox no está disponible');
  }

  // Swiper initialization (solo si existe)
  if (typeof Swiper !== 'undefined') {
    // Events slider
    const eventsSliderEl = safeQuerySelector('.events-slider');
    if (eventsSliderEl) {
      new Swiper('.events-slider', {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }

    // Testimonials slider
    const testimonialsSliderEl = safeQuerySelector('.testimonials-slider');
    if (testimonialsSliderEl) {
      new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 40
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 20
          }
        }
      });
    }
  } else {
    console.warn('Swiper no está disponible');
  }

  // Preloader
  const preloader = safeQuerySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // Scroll to top button
  const scrollTop = safeQuerySelector('#scroll-top');
  if (scrollTop) {
    const toggleScrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    };
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // AOS initialization (solo si existe)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  } else {
    console.warn('AOS no está disponible');
  }

  // Initialize custom swiper
  function initSwiper() {
    safeQuerySelectorAll(".init-swiper").forEach(function(swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (configEl && typeof Swiper !== 'undefined') {
        let config;
        try {
          config = JSON.parse(configEl.innerHTML.trim());
        } catch (e) {
          console.error('Error parsing swiper config:', e);
          return;
        }

        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // Menu isotope and filter (solo si Isotope existe)
  let menuContainer = safeQuerySelector('.isotope-container');
  if (menuContainer && typeof Isotope !== 'undefined') {
    let menuIsotope = new Isotope(menuContainer, {
      itemSelector: '.isotope-item',
      layoutMode: 'fitRows'
    });

    let menuFilters = safeQuerySelectorAll('.menu-filters li');
    menuFilters.forEach(function(el) {
      el.addEventListener('click', function() {
        const activeFilter = safeQuerySelector('.menu-filters .filter-active');
        if (activeFilter) {
          activeFilter.classList.remove('filter-active');
        }
        this.classList.add('filter-active');
        menuIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, false);
    });
  } else if (menuContainer) {
    console.warn('Isotope no está disponible para el filtro de menú');
    // Implementar filtro básico sin Isotope
    let menuFilters = safeQuerySelectorAll('.menu-filters li');
    menuFilters.forEach(function(el) {
      el.addEventListener('click', function() {
        const activeFilter = safeQuerySelector('.menu-filters .filter-active');
        if (activeFilter) {
          activeFilter.classList.remove('filter-active');
        }
        this.classList.add('filter-active');
        
        const filter = this.getAttribute('data-filter');
        const items = safeQuerySelectorAll('.isotope-item');
        
        items.forEach(item => {
          if (filter === '*' || item.classList.contains(filter.replace('.', ''))) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Función auxiliar para swiper con paginación personalizada
  function initSwiperWithCustomPagination(swiperElement, config) {
    // Esta función se implementaría si necesitas paginación personalizada
    new Swiper(swiperElement, config);
  }

})();