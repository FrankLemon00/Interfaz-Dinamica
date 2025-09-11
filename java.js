document.addEventListener("scroll", () => {
  const parallaxContainers = document.querySelectorAll(".parallax-container");
  const scrollY = window.scrollY;

  parallaxContainers.forEach(container => {
    const bg = container.querySelector(".parallax-bg");
    const img = container.querySelector(".personaje-img");

    const offset = scrollY * 0.1; // Velocidad del movimiento
    bg.style.transform = `translateY(${offset}px)`;
    img.style.transform = `translateY(${offset}px)`;
  });
});