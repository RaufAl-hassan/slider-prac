// UI VARIABLE
const $slider = document.querySelector(".slider-container");
const $slides = document.querySelectorAll(".slide");

let isDragging = false,
  startPos = 0,
  currentIndex = 0,
  animationId = 0,
  currentTranslate = 0,
  prevTranslate = 0;

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;

  setSliderPosition();
};

const setSliderPosition = () => {
  $slider.style.transform = `translateX(${currentTranslate}px)`;
};

const animation = () => {
  setSliderPosition();

  if (isDragging) requestAnimationFrame(animation);
};

const getPositionX = (e) =>
  e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

const touchStart = (index, e) => {
  currentIndex = index;
  startPos = getPositionX(e);
  isDragging = true;

  animationId = requestAnimationFrame(animation);

  $slider.classList.add("grabbing");
};

const touchEnd = () => {
  isDragging = false;
  cancelAnimationFrame(animationId);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < $slides.length - 1) currentIndex += 1;

  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

  setPositionByIndex();

  $slider.classList.remove("grabbing");
};

const touchMove = (e) => {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
};

$slides.forEach(($slide, index) => {
  const $slideImg = $slide.querySelector("img");

  $slideImg.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  //TOUCH EVENTS
  $slide.addEventListener("touchstart", touchStart.bind(this, index));
  $slide.addEventListener("touchend", touchEnd);
  $slide.addEventListener("touchmove", touchMove);

  //   MOUSE EVENTS
  $slide.addEventListener("mousedown", touchStart.bind(this, index));
  $slide.addEventListener("mouseup", touchEnd);
  $slide.addEventListener("mouseleave", touchEnd);
  $slide.addEventListener("mousemove", touchMove);
});
