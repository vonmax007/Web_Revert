
$(function(){
	var numpic = $('.banner .banner_pic li').size()-1;
	var nownow = 0;
	var inout = 0;
	var TT = 0;
	var SPEED = 5000;


	$('.banner .banner_pic li').eq(0).siblings('li').css({'display':'none'});


	var ulstart = '<ul id="pagination">',
		ulcontent = '',
		ulend = '</ul>';
	ADDLI();
	var pagination = $('#pagination li');
	var paginationwidth = $('#pagination').width();
	$('#pagination').css('margin-left',(-50))
	
	pagination.eq(0).addClass('current')
		
	function ADDLI(){
		//var lilicount = numpic + 1;
		for(var i = 0; i <= numpic; i++){
			ulcontent += '<li>' + '<a href="javascript:void(0)">' + (i+1) + '</a>' + '</li>';
		}
		
		$('.banner .banner_pic').after(ulstart + ulcontent + ulend);	
	}

	pagination.on('click',DOTCHANGE)
	
	function DOTCHANGE(){
		
		var changenow = $(this).index();
		
		$('.banner .banner_pic li').eq(nownow).css('z-index','900');
		$('.banner .banner_pic li').eq(changenow).css({'z-index':'800'}).show();
		pagination.eq(changenow).addClass('current').siblings('li').removeClass('current');
		$('.banner .banner_pic li').eq(nownow).fadeOut(400,function(){$('.banner .banner_pic li').eq(changenow).fadeIn(500);});
		nownow = changenow;
	}
	
	pagination.mouseenter(function(){
		inout = 1;
	})
	
	pagination.mouseleave(function(){
		inout = 0;
	})
	
	function GOGO(){
		
		var NN = nownow+1;
		
		if( inout == 1 ){
			} else {
			if(nownow < numpic){
			$('.banner .banner_pic li').eq(nownow).css('z-index','900');
			$('.banner .banner_pic li').eq(NN).css({'z-index':'800'}).show();
			pagination.eq(NN).addClass('current').siblings('li').removeClass('current');
			$('.banner .banner_pic li').eq(nownow).fadeOut(400,function(){$('.banner .banner_pic li').eq(NN).fadeIn(500);});
			nownow += 1;

		}else{
			NN = 0;
			$('.banner .banner_pic li').eq(nownow).css('z-index','900');
			$('.banner .banner_pic li').eq(NN).stop(true,true).css({'z-index':'800'}).show();
			$('.banner .banner_pic li').eq(nownow).fadeOut(400,function(){$('.banner .banner_pic li').eq(0).fadeIn(500);});
			pagination.eq(NN).addClass('current').siblings('li').removeClass('current');

			nownow=0;

			}
		}
		TT = setTimeout(GOGO, SPEED);
	}
	
	TT = setTimeout(GOGO, SPEED); 

})






