$(document).ready(function () {
  $.ajax({
    url: 'menu.html',
    cache: false,
    success: function (data) {
      $('#menu-placeholder').html(data);

      const currentPath = window.location.pathname.replace(/\/$/, "");
      const menuLinks = document.querySelectorAll(".menu-link");

      menuLinks.forEach((link) => {
        const linkPath = link.getAttribute("href").replace(/\/$/, "");
        if (linkPath === currentPath) {
          link.classList.add("active");
        }
      });
    },
    error: function (xhr, status, error) {
      console.error('메뉴바 로딩 실패:', error);
    }
  });
});
