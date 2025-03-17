$(document).ready(function() {
  $.ajax({
    url: 'menu.html',
    success: function(data) {
      $('#menu-placeholder').html(data);
    },
    error: function(xhr, status, error) {
      console.error('메뉴바 로딩 실패:', error);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname; // 현재 페이지 경로
  const menuLinks = document.querySelectorAll(".menu-link");

  menuLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
