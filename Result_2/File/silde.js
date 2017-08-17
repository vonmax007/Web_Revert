$(window).load(function () {
    bannerflide();
    fadeSlider($(".newsbox"), $(".hnnews ul li"), $(".newnum"));
    $(".acadl ul li:last").css("margin-right", "0");
    $(".navP").hover(function () {
        $(this).siblings(".navchild").show();
        $(this).parent(".navli").siblings(".navli").find(".navchild").hide();
    });
    $(".navchild").hover(function () {}, function () {
        $(this).hide();
    });
    $(".top_jy").each(function () {
        $(this).click(function () {
            $(".jiaoyu").hide();
            $(this).find(".jiaoyu").show();
        });
    });
    $(".jiaoyu").hover(function () {}, function () {
        $(this).hide();
    });
    $(".newsnotice a").hover(function () {
        $(".N_note").show();
    });
    $(".N_note").hover(function () {}, function () {
        $(this).hide();
    });
    $(".fenleinew span").hover(function () {
        $(".fenleinew div").show("slow");
    });
    $(".fenleinew div").hover(function () {}, function () {
        $(this).hide();
    });
});

function bannerflide() {
    var index = 0,
        len = $(".imgbox .img").length,
        i, str;
    var W = $(window).width();
    if (W > 1600) {
        W = 1600;
    }
    $(".imgbox .img").css("width", W);
    $(".imgbox").css("width", W);
    var L = ($(".imgbox").width() - 1170) / 2;
    var H = $(".img:first").height();
    $(".directionNav").css("left", L);
    $(".directionNav a").css("top", H / 2 + 35);
    if (len > 1) {
        str = "<i class='act'></i>";
        for (i = 1; i < len; i++)
            str += "<i></i>";
        str += "<div class='c'></div>";
        $(".imgnum").html(str);
        var g = setInterval(function () {
            runSilde(1);
        }, 7000);
        $(".prevNav").click(function () {
            clearInterval(g)
            runSilde(-1);
            g = setInterval(function () {
                runSilde(1);
            }, 7000);
        });
        $(".nextNav").click(function () {
            clearInterval(g)
            runSilde(1);
            g = setInterval(function () {
                runSilde(1);
            }, 7000);
        });

        function runSilde(n) {
            if (n > 0) {
                index++;
                if (index > len - 1)
                    index = 0;
                $(".rollbox").animate({
                    marginLeft: "-=" + W
                }, "slow", function () {
                    $(".rollbox .img:first").insertAfter(".rollbox .img:last");
                    $(".rollbox").css("margin-left", "0");
                    $(".imgnum .act").removeClass("act");
                    $(".imgnum i").eq(index).addClass("act");
                });
            } else {
                index--;
                if (index < 0)
                    index = len - 1;
                $(".rollbox .img:last").insertBefore(".rollbox .img:first");
                $(".rollbox").css("margin-left", "-" + W + "px");
                $(".rollbox").animate({
                    marginLeft: "+=" + W
                }, "slow", function () {
                    $(".imgnum .act").removeClass("act");
                    $(".imgnum i").eq(index).addClass("act");
                });
            }
        }
    }
}

function fadeSlider(_this, imgnote, numnote) {
    var timebigBanner = 6000;
    //var screenpanelbigBanner = _this.find(imgnote);
    var btnpanelbigBanner = _this.find(numnote);
    var lenbigBanner = _this.find(imgnote).size();
    var templateLibigBanner = [];
    var indexbigBanner = 0;
    var timesetbigBanner;
    _this.find(imgnote).eq(0).addClass("current");
    for (var i = 0; i < lenbigBanner; i++) {
        templateLibigBanner.push("<i>&nbsp;</i>");
    }
    btnpanelbigBanner.append(templateLibigBanner.join("") + '<div class="c"></div>');
    btnpanelbigBanner.find("i").eq(0).addClass('act');
    _this.hover(function () {
        if (timesetbigBanner) {
            clearInterval(timesetbigBanner);
        }
    }, function () {
        if (lenbigBanner != 1) {
            timesetbigBanner = setInterval(function () {
                indexbigBanner++;
                if (indexbigBanner >= lenbigBanner) {
                    indexbigBanner = 0;
                }
                swiftbigBanner(indexbigBanner);
            }, timebigBanner);
        }
    });
    if (lenbigBanner != 1) {
        var timesetbigBanner = setInterval(function () {
            swiftbigBanner(indexbigBanner);
            indexbigBanner++;
            if (indexbigBanner >= lenbigBanner) {
                indexbigBanner = 0;
            }
        }, timebigBanner);
    }
    btnpanelbigBanner.find("i").click(function () {
        indexbigBanner = btnpanelbigBanner.find("i").index(this);
        btnpanelbigBanner.find("i").removeClass('act');
        btnpanelbigBanner.find("i").eq(indexbigBanner).addClass('act');
        _this.find($(".current")).hide().removeClass("current");
        _this.find(imgnote).eq(indexbigBanner).fadeIn(1200).addClass("current");
    });

    function swiftbigBanner(i) {
        var indexbigBanner = i && parseInt(i) ? i : 0;
        //var lidombigBanner = screenpanelbigBanner;
        var currentDombigBanner = _this.find(".current");
        var nextbigBanner = indexbigBanner + 1 >= lenbigBanner ? 0 : indexbigBanner + 1;
        btnpanelbigBanner.find("i").removeClass('act');
        btnpanelbigBanner.find("i").eq(nextbigBanner).addClass('act');
        currentDombigBanner.hide().removeClass("current");
        _this.find(imgnote).eq(nextbigBanner).fadeIn(1200).addClass("current");
    