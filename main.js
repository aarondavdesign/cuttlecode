// Mobile menu: the sheet is unhidden first, then data-open flips on the next
// frame so the fade/slide transitions run. Closing reverses it and re-hides
// the sheet once the exit transition has finished.
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const EXIT_MS = 280;
  const desktop = window.matchMedia("(min-width: 1101px)");
  const background = [document.querySelector("main"), document.querySelector("footer")];
  let hideTimer;

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  function open() {
    clearTimeout(hideTimer);
    menu.hidden = false;
    menu.offsetHeight; // commit the closed state before transitioning
    requestAnimationFrame(() => { menu.dataset.open = "true"; });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    background.forEach((el) => el && (el.inert = true));
  }

  function close({ restoreFocus = false } = {}) {
    menu.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    background.forEach((el) => el && (el.inert = false));
    hideTimer = setTimeout(() => { if (!isOpen()) menu.hidden = true; }, EXIT_MS);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close({ restoreFocus: true });
  });
  desktop.addEventListener("change", (e) => { if (e.matches && isOpen()) close(); });
})();

// Hero monitor video: only play while on screen, and not at all for reduced motion.
(() => {
  const video = document.querySelector(".monitor__video");
  if (!video) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }).observe(video);
})();
