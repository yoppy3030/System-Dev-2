const sidebar = document.getElementById("sidebar");
const menuButton = document.querySelector(".menu-button");

function toggleSidebar() {
  sidebar.classList.toggle("active");
}

// Close sidebar if clicking outside
document.addEventListener("click", function(event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnMenu = menuButton.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenu) {
    sidebar.classList.remove("active");
  }
});



let index = 0;
  const slides = document.querySelectorAll('.slide');

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 5000); // Change every 5 seconds

