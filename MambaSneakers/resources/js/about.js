const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');

slides.forEach((slide) => {
  const clonedSlide = slide.cloneNode(true);
  slidesContainer.appendChild(clonedSlide);
});
