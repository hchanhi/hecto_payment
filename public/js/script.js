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
