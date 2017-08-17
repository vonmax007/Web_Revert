// JavaScript Document
function setcookie(name,value,path){  
	var Days = 30;  
	var exp  = new Date(); 
	exp.setTime(exp.getTime() + Days*24*60*60*1000);  
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=" + path;
}

function getcookie(name){  
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null){  
		return unescape(arr[2]);  
	}else{  
		return "";  
	}  
}

function delcookie(name,value,path){
		var Days = 0;  
	var exp  = new Date(); 
	exp.setTime(exp.getTime() + Days*24*60*60*1000);  
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=" + path;
}

var lastFaqIndex=0;
function setFaq()
{
	$("div.faqtitle").click(function(){
		i = $("div.faqtitle").index(this)+1; 
		if(lastFaqIndex!=i)
		{
			$("div.faqtitle").next().slideUp('slow');
			$(this).next().slideDown('slow');
			lastFaqIndex=i;
		}else{
			$(this).next().slideUp('slow');
			lastFaqIndex=0;
		}				
	});
}

$(document).ready(function(){
	setFaq();
	var str = getcookie("newstextcss");
	if(str == "bigtext"){$("#newstext").addClass("bigtext");}

	$(".H_nav_list").click(function(){
		if($(this).next().css('display') == "none"){
			$(".H_cmenu:visible").slideUp('slow');
			$(".H_nav_active").removeClass("H_nav_active").addClass("H_nav_still");
			$(this).removeClass("H_nav_still").addClass("H_nav_active");
			$(this).next().slideDown('slow');
		}
		else $(this).next().slideUp('slow');
	});
	
	$(".H_nav_list").hover(
		function(){$(this).removeClass("H_nav_still").addClass("H_nav_activo");},
		function(){$(this).removeClass("H_nav_activo").addClass("H_nav_still");}
	);

    var hover = 0;
	$(".H_cmenu > ul > li:even").hover(
		function(){
			if($(this).hasClass("action")){hover = 1;}
			else {$(this).addClass('action');}
        },
		function(){
			if(hover == 1){hover = 0;}
			else {$(this).removeClass('action');}
        }
	);

	$("a.small").click(
		function(){
		$("#newstext").removeClass("bigtext");
        delcookie("newstextcss","smalltext","/");
	});

	$("a.large").click(
		function(){
		$("#newstext").addClass("bigtext");
        setcookie("newstextcss","bigtext","/");
	});
	
	if(0 < selfclassid < 8){
		$(".H_nav_list").eq(selfclassid).addClass("H_nav_active");
		$("#n"+selfclassid).css('display','block');
	}
	if(7 < selfclassid < 50 && bclassid != 0){
		$("#n"+selfclassid).addClass('action');
		$("#n"+selfclassid).parent().parent().css('display','block');
		$("#n"+selfclassid).parent().parent().prev().addClass("H_nav_active");
	}
	if(selfclassid > 49){
		if(selfclassid == 222 || selfclassid == 291 || selfclassid >= 355){
			$(".H_nav_list").eq(0).addClass("H_nav_active");
		}
		if(bclassid  < 50){
			$("#n"+bclassid).addClass('action');
			$("#n"+bclassid).parent().parent().css('display','block');
			$("#n"+bclassid).parent().parent().prev().addClass("H_nav_active");
		}
		if(bclassid > 49){
			d = $("div.classid").attr("id");
			$("#n"+d).addClass('action');
			$("#n"+d).parent().parent().css('display','block');
            $("#n"+d).parent().parent().prev().addClass("H_nav_active");
		}
	}

	$("a.clickme").click(
		function(){
		j = $("a.clickme").index(this);
		$(this).before("<div class='H_content'></div><div class='H_whitebg'></div>");
		$(".H_imgarea").css("display","block");
		$(".H_right_nav ul li:eq("+j+")").addClass('show');
		$(".photo:eq("+j+")").css('display','block');
		}
	);
	$(".H_close").click(
		function(){
		$(".H_content").remove();
		$(".H_whitebg").remove();
		$(".H_imgarea").css("display","none");
		$(".show").removeClass('show');
		}
	);
	$(".H_right_nav ul li a").click(
		function(){
		l = $(".H_right_nav ul li").index($(this).parent()[0]);
		$(".show").removeClass('show');
		$(".photo").css('display','none');
		$(this).parent().addClass('show');
		$(".photo:eq("+l+")").css('display','block');
		return false;
		}
	)