$(document).ready(function () {
  $.ajax({
    url: 'menu.html',
    cache: false,
    success: function (data) {
      $('#menu-placeholder').html(data);

      // 메뉴 로딩 후 현재 페이지 감지
      const currentPath = window.location.pathname.replace(/\/$/, "");
      const menuLinks = document.querySelectorAll(".menu-link");

      menuLinks.forEach((link) => {
        const linkPath = link.getAttribute("href").replace(/\/$/, "");
        console.log("현재 경로:", currentPath);
        console.log("링크 경로:", linkPath);

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
