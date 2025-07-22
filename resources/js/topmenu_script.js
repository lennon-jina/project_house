$(document).ready(function(){
	$("#sh_nav").mouseenter(function(){
		$("#sh_nav_wrap").addClass("on");
	 	$(".sh_nav_s").fadeIn(300);
		$(".top_nav_bg").slideDown(200);	
	}).mouseleave(function(){
		$("#sh_nav_wrap").removeClass("on");
		$('.sh_nav_s').stop().fadeOut(200);
	  	$('.top_nav_bg').stop().slideUp(300);
	});
	
	$(".pf_cate ul li > a").hover(function(){
		$(".pf_cate ul li > a").not(this).addClass("off");
	}, function() {
		$(".pf_cate ul li > a").removeClass("off");
	});	

    $("#sh_top_logo").delay(200).animate({"top":"50%"},1500,'easeOutQuint');
    $("#pfBtn").delay(200).animate({"top":"50%"},1500,'easeOutQuint');	
    
    
    /* 메뉴오픈 이미지 */
    $("#pfSlide>li").eq(0).show();
    var in_b = 0;
    function in01_loop(){
        if(in_b>$("#pfSlide>li").index()-1){
            in_b=0;	
        }else {
            in_b++;
        };
        $("#pfSlide>li").fadeOut(1000);
        $("#pfSlide>li").eq(in_b).stop().fadeIn(1000);
    };
    var in01 = setInterval(in01_loop,3000);	
    $(window).on("scroll",function(){
        if($(window).scrollTop() > 50) { 
            $('#sh_nav_wrap').addClass("fixed");
        } else{
            $('#sh_nav_wrap').removeClass("fixed");
         }
        return false;
    });
    
    pfBtn = $("#pfBtn");
    pfWrap = $("#pfWrap");
    $('.nav_deco').css({"right":"-30%"});
    $('.pf_cate ul li').css({"margin-left:":"100px","opacity:":"0"});
    m = 0;  

    /* 닫기 */
    function navClose() { 
        $("body").removeClass("open")
        pfBtn.addClass("no_pointer")					
        setTimeout(function() {pfBtn.removeClass("no_pointer")},1000); 
        if($(window).scrollTop() > 50) { 
            $("img",pfBtn).attr("src","img/btn.png");
        } else{
            $("img",pfBtn).attr("src","img/btn.png");
        }	
        $('.pf_cate').delay(0).animate({"width":"0%"},600,'easeInQuart').delay(350).animate({"width":"0"},0);	
        pfWrap.delay(700).fadeOut(250).animate({"right":"-100%"});
        $('.pf_cate ul li').delay(0).animate({"margin-left":"100px","opacity":"0"},300,'easeOutQuart');
        $("#pfVisual").delay(0).animate({"width":"0","opacity":"0"},600,'easeOutQuart');
        
    }

    pfBtn.click(function(){
        m++;
        if(m%2 == 1){
            /* 열기 */
            $("body").addClass("open")
            pfBtn.addClass("no_pointer")					
            setTimeout(function() {pfBtn.removeClass("no_pointer")}, 900);//클릭방지
            $("img",this).attr("src","img/close.png");
            $('.pf_cate').show().delay(300).animate({"width":"50%"},700,'easeOutQuart');
            pfWrap.show().delay(0).animate({"right":"0"},600,'easeOutQuart');	
            $('.pf_cate ul li:eq(0)').delay(400).animate({"margin-left":"0","opacity":"1"},600,'easeOutQuart');
            $('.pf_cate ul li:eq(1)').delay(500).animate({"margin-left":"0","opacity":"1"},600,'easeOutQuart');
            $('.pf_cate ul li:eq(2)').delay(600).animate({"margin-left":"0","opacity":"1"},600,'easeOutQuart');
            $('.pf_cate ul li:eq(3)').delay(700).animate({"margin-left":"0","opacity":"1"},600,'easeOutQuart');
            $('.pf_cate ul li:eq(4)').delay(800).animate({"margin-left":"0","opacity":"1"},600,'easeOutQuart');
            $("#pfVisual").delay(400).animate({"width":"500px","opacity":"1"},1000,'easeOutQuart');
        }else{
            navClose(); 
        }; 
    });
});


/* 메뉴라인 */
window.onload = function () {

    var menuLine = document.querySelector('#menuLine');
    var activeMenuCoords = document.querySelector('.menu-item.active').getBoundingClientRect();
    menuLine.style.left = activeMenuCoords.left + 'px';
    menuLine.style.width = activeMenuCoords.width + 'px';

    var menuItem = document.querySelectorAll('.menu-item');
    for (var i = 0; i < menuItem.length; i++) {
        menuItem[i].addEventListener("mouseenter", enter);
        menuItem[i].addEventListener('mouseleave', leave);
        menuItem[i].addEventListener('click', click)
    }

    function enter() {
        activeMenuCoords = this.getBoundingClientRect();
        menuLine.style.left = activeMenuCoords.left + 'px';
        menuLine.style.width = activeMenuCoords.width + 'px';
    }
    function leave() {
        activeMenuCoords = document.querySelector('.menu-item.active').getBoundingClientRect();
        menuLine.style.left = activeMenuCoords.left + 'px';
        menuLine.style.width = activeMenuCoords.width + 'px';
    }
    function click() {
        for (var i = 0; i < menuItem.length; i++) {
            menuItem[i].classList.remove('active');
        }
        this.classList.add('active');
        activeMenuCoords = this.getBoundingClientRect();
        menuLine.style.left = activeMenuCoords.left + 'px';
        menuLine.style.width = activeMenuCoords.width + 'px';
    }

    window.onresize = function () {
        activeMenuCoords = document.querySelector('.menu-item.active').getBoundingClientRect();
        menuLine.style.left = activeMenuCoords.left + 'px';
        menuLine.style.width = activeMenuCoords.width + 'px';
    }
}	