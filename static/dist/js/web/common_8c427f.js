$(function () {
  /*
    translate 全局函数
    key 翻译的key
    replacements 需要替换的翻译中的动态变量，以对象形式传入
    eg: $.translate("common_content", { "name": "张三" })
    */
  var langLock = false;
  var translateData = null;
  var count = 0; // 当超过10次时跳过
  $.translate = function (key, replacements) {
    if (
      localStorage.getItem("langVersion") != webData.lang_version ||
      !localStorage.getItem("translateData")
    ) {
      function getTranslateData() {
        if (langLock && count < 10) {
          // 如果已经被锁，则等待
          count++;
          setTimeout(getTranslateData, 100);
          return;
        }
        // 锁定
        langLock = true;
        $.ajax({
          type: "get",
          url: "/translate/translate.json?fresh=" + Math.random(),
          dataType: "json",
          async: false,
          success: function (res) {
            translateData = res;
            localStorage.setItem("langVersion", webData.lang_version);
            localStorage.setItem("translateData", JSON.stringify(res));
          },
          error: function () {
            translateData = {};
          },
        });
        // 解锁
        langLock = false;
      }
      getTranslateData();
    } else if (!translateData) {
      translateData = JSON.parse(localStorage.getItem("translateData")) || {};
    }
    var value = translateData[key];
    if (!value) {
      return key;
    }
    if (replacements) {
      for (var k in replacements) {
        value = value.replace("%" + k + "%", replacements[k]);
      }
    }
    return value;
  };

  //banner swiper
  $.fn.bannerRoll = function (obj, pagination, speed) {
    var speed = speed || 400;
    var mySwiper = new Swiper(obj, {
      loop: true,
      autoplay: 5000,
      speed: speed,
      pagination: pagination,
      paginationClickable: true,
    });

    $(this)
      .find(".arrow-left")
      .on("click", function () {
        mySwiper.swipePrev();
      });
    $(this)
      .find(".arrow-right")
      .on("click", function () {
        mySwiper.swipeNext();
      });

    $(this).mouseenter(function () {
      mySwiper.stopAutoplay();
    });
    $(this).mouseleave(function () {
      mySwiper.startAutoplay();
    });
  };

  window.createUrl = function (uri) {
    return window.location.protocol + "//" + window.location.host + "/" + uri;
  };
  $("#community_box li").click(function () {
    $(this).videoWindow($(this).find(".community-img").attr("video-url"));
  });
  $("#featured_videos li").click(function () {
    $(this).videoWindow($(this).find(".community-img").attr("video-url"));
  });
  // 手机端回退
  $(".mobile-back").click(function () {
    window.history.back(-1);
  });
  if ($(window).width() <= 420) {
    $(".public-header .top-nav li").mouseup(function () {
      if (!$(this).hasClass("showlanguagebox")) {
        $(".openheaderbar").show();
        $(".closeheaderbar").hide();
        setTimeout(function () {
          $(".public-header").css("overflow", "hidden");
          $(".top-nav").removeClass("in");
        }, 300);
      }
    });
  }
  // 手机端导航响应
  $(".openheaderbar").click(function () {
    $(".public-header").css("overflow", "visible");
    $(".closeheaderbar").show();
    $(this).hide();
    $("body").addClass("overflow-hide");
    setTimeout(function () {
      $(".public-header .top-nav").addClass("transition in");
    }, 100);
    var headerWarningHeigt = $(".header-top").outerHeight(),
      scrollTop = $(window).scrollTop(),
      headerHeight = $(".public-header").height(),
      topNavHeight = $(window).height() - headerHeight;
    if (scrollTop >= headerWarningHeigt) {
      $(".public-header .top-nav").css({
        top: headerHeight,
        height: topNavHeight,
      });
    } else {
      var top = headerWarningHeigt - scrollTop + headerHeight;
      topNavHeight =
        $(window).height() - (headerWarningHeigt - scrollTop) - headerHeight;
      $(".public-header .top-nav").css({ top: top, height: topNavHeight });
    }
  });
  if ($(window).width() <= 1200) {
    $(".top-nav li:not(.showlanguagebox)").click(function () {
      $("body").removeClass("overflow-hide");
    });
  }
  $(".closeheaderbar").click(function () {
    $(".top-nav").removeClass("in");
    $(".openheaderbar").show();
    $(this).hide();
    setTimeout(function () {
      $(".public-header").css("overflow", "hidden");
    }, 300);
    $("body").removeClass("overflow-hide");
  });

  function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      return true;
    } else {
      return false;
    }
  }
  function isIE11() {
    if (/Trident\/7\./.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }

  // calculate ScrollBar width
  function getScrollbarWidth() {
    var oP = document.createElement("p"),
      styles = {
        width: "100px",
        height: "100px",
        overflowY: "scroll",
      },
      i,
      scrollbarWidth;
    for (i in styles) oP.style[i] = styles[i];
    document.body.appendChild(oP);
    scrollbarWidth = oP.offsetWidth - oP.clientWidth;
    if (isIE() || isIE11()) {
      oP.parentNode.removeChild(oP);
    } else {
      oP.remove();
    }

    return scrollbarWidth;
  }

  var scrollWidth = getScrollbarWidth();

  // handle Navigation Bar Offset problem
  function avoidPageOffset(type) {
    if (scrollWidth != 0) {
      if ($("body").hasClass("overflow-hide")) {
        $("html").css("marginRight", scrollWidth);
        $(".navbar").css("paddingRight", scrollWidth);
        $(".nav-sec-pd").css("paddingRight", scrollWidth);

        if (type == "navbar") {
          $(".mainMenu").css("marginRight", scrollWidth);
          $(".mainMenu-open .mainMenu").css("right", -scrollWidth);
        }
      } else {
        $("html").css("marginRight", "0");
        $(".navbar").css("paddingRight", "0");
        $(".nav-sec-pd").css("paddingRight", "0");

        if (type == "navbar") {
          $(".mainMenu").css("marginRight", 0);
          $(".mainMenu").css("right", "-450px");
        }
      }
    }
  }

  $(".footer .button-subscribe").click(function () {
    let email = $.trim(
      $(this).parents(".footer").find("input[name='subscribe']").val()
    );
    if (email.length === 0) {
      layui.use(["tips"], function (exports) {
        layui.tips.tips().error("This field is required.");
      });
      return false;
    }
    var v_regex = /^[a-zA-Z0-9].{0,34}@[a-zA-Z0-9].{0,29}$/;
    if (!v_regex.test(email)) {
      layui.use(["tips"], function (exports) {
        layui.tips.tips().error("Invalid email address.");
      });
      return false;
    }
    $.post(
      "/home/subscribe",
      { email: email },
      function (response) {
        if (response.success) {
          layui.use(["tips"], function () {
            layui.tips.tips().success(response.message);
          });
        } else {
          layui.use(["tips"], function () {
            layui.tips.tips().error(response.message);
          });
        }
      },
      "json"
    );
  });

  // 返回顶部
  $(".back-to-top").click(function () {
    document.body.scrollIntoView({ behavior: "smooth" });
  });
  if ($(window).width() < 768) {
    $(".footer-nav li .title").click(function () {
      $(this).toggleClass("spread").siblings(".nav-items").slideToggle(200);
    });
  }

  // 18 year confirm
  var confirmAge =
    '<div class="agelimit">\
          <div class="welcome-box frame-adaption">\
              <div class="welcome-icon clearfix">\
                  <div class="logo"></div>\
                  <p>' +
    $.translate("common_age_checker_title") +
    "</p>\
              </div>\
              " +
    $.translate("common_age_checker_desc") +
    '\
              <div class="btn-box">\
              <button id="yearconFirm" class="btn">' +
    $.translate("common_age_checker_yes") +
    '</button>\
              <button id="notPass" class="btn-border" >' +
    $.translate("common_age_checker_no") +
    "</button>\
              </div>\
          </div>\
      </div>";

  var acceptcookies =
    '<div class="agelimit-bottom frame-adaption">\
          <div class="center">\
          <p>' +
    $.translate("common_cookie_tips") +
    '</p>\
          <button id="setCookie" type="button" class="btn-border">' +
    $.translate("common_cookie_accept") +
    "</button>\
          </div>\
      </div>";

  if (
    $.cookie("confirmAge") != "yes" &&
    webData.controller_name + "/" + webData.action_name !=
      "subscribe/exposubscribe" &&
    webData.controller_name + "/" + webData.action_name != "home/security"
  ) {
    $("body").append(confirmAge);
    $("#yearconFirm").click(function () {
      $(".agelimit").remove();
      $.cookie("confirmAge", "yes", { path: "/", expires: 3650 });
      if (
        webData.controller_name + "/" + webData.action_name !=
        "product/mate500index"
      ) {
        if ($.cookie("setSubscribelayer") != "yes") {
          $(this).showSubscribeLayer(2000);
        }
      }
    });
  }

  $("#notPass").click(function () {
    window.location.href = "https://www.google.com/";
  });

  if (
    $.cookie("acceptcookies") != "yes" &&
    webData.controller_name + "/" + webData.action_name !=
      "product/mate500index"
  ) {
    $("body").append(acceptcookies);
    setTimeout(function () {
      $(".agelimit-bottom").addClass("transition2 add ");
    }, 2000);
    $("#setCookie").click(function () {
      $(".agelimit-bottom").removeClass("add");
    });
    $.cookie("acceptcookies", "yes", { path: "/", expires: 3650 });
  }

  $(".simu-input").click(function () {
    $(this).parent().addClass("show");
  });

  $(".simu-select-dropdown li").click(function () {
    $(this).parents().removeClass("show");
    $(this).addClass("active").siblings().removeClass("active");
    $(".input-inner").val($(this).attr("data-text"));
  });

  // tips动画
  $("body").on("change", ".tips-form select", function () {
    $(this).parent().parent().addClass("focus");
  });

  $("body").on("focus", ".tips-form input,.tips-form textarea", function () {
    $(this).parent().parent().addClass("focus");
  });

  $("body").on("blur", ".tips-form input,.tips-form textarea", function () {
    if ($(this).val() == "") {
      $(this).parent().parent().removeClass("focus");
    }
  });
  //产品列表提示弹层
  $.fn.showNewsletterLayer = function (showtime) {
    if ($.cookie("setNewsletterLayer") != "yes") {
      var newsletterhtml =
        '<div class="newsletter-tips"><i class="icon-close newsletter-tips-close"></i><img src="/static/images/web/newsletter_tips.jpg" alt=""></div>';
      $("body").append(newsletterhtml);
      $(".newsletter-tips img").click(function () {
        $(".subscribeLayer").remove();
        $(this).showSubscribeLayer(100);
        $(".newsletter-tips").remove();
        $.cookie("setNewsletterLayer", "yes", { path: "/", expires: 3650 });
      });
      $(".newsletter-tips-close").click(function () {
        $(".newsletter-tips").remove();
        $.cookie("setNewsletterLayer", "yes", { path: "/", expires: 3650 });
      });
    }
  };
  if (webData.controller_name + "/" + webData.action_name == "product/list") {
    $(this).showNewsletterLayer(2000);
  }

  //订阅弹层
  $.fn.showSubscribeLayer = function (showtime) {
    var subscribehtml =
      '<div class="subscribeLayer transition">\
                <i class="icon-close subscribelayer-close"></i>\
                <div class="subscribeLayer-form">\
                    <div class="subscribeLayer-title">' +
      $.translate("subscribe_title") +
      '</span></div>\
                    <div class="subscribeLayer-des">' +
      $.translate("subscribe_subtitle") +
      '</div>\
                    <div class="input-group">\
                        <input type="text" name="subscribe" class="subscribelayer-input" placeholder="Email Address" />\
                        <button type="button" class="subscribelayer-button"><i class="icon-arrow-right"></i></button>\
                        <label class="error-tips"></label>\
                    </div>\
                    <img class="subscribeLayer-welcome" src="/static/images/web/exposubscribe-welcome.svg" alt="">\
                </div>\
                <div class="subscribeLayer-success">\
                    <div>\
                    <i class="icon-check"></i>\
                    <p class="exposubscribe-success-des"></p>\
                    <button type="button" class="btn subscribelayer-close">' +
      $.translate("subscribe_success_close") +
      "</button>\
                    </div>\
                </div>\
            </div>";
    $("body").append(subscribehtml);
    setTimeout(function () {
      $(".subscribeLayer").addClass("up");
    }, showtime);
    $(".subscribeLayer .subscribelayer-close").click(function () {
      $(".subscribeLayer").remove();
    });
    $(".subscribeLayer .subscribelayer-input").keydown(function () {
      $(".subscribeLayer .subscribelayer-input").removeClass("error-tips");
      $(".subscribeLayer label").html("").removeClass("error-tips");
    });
    $(".subscribeLayer .subscribelayer-button").click(function () {
      let email = $.trim($(".subscribeLayer .subscribelayer-input").val());
      if (email.length === 0) {
        $(".subscribeLayer label")
          .html($.translate("subscribe_validation_email_required"))
          .addClass("error-tips");
        $(".subscribeLayer .subscribelayer-input").addClass("error-tips");
        return false;
      }
      var v_regex = /^[a-zA-Z0-9].{0,34}@[a-zA-Z0-9].{0,29}$/;
      if (!v_regex.test(email)) {
        $(".subscribeLayer label")
          .html($.translate("subscribe_validation_email_invalid"))
          .addClass("error-tips");
        $(".subscribeLayer .subscribelayer-input").addClass("error-tips");
        return false;
      }
      $.post(
        "/home/subscribe",
        { email: email, type: 3 },
        function (response) {
          if (response.success) {
            $(".subscribeLayer-form").css("visibility", "hidden");
            $(".subscribeLayer-success").css("display", "flex");
            $(".exposubscribe-success-des").html(response.message);
          } else {
            layui.use(["tips"], function () {
              layui.tips.tips().error(response.message);
            });
          }
        },
        "json"
      );
    });
    $.cookie("setSubscribelayer", "yes", { path: "/", expires: 3650 });
  };

  //产品详情页公共动画
  $.fn.isOnScreen = function () {
    var win = $(window);

    var viewport = {
      top: win.scrollTop(),
      left: win.scrollLeft(),
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height() - this.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return !(
      viewport.right < bounds.left ||
      viewport.left > bounds.right ||
      viewport.bottom < bounds.top ||
      viewport.top > bounds.bottom
    );
  };
  //video openWindow
  $.fn.videoWindow = function (url) {
    $("header,main,footer").addClass("blur");
    var videobody =
      '<div class="videobox"><div class="video-close"><i class="icon-close"></i></div><iframe src="' +
      url +
      '" frameborder="0" allowfullscreen></iframe></video><div class="video-masker"></div>';
    $(videobody).appendTo("body");
    $("body").css("overflow", "hidden");
    setTimeout(function () {
      $(".videobox iframe").addClass("videobox-over");
    }, 500);

    $(".video-masker,.icon-close").click(function () {
      $("body").removeAttr("style");
      $(".videobox").remove();
      $(".blur").removeClass("blur");
    });
  };

  $(window).scroll(function () {
    $(".animation-item").each(function () {
      if ($(this).isOnScreen()) {
        $(this).addClass("animation");
      } else {
        $(this).removeClass("animation");
      }
    });
    if ($(window).scrollTop() < $(".header-top").height() + 60) {
      $(".public-header").removeClass("fixed");
    } else {
      $(".public-header").addClass("fixed");
    }
  });

  // 时、分、秒倒计时
  $.fn.countDownFn = function (endDate) {
    endDate = endDate * 1000;
    var $this = $(this);
    function countDown() {
      var now = new Date().getTime();
      endDate = parseInt(endDate);
      if (endDate < now) {
        if (timer) clearInterval(timer);
        return;
      }
      var ts = endDate - now,
        hh = parseInt(ts / 1000 / 60 / 60, 10),
        mm = parseInt((ts / 1000 / 60) % 60, 10),
        ss = parseInt((ts / 1000) % 60, 10);
      var hs = $this.find(".hours"),
        ms = $this.find(".minute"),
        ses = $this.find(".second");
      hs.text(hh);
      ms.text(mm);
      ses.text(ss);
    }
    var timer = setInterval(countDown, 1000);
  };

  //悬浮框
  function getFloatingButtons(floating_buttons, countryCode) {
    var base_html = "";
    if (floating_buttons.length > 0) {
      for (var i = 0; i < floating_buttons.length; i++) {
        // base_html +='<div class="bottom-drogue"><span><i class="icon-close"></i></span>' +
        //     '<a style="background-image: url('+floating_buttons[i].image+')" target="_blank" href="' + floating_buttons[i].link + '"></a></div>';
        base_html +=
          '<div class="bottom-drogue"><span><i class="icon-close"></i></span>' +
          '<a href="' +
          floating_buttons[i].link +
          '"><img src="' +
          floating_buttons[i].image +
          '"/></a></div>';
      }
      var html = '<div class="bottom-drogue-lists">' + base_html + "</div>";
      $(html).appendTo("body");

      $(".bottom-drogue span").click(function () {
        $(this).parent().remove();
      });
    }
  }

  // 全局私域群组
  function getCommunityLink(communityLinks, countryCode) {
    // 根据国家IP，获取对应的国家群组链接
    var communityLink = "";
    if (communityLinks) {
      communityLink = communityLinks.default_area_link;
      if (communityLinks.links) {
        for (var i = 0; i < communityLinks.links.length; i++) {
          if ($.inArray(countryCode, communityLinks.links[i].countries) != -1) {
            communityLink = communityLinks.links[i].link;
            break;
          }
        }
      }
    }
    $(
      '<div class="bottom-communitylink"><span><i class="icon-close"></i></span><a target="_blank" href="' +
        communityLink +
        '"><img src="' +
        communityLinks.image +
        '"/></a></div>'
    ).appendTo("body");
    $(".bottom-communitylink span").click(function () {
      $(".bottom-communitylink").remove();
    });

    // 首页底部私域入口链接
    $(".elfbar-community .learn-more").attr("href", communityLink);
  }

  function getUrlParams(key) {
    var url = window.location.search.substr(1);
    if (url == "") {
      return false;
    }
    var paramsArr = url.split("&");
    for (var i = 0; i < paramsArr.length; i++) {
      var combina = paramsArr[i].split("=");
      if (combina[0] == key) {
        return combina[1];
      }
    }
    return false;
  }

  var ip_url = createUrl("global/config");

  $.ajax({
    type: "post",
    url: ip_url,
    data: {},
    dataType: "json",
    success: function (result) {
      if (result.success) {
        var countryCode = result.data.country_code;

        // 如果是英国ip展示 UK Store 链接
        if (countryCode == "GB") {
          $(".sale-in-uk").removeClass("hide");
        }

        // 私域群组
        var communityLinks = result.data.community_links;
        getCommunityLink(communityLinks, countryCode);
        getFloatingButtons(result.data.floating_buttons, countryCode);
      }
    },
  });
});

