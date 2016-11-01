jQuery(document).ready(function($){

    var contentSections = $('body .nav-section');
    //smooth scroll to the selected section
    $('.cd-main-nav a[href^="#"]').click(function(event){
        event.preventDefault();

        var target= $(this.hash),
            topMargin = target.css('marginTop').replace('px', ''),
            hedearHeight = $('header').height();
        $('body,html').animate({'scrollTop': parseInt(target.offset().top - hedearHeight - topMargin)}, 450);

        $('.cd-main-nav').find('li').removeClass('selected-nav');
        $('li.'+target.selector.replace('#', '')).addClass('selected-nav');
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
                actualAnchor.parent('li').addClass('selected-nav');
            }else {
                actualAnchor.parent('li').removeClass('selected-nav');
            }
        });
    }

    var resizing = false,
        navigationWrapper = $('.cd-main-nav-wrapper'),
        navigation = navigationWrapper.children('.cd-main-nav'),
        searchForm = $('.cd-main-search'),
        pageContent = $('.cd-main-content'),
        searchTrigger = $('.cd-search-trigger'),
        coverLayer = $('.cd-cover-layer'),
        navigationTrigger = $('.cd-nav-trigger'),
        mainHeader = $('.cd-main-header');

    function checkWindowWidth() {
        var mq = window.getComputedStyle(mainHeader.get(0), '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
        return mq;
    }

    function checkResize() {
        if( !resizing ) {
            resizing = true;
            (!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
        }
    }

    function moveNavigation(){
        var screenSize = checkWindowWidth();
        if ( screenSize == 'desktop' && (navigationTrigger.siblings('.cd-main-search').length == 0) ) {
            //desktop screen - insert navigation and search form inside <header>
            searchForm.detach().insertBefore(navigationTrigger);
            navigationWrapper.detach().insertBefore(searchForm).find('.cd-serch-wrapper').remove();
        } else if( screenSize == 'mobile' && !(mainHeader.children('.cd-main-nav-wrapper').length == 0)) {
            //mobile screen - move navigation and search form after .cd-main-content element
            navigationWrapper.detach().insertAfter('.cd-main-content');
            var newListItem = $('<li class="cd-serch-wrapper"></li>');
            searchForm.detach().appendTo(newListItem);
            newListItem.appendTo(navigation);
        }

        resizing = false;
    }

    function closeSearchForm() {
        searchTrigger.removeClass('search-form-visible');
        searchForm.removeClass('is-visible');
        coverLayer.removeClass('search-form-visible');
    }

    //add the .no-pointerevents class to the <html> if browser doesn't support pointer-events property
    ( !Modernizr.testProp('pointerEvents') ) && $('html').addClass('no-pointerevents');

    //move navigation and search form elements according to window width
    moveNavigation();
    $(window).on('resize', checkResize);

    //mobile version - open/close navigation
    navigationTrigger.on('click', function(event){
        event.preventDefault();
        mainHeader.add(navigation).add(pageContent).toggleClass('nav-is-visible');
    });

    searchTrigger.on('click', function(event){
        event.preventDefault();
        if( searchTrigger.hasClass('search-form-visible') ) {
            searchForm.find('form').submit();
        } else {
            searchTrigger.addClass('search-form-visible');
            coverLayer.addClass('search-form-visible');
            searchForm.addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                searchForm.find('input[type="search"]').focus().end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            });
        }
    });

    //close search form
    searchForm.on('click', '.close', function(){
        closeSearchForm();
    });

    coverLayer.on('click', function(){
        closeSearchForm();
    });

    $(document).keyup(function(event){
        if( event.which=='27' ) closeSearchForm();
    });

    // upadate span.selected-value text when user selects a new option
    searchForm.on('change', 'select', function(){
        searchForm.find('.selected-value').text($(this).children('option:selected').text());
    });
});