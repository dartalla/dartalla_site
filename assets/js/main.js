(() => {
  "use strict";

  const header = document.querySelector(".navbar-area");
  const logo = document.querySelector(".navbar-brand img");
  const backToTop = document.querySelector(".scroll-top");
  let scrollScheduled = false;

  function updateScrollState() {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle("sticky", scrolled);
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

  // Local event hook only: no tracker, persistence, or personal data.
  document.querySelectorAll("[data-cta]").forEach((link) => {
    link.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("dartalla:cta_click", {
          detail: { placement: link.dataset.cta, intent: "request_demo" },
        }),
      );
    });
  });
})();