//  canvas 封装
function getCanvasOperationObj(params) {
  // params  imgPath ""     必传递
  // canvasId canvasId     必传递
  // imgTotal 加载的总图片   默认 1
  // imgWidth imgHeight 切图的宽高 默认1920 / 1080
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    console.error("getCanvasOperationObj 方法入参必须是对象");
    return;
  }
  var windowWidth = window.innerWidth;
  var scale = window.devicePixelRatio || (windowWidth < 768 ? 3 : 1);
  var imgPath = params.imgPath;
  var width = params.imgWidth || 1920;
  var height = params.imgHeight || 1080;
  var imgTotal = params.imgTotal || 1;
  // 根据屏幕算比列 是否使用比例生成canvas的宽高;
  var canvasWidth = windowWidth * scale;
  var canvasHeight = Math.floor((height / width) * canvasWidth);
  var canvas = document.getElementById(params.canvasId);
  if (!canvas || !imgPath) {
    console.error("canvas元素和图片加载路径必须传递");
    return;
  }
  var ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = true;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  function currentFrame(imgIndex) {
    if (!imgPath || !imgIndex) {
      return null;
    }
    return imgPath + imgIndex + (params.imgSuffix || ".jpg");
  }
  var images = [];
  for (var i = 1; i <= imgTotal; i++) {
    var img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
  var operationFrame = { frame: 0 };
  currentFrame = null;
  function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(
      images[operationFrame.frame],
      0,
      0,
      canvasWidth,
      canvasHeight
    );
  }
  images[0].onload = render;
  return {
    render: render,
    operationFrame: operationFrame,
    imgTotal: imgTotal,
  };
}
