gsap.fromTo(
  'button', {
  y: 500,
  opacity: 0,
}, {
  y: 0,
  opacity: 1,
  duration: 2,
}
);
gsap.fromTo(
  '[data-slide]', {
  opacity: 0,
  y: 15,
}, {
  y: 0,
  opacity: 1,
  duration: 0.5,
  delay: 2,
  stagger: 0.125
});