$(function(){
	var numpic = $('#in_news-two_right-a .in_news-two_right-b').size()-1;
	var nownow = 0;
	var inout = 0;
	var TT = 0;
	var SPEED = 5000;


	$('#in_news-two_right-a .in_news-two_right-b').eq(0).siblings('li').css({'display':'none'});


	var ulstart = '<ul id="pagination_one">',
		ulcontent = '',
		ulend = '</ul>';
	ADDLI();
	var pagination_one = $('#pagination_one li');
	var pagination_onewidth = $('#pagination_one').width();
	$('#pagination_one').css('margin-left',-pagination_onewidth*0.5+"px")
	
	pagination_one.eq(0).addClass('current')
		
	function ADDLI(){
		//var lilicount = numpic + 1;
		for(var i = 0; i <= numpic; i++){
			ulcontent += '<li>' + '<a href="javascript:void(0)">' + (i+1) + '</a>' + '</li>';
		}
		
		$('#in_news-two_right-a').after(ulstart + ulcontent + ulend);	
	}

	pagination_one.on('click',DOTCHANGE)
	
	function DOTCHANGE(){
		
		var changenow = $(this).index();
		
		$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).css('z-index','900');
		$('#in_news-two_right-a .in_news-two_right-b').eq(changenow).css({'z-index':'800'}).show();
		pagination_one.eq(changenow).addClass('current').siblings('li').removeClass('current');
		$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-a #in_news-two_right-b').eq(changenow).fadeIn(500);});
		nownow = changenow;
	}
	
	pagination_one.mouseenter(function(){
		inout = 1;
	})
	
	pagination_one.mouseleave(function(){
		inout = 0;
	})
	
	function GOGO(){
		
		var NN = nownow+1;
		
		if( inout == 1 ){
			} else {
			if(nownow < numpic){
			$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).css('z-index','900');
			$('#in_news-two_right-a .in_news-two_right-b').eq(NN).css({'z-index':'800'}).show();
			pagination_one.eq(NN).addClass('current').siblings('li').removeClass('current');
			$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-a .in_news-two_right-b').eq(NN).fadeIn(500);});
			nownow += 1;

		}else{
			NN = 0;
			$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).css('z-index','900');
			$('#in_news-two_right-a .in_news-two_right-b').eq(NN).stop(true,true).css({'z-index':'800'}).show();
			$('#in_news-two_right-a .in_news-two_right-b').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-a .in_news-two_right-b').eq(0).fadeIn(500);});
			pagination_one.eq(NN).addClass('current').siblings('li').removeClass('current');

			nownow=0;

			}
		}
		TT = setTimeout(GOGO, SPEED);
	}
	
	TT = setTimeout(GOGO, SPEED); 

})




$(function(){
	var numpic = $('#in_news-two_right-aa .in_news-two_right-ba').size()-1;
	var nownow = 0;
	var inout = 0;
	var TT = 0;
	var SPEED = 5000;


	$('#in_news-two_right-aa .in_news-two_right-ba').eq(0).siblings('li').css({'display':'none'});


	var ulstart = '<ul id="pagination_two">',
		ulcontent = '',
		ulend = '</ul>';
	ADDLI();
	var pagination_two = $('#pagination_two li');
	var pagination_twowidth = $('#pagination_two').width();
	$('#pagination_two').css('margin-left',-pagination_twowidth*0.5+"px")
	
	pagination_two.eq(0).addClass('current')
		
	function ADDLI(){
		//var lilicount = numpic + 1;
		for(var i = 0; i <= numpic; i++){
			ulcontent += '<li>' + '<a href="javascript:void(0)">' + (i+1) + '</a>' + '</li>';
		}
		
		$('#in_news-two_right-aa').after(ulstart + ulcontent + ulend);	
	}

	pagination_two.on('click',DOTCHANGE)
	
	function DOTCHANGE(){
		
		var changenow = $(this).index();
		
		$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).css('z-index','900');
		$('#in_news-two_right-aa .in_news-two_right-ba').eq(changenow).css({'z-index':'800'}).show();
		pagination_two.eq(changenow).addClass('current').siblings('li').removeClass('current');
		$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-aa .in_news-two_right-ba').eq(changenow).fadeIn(500);});
		nownow = changenow;
	}
	
	pagination_two.mouseenter(function(){
		inout = 1;
	})
	
	pagination_two.mouseleave(function(){
		inout = 0;
	})
	
	function GOGO(){
		
		var NN = nownow+1;
		
		if( inout == 1 ){
			} else {
			if(nownow < numpic){
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).css('z-index','900');
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(NN).css({'z-index':'800'}).show();
			pagination_two.eq(NN).addClass('current').siblings('li').removeClass('current');
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-aa #in_news-two_right-ba').eq(NN).fadeIn(500);});
			nownow += 1;

		}else{
			NN = 0;
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).css('z-index','900');
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(NN).stop(true,true).css({'z-index':'800'}).show();
			$('#in_news-two_right-aa .in_news-two_right-ba').eq(nownow).fadeOut(400,function(){$('#in_news-two_right-aa #in_news-two_right-ba').eq(0).fadeIn(500);});
			pagination_two.eq(NN).addClass('current').siblings('li').removeClass('current');

			nownow=0;

			}
		}
		TT = setTimeout(GOGO, SPEED);
	}
	
	TT = setTimeout(GOGO, SPEED); 

})