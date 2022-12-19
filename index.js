// Get a reference to the headings
const heading1 = document.getElementById('heading-1');
const heading2 = document.getElementById('heading-2');
const heading3 = document.getElementById('heading-3');
const heading4 = document.getElementById('heading-4');

// Get a list of all the circles
const circles = document.querySelectorAll('#side-nav div');

// Add event listeners to the circles
circles.forEach( (circle) => {
  circle.addEventListener('click', () => {
    // Get the target heading using the data-target attribute
    const targetId = circle.getAttribute('data-target');
    const targetHeading = document.querySelector(targetId);

    // Scroll the heading into view
    targetHeading.scrollIntoView({ behavior: 'smooth' });
  });
});