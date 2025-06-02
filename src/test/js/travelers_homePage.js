/* =========================================
   サイドバー制御
   ========================================= */
const sidebar = document.getElementById("sidebar");
const menuButton = document.querySelector(".menu-button");

// サイドバーの表示/非表示を切り替え
function toggleSidebar() {
  sidebar.classList.toggle("active");
}

// サイドバー外クリックで閉じる
document.addEventListener("click", function(event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnMenu = menuButton.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnMenu) {
    sidebar.classList.remove("active");
  }
});

/* =========================================
   スライドショー制御
   ========================================= */
let index = 0;
const slides = document.querySelectorAll('.slide');

// 5秒ごとにスライドを切り替え
setInterval(() => {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}, 5000);

