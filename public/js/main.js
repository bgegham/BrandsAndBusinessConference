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

    $('#yearly-4').click(function () {
        $('#elcd').addClass('cd-right');
    });
    $('#monthly-4').click(function () {
        $('#elcd').removeClass('cd-right');
    });

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
                firstName               : $('#firstName').val(),
                lastName                : $('#lastName').val(),
                birthDate               : $('#dateBirth').val(),
                phoneNumber             : $('#phone').val(),
                gender                  : $('.gender-input').val(),
                position                : $('#_posCheck').val(),
                position_description    : $('#_customPosText').val(),
                email                   : $('#_email').val(),
                ticket                  : getCookie("ticketType")
            },
            success: function (data) {
                $('.firstName').html("");
                $('.lastName').html("");
                $('.dateBirth').html("");
                $('._email').html("");
                $('.phone').html("");
                $('._posCheck').html("");
                $('._customPosText').html("");

                $('.form-ticket').hide();
                $('.form-ticket-success').show();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.form-ticket-success').hide();
                $('form-ticket').show();
                var errors = JSON.parse(XMLHttpRequest.responseText).errors;

                $('.firstName').html(errors.firstName);
                $('.lastName').html(errors.lastName);
                $('.dateBirth').html(errors.birthDate);
                $('._email').html(errors._email);
                $('.phone').html(errors.phone);
                $('._posCheck').html(errors._posCheck);
                $('._customPosText').html(errors._customPosText);


            }
        });
    }
    $('#byTicketFormSubmit').click(function () {
        contactUs();
    });

    $('.ticketType').on("click", function () {
       var _tType = $(this).attr("data-ticket");
        document.cookie = "ticketType="+_tType;
    });
    $('#_posCheck').change(function(){
        var _subject        = $(this).val();
        var _posText        = $('#_posText');
        var _customPosText  = $("#_customPosText");

        switch (_subject) {
            case "employee":
                _customPosText.attr("placeholder","Organization and position");
                _customPosText.show();
                break;
            case "student":
                _customPosText.attr("placeholder","University, degree, profession");
                _customPosText.show();
                break;
            case "other":
                _customPosText.attr("placeholder","Write position information");
                _customPosText.show();
                break;
            default:
                _customPosText.attr("placeholder","Write position information");
                _customPosText.show();
        }


    });
    $('#myModal').on('hidden.bs.modal', function () {
        $('.firstName').html("");
        $('.lastName').html("");
        $('.dateBirth').html("");
        $('._email').html("");
        $('.phone').html("");
        $('._posCheck').html("");
        $('._customPosText').html("");

        $('.form-ticket').show();
        $('.form-ticket-success').hide();

        $('#firstName').val("");
        $('#lastName').val("");
        $('#dateBirth').val("");
        $('#phone').val("");
        $('.gender-input').val("");
        $('#_posCheck').val("");
        $('#_customPosText').val("");
        $('#_email').val("");

    });


    $('#_subscribe').click(function () {
        subscribeUser();
    });
    function subscribeUser() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/subscribe/user',
            data : {
                email : $('#_emailS').val()
            },
            success: function (data) {
                $('.subscribe-form').hide();
                $('.subscribe-form-success').show();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.subscribe-form-success').hide();
                $('.subscribe-form').show();
                $('._errorEmail').html("Is not valid email address.");
            }
        });
    }


});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}