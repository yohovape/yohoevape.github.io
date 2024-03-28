$(function () {
  var mySwiper1 = new Swiper(".home-banner .swiper-container", {
    autoplay: true,
    loop: true,
    effect: "fade",
    speed: 600,
    pagination: {
      el: ".home-banner .swiper-pagination",
    },
    navigation: {
      nextEl: ".home-banner .button-next",
      prevEl: ".home-banner .button-prev",
    },
    lazy: {
      loadPrevNext: true,
    },
  });

  var mySwiper2 = new Swiper(".products-list .swiper-container", {
    slidesPerView: 6,
    slidesPerGroup: 6,
    spaceBetween: 40,
    pagination: {
      el: ".products-list .swiper-pagination",
    },
    navigation: {
      nextEl: ".products-list .button-next",
      prevEl: ".products-list .button-prev",
    },
    breakpoints: {
      1400: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      767: {
        slidesPerView: 2.3,
        slidesPerGroup: 2,
        spaceBetween: 20,
      },
    },
  });

  var mySwiper3 = new Swiper(".go-beyond-container .swiper-container", {
    loop: true,
    speed: 1000,
    pagination: {
      el: ".go-beyond-container .swiper-pagination",
    },
    navigation: {
      nextEl: ".go-beyond-container .button-next",
      prevEl: ".go-beyond-container .button-prev",
    },
    noSwiping: true,
  });
});
