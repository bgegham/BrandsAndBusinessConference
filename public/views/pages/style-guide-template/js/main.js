jQuery(document).ready(function($){

	var contentSections = $('main section');
	//smooth scroll to the selected section
	$('.cd-main-nav a[href^="#"]').on('click', function(event){
        event.preventDefault();
        $('header').removeClass('nav-is-visible');
        var target= $(this.hash),
        	topMargin = target.css('marginTop').replace('px', ''),
        	hedearHeight = $('header').height();
        $('body,html').animate({'scrollTop': parseInt(target.offset().top - hedearHeight - topMargin)}, 200); 
    });
    //update selected navigation element
    $(window).on('scroll', function(){
    	updateNavigation();
    });
    function updateNavigation() {
		contentSections.each(function(){
			var actual = $(this),
				actualHeight = actual.height(),
				topMargin = actual.css('marginTop').replace('px', ''),
				actualAnchor = $('.cd-main-nav').find('a[href="#'+actual.attr('id')+'"]');
			
			if ( ( parseInt(actual.offset().top - $('.cd-main-nav').height() - topMargin )<= $(window).scrollTop() ) && ( parseInt(actual.offset().top +  actualHeight - topMargin )  > $(window).scrollTop() +1 ) ) {
				actualAnchor.addClass('selected');
			}else {
				actualAnchor.removeClass('selected');
			}
		});
	}
});