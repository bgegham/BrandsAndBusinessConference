$(document).ready(function(){

    function LogIn(){
        $.ajax({
            type: 'POST',
            url: '/control/admin/login',
            data: {
                username:     $('#username').val(),
                password:     $('#password').val()
            },
            success: function (data) {
                document.location.href = data.url;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.error-login').html(JSON.parse(XMLHttpRequest.responseText).errors)
            }
        });
    }
    $('#login-button').click(function () {
        LogIn();
    });
    $('#username').keypress(function (e) {
        if (e.which == 13) {
            LogIn();
            return false;
        }
    });
    $('#password').keypress(function (e) {
        if (e.which == 13) {
            LogIn();
            return false;
        }
    });

});