// JavaScript Document
$(document).ready(function(){
	setNavMenu();//加载菜单效果
	$("a[href*='http://']:not([href*='"+location.hostname+"']),[href*='https://']:not([href*='"+location.hostname+"'])").attr("target","_blank");//处理外部链接
	$(".H_qlinks select").change(function(){
		if($(this).find("option:selected").val() == 0 || $(this).find("option:selected").val() == ''){return false;}
		else{window.open($(this).find("option:selected").val(),'_blank'); $(this).find("option:first").attr("selected","selected");}
	});//处理下拉列表
	autoShow();//新闻图片
	autoImg();//首页大图
    noticeList();//首页公告
	festival();//节日图
	$(".H_news > .H_home_title").mouseover(function(){
		var newsIndex = $(".H_news > .H_home_title").index(this);
		$(".H_news > .H_home_title .E235").removeClass('E235');
		$(".H_news > .H_home_title .H_home_title_en").eq(newsIndex).addClass('E235');
		$(".H_news > .H_home_title .H_home_title_ch").eq(newsIndex).addClass('E235');
		$(".H_news > .H_news_list:visible").hide();
		$(".H_news > .H_news_list").eq(newsIndex).show();
	});//新闻和媒体湖大标题效果
});

function festival(){
	var Len = $(".H_festival a").length;
	var Lheight=$(".H_festival a img").height();
	if(Len == 1){
		$(".H_festival").animate({height:Lheight+"px"},1500);
		$(".H_festival a").click(function(){
			$(this).parent(".H_festival").animate({height:"0px"},1000);
		});
		setTimeout(function(){$(".H_festival").animate({height:"0px"},1000);}, 9500);
	}
}//首页节日图

function noticeList(){
	var len  = $(".H_notice_list ul li").length;
	var h = $(".H_notice_list ul li").outerHeight(true);
	var top = 0;
	$(".H_notice_list ul").append($(".H_notice_list ul").html());
	//自动开始
	var myTime = setInterval(function(){
		top--;
		$(".H_notice_list ul li:first").css("marginTop", top);
		if(top <= -(len*h)) top = 0;
	}, 100);
	//滑入停止动画，滑出开始动画.
	$(".H_notice_list ul").hover(
		function(){
			clearInterval(myTime);
		},function(){
			myTime = setInterval(function(){
				top--;
				$(".H_notice_list ul li:first").css("marginTop", top);
				if(top <= -(len*h)) top = 0;
			}, 100);
		});
}//公告滚动

function autoShow(){
	var Index = 1;
	var Len = $(".H_news_imgs ul li").length;
	setInterval(function(){imgShow(Index); Index++; if(Index == Len){Index = 0;}},5000);
	function imgShow(i){
		$(".H_news_imgs ul li:visible").fadeOut("slow");
		$(".H_news_imgs ul li").eq(i).fadeIn("slow");
	}
}//新闻图片

function autoImg(){
	var Index = 1;
	var Len = $(".H_banner_imgs a").length;
	if(Len > 1){
		//生成数字
		for(var i=1; i <= Len; i++){
			$(".H_banner_imgs p").html($(".H_banner_imgs p").html()+"<i>"+i+"</i>");
		}
		//自动开始
		var myInt = setInterval(function(){imgShow(Index); Index++; if(Index == Len){Index = 0;}},5000);
		//数字触发
		$(".H_banner_imgs p i").hover(function(){
			clearInterval(myInt);
			var n = $(".H_banner_imgs p i").index(this);
			imgShow(n);
			n++;
			if(n == Len){n = 0;}
			Index = n;
		},function(){
			myInt = setInterval(function(){imgShow(Index); Index++; if(Index == Len){Index = 0;}},5000);
		});
	}
	//动画函数
	function imgShow(i){
		$(".H_banner_imgs p i").removeClass("hover");
		$(".H_banner_imgs p i").eq(i).addClass("hover");
		$(".H_banner_imgs a:visible").fadeOut("slow");
		$(".H_banner_imgs a").eq(i).fadeIn("slow");
	}
}//首页大图滚动

var lastNavIndex=0;
function setNavMenu()
{
	var j = 1;
	$(".H_nav > ul > li").click(function(){
		i = $(".H_nav > ul >li").index(this)+1;
		$(".H_after_"+j).removeClass('H_after_'+j);
		$(this).addClass('H_after_'+i);
		j = i;
		if(lastNavIndex!=i)
		{
			lastNavIndex=i;
			$("#menubg").stop();
			$(".menu").stop();
			$("#menubg").css('left', '-135px');
			$(".menu").css('left','-135px');
			$("#menubg").animate( {left: "0px"},400);
			$("#menu"+i).animate( {left: "0px"},400);

		}else{
			lastNavIndex=0;
			$("#menubg").animate( {left: "-135px"},400);
			$(".menu").animate( {left: "-135px"},400);

		}				
	});
}//菜单