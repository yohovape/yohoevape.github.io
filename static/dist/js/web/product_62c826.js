$(function () {
  $("#J_search-btn").click(function () {
    $(".search-form").show();
    $("#J_search").focus();
  });
  $("#J_close-btn").click(function () {
    $(".search-form").hide();
    $("#J_search").blur();

    if (getQueryString("product_search")) {
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
  if (getQueryString("product_search")) {
    $(".search-form").show();
  }

  $(document).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      if ($("input#J_search").val() == "") {
        // $('input#J_search').val($('#J_search').attr('placeholder'));
        return;
      }
      // 去搜索
      $("#productForm").submit();
    }
  });

  // 获取需要初始化Swiper的元素
  var swiperElements = document.querySelectorAll(".swiper-container");

  // 遍历元素并初始化Swiper
  for (var i = 0; i < swiperElements.length; i++) {
    if (swiperElements[i].querySelectorAll("li").length < 2) {
      swiperElements[i]
        .querySelector(".swiper-pagination")
        .setAttribute("style", "visibility: hidden;");
      swiperElements[i].classList.add("single");
    }
    window["products_swiper" + i] = new Swiper(swiperElements[i], {
      pagination: {
        el: ".swiper-pagination" + i,
      },
      autoplay: {
        delay: 1000,
      },
      loop: true,
    });
    eval("products_swiper" + i).autoplay.stop();
  }

  $(".swiper-container").mouseenter(function () {
    if (!$(this).hasClass("single")) {
      var num = $(this).data("num");
      if (window[num]) {
        window[num].autoplay.start();
      }
    }
  });

  $(".swiper-container").mouseleave(function () {
    if (!$(this).hasClass("single")) {
      var num = $(this).data("num");
      if (window[num]) {
        window[num].autoplay.stop();
      }
    }
  });
  var navOffsetTop = $(".sticky-nav").offset().top;
  var navHeight = $(".sticky-nav").outerHeight(true);
  if (getQueryString("product_search")) {
    navHeight = $(".sticky-nav").innerHeight();
  }

  $(window).scroll(function () {
    if ($(window).scrollTop() > navOffsetTop) {
      $(".sticky-nav").addClass("sticky");
      $(".products-content").css("paddingTop", navHeight);
    } else {
      $(".sticky-nav").removeClass("sticky");
      $(".products-content").css("paddingTop", 0);
    }
  });
});
