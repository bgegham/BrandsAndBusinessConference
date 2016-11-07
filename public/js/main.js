$(document).ready(function(){

    setTimeout(function(){
        $.get("http://ip-api.com/json", function(response) {
            if(response.country == "Armenia") {
                $('#monthly-2').click();
                $('.armAg').click();
            }else {
                $('#yearly-2').click();
            }
        }, "jsonp");
        $('body').addClass('ready-load');
    },500);

    $('.agenda-control').on('click', function () {
        $($(this).data('target')).collapse('toggle');
    });
    // show notification
    switch (getCookie('sns')) {
        case 'true':
            $('.alert').addClass(getCookie('snc'));
            $('.alert').find('strong').html(getCookie('snm'));
            $('.alert-control').show();
            document.cookie = 'sns=' + 'false' + ';path=/;';
            break;
        default:
            break;
    }
    // hide notification
    setTimeout(function () {
        $(".alert").fadeOut('slow');
    }, 2500);

    $(window).bind("scroll", function() {
        if ( this .pageYOffset < 400){
            $('.scrollToTop').fadeOut();
        } else {
            $('.scrollToTop').fadeIn();
        }
    });

    $('.scrollToTop').on('click touch', function (e) {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 500);
        e.preventDefault();
    });
    function contactUs() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/contactus',
            data : {
                email       : $('#email').val(),
                fullName    : $('#fullname').val()
            },
            success: function (data) {
                $('.errorFullname').html("");
                $('.errorEmail').html("");
                $('.contact-form').hide();
                $('.contact-form-success').show();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.contact-form-success').hide();
                $('.contact-form').show();
                var errors = JSON.parse(XMLHttpRequest.responseText).errors;
                $('.errorFullname').html(errors.name);
                $('.errorEmail').html(errors.email);

            }
        });
    }
    $('#contactUsSubmit').click(function () {
        contactUs();
    });

});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}