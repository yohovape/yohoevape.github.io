$(function () {
  var $grid = $(".grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: ".grid-item",
    horizontalOrder: true,
  });
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });

  $("#J_search-btn").click(function () {
    $(".search-form").show();
    $("#J_search").focus();
  });
  $("#J_close-btn").click(function () {
    $(".search-form").hide();
    $("#J_search").blur();

    if (getQueryString("title_search")) {
      var url = window.location.href;
      url = url.split("?")[0];
      location.href = url;
    } else {
      $("input#J_search").val("");
    }
  });

  // 获取url中的指定参数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null) {
      context = decodeURIComponent(r[2]);
    }
    return context;
  }
  if (getQueryString("title_search")) {
    $(".search-form").show();
  }

  $(document).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      if ($("input#J_search").val() == "") {
        return;
      }
      // 去搜索
      $("#productForm").submit();
    }
  });

  var navOffsetTop = $(".sticky-nav").offset().top;
  var navHeight = $(".sticky-nav").outerHeight(true);
  if (getQueryString("title_search")) {
    navHeight = $(".sticky-nav").innerHeight();
  }

  $(window).scroll(function () {
    if ($(window).scrollTop() > navOffsetTop) {
      $(".sticky-nav").addClass("sticky");
      $(".news-content").css("paddingTop", navHeight);
    } else {
      $(".sticky-nav").removeClass("sticky");
      $(".news-content").css("paddingTop", 0);
    }
  });
});
