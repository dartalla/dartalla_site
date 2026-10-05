(() => {
  "use strict";

  const header = document.querySelector(".navbar-area");
  const logo = document.querySelector(".navbar-brand img");
  const backToTop = document.querySelector(".scroll-top");
  let scrollScheduled = false;

  // Fixed interface identifiers only; no URLs, free text, storage or transmission.
  function trackInteraction(action, section, control) {
    document.dispatchEvent(
      new CustomEvent("dartalla:interaction", {
        detail: { action, section, control },
      }),
    );
  }

  function updateScrollState() {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle("sticky", scrolled);
    header?.closest(".header")?.classList.toggle("is-scrolled", scrolled);
    if (logo) {
      const source = scrolled
        ? "assets/img/logo/logo-2.svg"
        : "assets/img/logo/logo.svg";
      if (logo.getAttribute("src") !== source) logo.setAttribute("src", source);
    }
    backToTop?.classList.toggle("visible", window.scrollY > 400);
    scrollScheduled = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        window.requestAnimationFrame(updateScrollState);
      }
    },
    { passive: true },
  );
  updateScrollState();

  if (!window.bootstrap?.Collapse)
    document.documentElement.classList.remove("navigation-enhanced");

  const navigation = document.querySelector("#navigation");
  const toggler = document.querySelector(".navbar-toggler");
  if (navigation && toggler && window.bootstrap?.Collapse) {
    const menu = window.bootstrap.Collapse.getOrCreateInstance(navigation, {
      toggle: false,
    });
    let closeAfterOpening = false;
    navigation.addEventListener("shown.bs.collapse", () => {
      if (closeAfterOpening) {
        closeAfterOpening = false;
        menu.hide();
      }
    });
    navigation.addEventListener("hidden.bs.collapse", () => {
      toggler.setAttribute("aria-expanded", "false");
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navigation.classList.contains("collapsing"))
          closeAfterOpening = true;
        else menu.hide();
      });
    });
    navigation.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (navigation.classList.contains("collapsing"))
          closeAfterOpening = true;
        else menu.hide();
        toggler.focus();
      }
    });
    document.documentElement.classList.add("navigation-enhanced");
  }

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const runningAnimations = new Map();
  const revealed = new WeakSet();
  let revealObserver;
  let smoothScroll;
  const faqAnimations = new Map();
  const revealSelector =
    ".hero-content-wrapper > *, .hero-capture, .section-title > *, .feature-card, .audience-card, .step, .benefit-panel article, .faq-illustration, .faq-list details, .contact-panel > :not(.decoration), .product-carousel";

  function clearReveal(element) {
    runningAnimations.get(element)?.cancel();
    runningAnimations.delete(element);
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");
    // Motion's final render can commit styles after its completion promise.
    window.requestAnimationFrame(() => {
      if (runningAnimations.has(element)) return;
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    });
  }

  function enableMotion() {
    if (motionPreference.matches) return;
    if (window.Lenis) {
      smoothScroll = new window.Lenis({
        autoRaf: true,
        duration: 1.45,
        easing: (value) => -(Math.cos(Math.PI * value) - 1) / 2,
        smoothWheel: false,
        syncTouch: false,
        anchors: true,
        prevent: (element) => element.closest(".product-track, #navigation"),
      });
    }
    if (!window.Motion?.animate || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-enabled");
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          revealObserver.unobserve(target);
          if (revealed.has(target) || motionPreference.matches) return;
          revealed.add(target);
          const siblings = [...target.parentElement.children].filter(
            (sibling) => !sibling.classList.contains("decoration"),
          );
          const sideways = target.matches(".hero-capture, .faq-illustration");
          const isHero = target.closest(".hero-section");
          const animation = window.Motion.animate(
            target,
            {
              ...(isHero ? {} : { opacity: [0.12, 1] }),
              transform: [
                sideways ? "translateX(18px)" : "translateY(18px)",
                "translate(0, 0)",
              ],
            },
            {
              duration: 1.35,
              delay: Math.min(siblings.indexOf(target), 3) * 0.12,
              ease: [0.25, 0.1, 0.25, 1],
            },
          );
          runningAnimations.set(target, animation);
          animation.then(() => {
            if (runningAnimations.get(target) === animation)
              clearReveal(target);
          });
        });
      },
      { threshold: 0.01 },
    );
    document.querySelectorAll(revealSelector).forEach((element) => {
      if (!revealed.has(element)) revealObserver.observe(element);
    });
  }

  function disableMotion() {
    smoothScroll?.destroy();
    smoothScroll = undefined;
    document.documentElement.classList.remove("motion-enabled");
    revealObserver?.disconnect();
    [...runningAnimations.keys()].forEach(clearReveal);
    faqAnimations.forEach(({ animation, wantsOpen }, detail) => {
      animation.cancel();
      detail.open = wantsOpen;
      detail.style.removeProperty("height");
      detail.style.removeProperty("overflow");
    });
    faqAnimations.clear();
  }

  enableMotion();
  motionPreference.addEventListener("change", ({ matches }) => {
    if (matches) disableMotion();
    else enableMotion();
  });
  // Keyboard navigation should never wait for a reveal to finish.
  document.addEventListener("focusin", (event) => {
    const element = event.target.closest(revealSelector);
    if (element) clearReveal(element);
  });
  document.querySelectorAll(".faq-list details").forEach((detail) => {
    const summary = detail.querySelector("summary");
    detail.addEventListener("toggle", () => {
      if (detail.open && (motionPreference.matches || !detail.animate))
        trackInteraction(
          "faq_open",
          "faq",
          String(
            [...detail.parentElement.querySelectorAll("details")].indexOf(
              detail,
            ) + 1,
          ),
        );
    });
    summary.addEventListener("click", (event) => {
      if (motionPreference.matches || !detail.animate) return;
      event.preventDefault();
      clearReveal(detail);
      const pending = faqAnimations.get(detail);
      const wantsOpen = !(pending?.wantsOpen ?? detail.open);
      const from = detail.getBoundingClientRect().height;
      pending?.animation.cancel();
      detail.style.height = "auto";
      detail.open = true;
      const border = parseFloat(getComputedStyle(detail).borderTopWidth) * 2;
      const to = wantsOpen
        ? detail.getBoundingClientRect().height
        : summary.getBoundingClientRect().height + border;
      detail.style.overflow = "hidden";
      const animation = detail.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: 420, easing: "cubic-bezier(.25, .1, .25, 1)" },
      );
      faqAnimations.set(detail, { animation, wantsOpen });
      animation.onfinish = () => {
        if (faqAnimations.get(detail)?.animation !== animation) return;
        detail.open = wantsOpen;
        if (wantsOpen)
          trackInteraction(
            "faq_open",
            "faq",
            String(
              [...detail.parentElement.querySelectorAll("details")].indexOf(
                detail,
              ) + 1,
            ),
          );
        detail.style.removeProperty("height");
        detail.style.removeProperty("overflow");
        faqAnimations.delete(detail);
      };
    });
  });

  // Links still open the original image when JavaScript or dialog support is absent.
  if (typeof HTMLDialogElement !== "undefined") {
    const viewer = document.createElement("dialog");
    viewer.className = "screenshot-viewer";
    viewer.setAttribute("aria-labelledby", "screenshot-viewer-title");
    viewer.innerHTML = `<div class="viewer-toolbar">
      <h2 id="screenshot-viewer-title">Tela do Dartalla One</h2>
      <button type="button" class="viewer-zoom" aria-pressed="false">Ver em tamanho real</button>
      <button type="button" class="viewer-close" autofocus aria-label="Fechar captura ampliada">Fechar ×</button>
    </div>
    <p class="viewer-caption">Ambiente de demonstração — dados demonstrativos</p>
    <div class="viewer-viewport" tabindex="0" aria-label="Captura ampliada; use as setas ou deslize para explorar"><img width="1600" height="1000" alt="" /></div>`;
    document.body.append(viewer);
    const image = viewer.querySelector("img");
    const zoom = viewer.querySelector(".viewer-zoom");
    let returnLink;
    viewer
      .querySelector(".viewer-close")
      .addEventListener("click", () => viewer.close());
    zoom.addEventListener("click", () => {
      const enlarged = viewer.classList.toggle("is-zoomed");
      zoom.setAttribute("aria-pressed", String(enlarged));
      zoom.textContent = enlarged ? "Ajustar à tela" : "Ver em tamanho real";
      trackInteraction(
        "screenshot_zoom",
        "telas",
        enlarged ? "actual_size" : "fit",
      );
    });
    viewer.addEventListener("close", () => {
      document.documentElement.classList.remove("viewer-open");
      smoothScroll?.start();
      image.removeAttribute("src");
      returnLink?.focus({ preventScroll: true });
    });
    document
      .querySelectorAll('a[href^="assets/img/product/"][href$="-1600.webp"]')
      .forEach((link) => {
        link.setAttribute("aria-haspopup", "dialog");
        link.setAttribute(
          "aria-label",
          (link.getAttribute("aria-label") || link.textContent.trim()).replace(
            /\s*\(abre em nova aba\)/,
            "",
          ) + " — abrir captura ampliada",
        );
        link.addEventListener("click", (event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          returnLink = link;
          const figure = link.closest("figure");
          image.alt =
            figure?.querySelector(".capture-link img")?.alt ||
            "Tela do Dartalla One com dados demonstrativos";
          image.src = link.href;
          viewer.querySelector("h2").textContent =
            link.closest(".product-shot")?.querySelector("h3")?.textContent ||
            "Dashboard do Dartalla One";
          viewer.classList.remove("is-zoomed");
          zoom.setAttribute("aria-pressed", "false");
          zoom.textContent = "Ver em tamanho real";
          viewer.showModal();
          trackInteraction(
            "screenshot_open",
            link.closest("section")?.id || "telas",
            link
              .getAttribute("href")
              .split("/")
              .pop()
              .replace("-1600.webp", ""),
          );
          document.documentElement.classList.add("viewer-open");
          smoothScroll?.stop();
        });
      });
  }

  const carousel = document.querySelector(".product-carousel");
  if (carousel) {
    const track = carousel.querySelector(".product-track");
    const slides = [...track.querySelectorAll(".product-shot")];
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector(".carousel-status");
    const names = ["Transações", "Fiscal", "Clientes"];
    let current = 0;
    let scrollPending = false;
    carousel.classList.add("carousel-ready");
    carousel.querySelector(".carousel-controls").hidden = false;
    track.tabIndex = 0;
    track.setAttribute(
      "aria-label",
      "Galeria: use as setas do teclado ou deslize para navegar",
    );
    const updateCarousel = () => {
      current = Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(track.scrollLeft / track.clientWidth),
        ),
      );
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      const label = `${names[current]} · ${current + 1} de ${slides.length}`;
      if (status.textContent !== label) {
        status.textContent = label;
        trackInteraction("gallery_change", "telas", String(current + 1));
      }
      scrollPending = false;
    };
    const moveTo = (index) => {
      track.scrollTo({
        left:
          Math.max(0, Math.min(slides.length - 1, index)) * track.clientWidth,
        behavior: motionPreference.matches ? "instant" : "smooth",
      });
    };
    previous.addEventListener("click", () => moveTo(current - 1));
    next.addEventListener("click", () => moveTo(current + 1));
    track.addEventListener("keydown", (event) => {
      if (event.target !== track) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        moveTo(current + (event.key === "ArrowRight" ? 1 : -1));
      }
    });
    track.addEventListener(
      "scroll",
      () => {
        if (!scrollPending) {
          scrollPending = true;
          window.requestAnimationFrame(updateCarousel);
        }
      },
      { passive: true },
    );
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        track.scrollTo({
          left: current * track.clientWidth,
          behavior: "instant",
        });
        updateCarousel();
      }).observe(track);
    }
    track.addEventListener("focusin", (event) => {
      const slide = event.target.closest(".product-shot");
      if (slide) moveTo(slides.indexOf(slide));
    });
    updateCarousel();
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          sectionObserver.unobserve(target);
          trackInteraction("section_view", target.id, "section");
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => sectionObserver.observe(section));
  }

  // Local event hook only: no tracker, persistence, or personal data.
  document.querySelectorAll("[data-cta]").forEach((link) => {
    link.addEventListener("click", () => {
      trackInteraction(
        "contact_intent",
        link.closest("section")?.id || "navigation",
        link.dataset.cta,
      );
      document.dispatchEvent(
        new CustomEvent("dartalla:cta_click", {
          detail: { placement: link.dataset.cta, intent: "request_demo" },
        }),
      );
    });
  });
})();
