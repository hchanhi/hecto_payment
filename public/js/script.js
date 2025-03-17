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
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const menuLinks = document.querySelectorAll(".menu-link");

  console.log(currentPath);
  console.log(link.getAttribute("href"));
  menuLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").replace(/\/$/, ""); 
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});
