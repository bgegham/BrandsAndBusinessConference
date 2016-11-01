$(document).ready(function(){
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


});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}