$(document).ready(function(){
    const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    const banRegex = /^ban_[13][13456789abcdefghijkmnopqrstuwxyz]{59}$/;
    //format /ajax/<call>?attr=<param>
    $("form[data-flow='sign up form'] #banaddress").on("input", function() {
        let getParam = $(this).val();
        if($(this).siblings(".warning-item").length || $(this).siblings(".passed-item").length) {
            $(this).siblings(".warning-item").remove();
            $(this).siblings(".passed-item").remove();
        }
        if($.trim(getParam).length > 0) {
			if(banRegex.test(getParam)) {
                $.get("/auth/ajax/checkBanAddressExists?attr=" + getParam, function(data) {
                    if(data == "true") {
                        $("form[data-flow='sign up form'] #banaddress").parent().append('<span class="warning-item tooltipitems" data-tooltip="This address already exists."></span>');
                    } else {
                        $("form[data-flow='sign up form'] #banaddress").parent().append('<span class="passed-item tooltipitems" data-tooltip="Address has not been registerd yet"></span>');
                    }
                });
            } else {
                $("form[data-flow='sign up form'] #banaddress").parent().append('<span class="warning-item tooltipitems" data-tooltip="That doesnt look like a valid address"></span>');
            }
        }
    });

    $("form[data-flow='sign up form'] #user").on("input", function() {
        let getParam = $(this).val();
        if($(this).siblings(".warning-item").length || $(this).siblings(".passed-item").length) {
            $(this).siblings(".warning-item").remove();
            $(this).siblings(".passed-item").remove();
        }
        if($.trim(getParam).length > 0) {
            if($.trim(getParam).length > 5) {
			        if(!regex.test(getParam)) {    
                        $.get("/auth/ajax/checkUsernameExists?attr=" + getParam, function(data) {
                            if(data == "true") {
                                $("form[data-flow='sign up form'] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="This username already exists."></span>');
                            } else {
                                $("form[data-flow='sign up form'] #user").parent().append('<span class="passed-item tooltipitems" data-tooltip="Username has not been registerd yet"></span>');
                            }
                        });
                    } else {
                        $("form[data-flow='sign up form'] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="Invalid characters used"></span>');
                    }
            } else {
                $("form[data-flow='sign up form'] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="Username should be at least 5 charaters long"></span>');
            }
        }
    });
    
    $("form[data-flow='Log in form'] #user").on("input", function() {
        let getParam = $(this).val();
        if($(this).siblings(".warning-item").length || $(this).siblings(".passed-item").length) {
            $(this).siblings(".warning-item").remove();
            $(this).siblings(".passed-item").remove();
        }
        if($.trim(getParam).length > 0) {
            if($.trim(getParam).length > 5) {
			        if(!regex.test(getParam)) {    
                        $.get("/auth/ajax/checkUsernameExists?attr=" + getParam, function(data) {
                            if(data == "true") {
                                $("form[data-flow='Log in form'] #user").parent().append('<span class="passed-item tooltipitems" data-tooltip="This username exists."></span>');
                            } else {
                                $("form[data-flow='Log in form'] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="Username has not been registerd yet"></span>');
                            }
                        });
                    } else {
                        $("form[data-flow='Log in form] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="Invalid characters used"></span>');
                    }
            } else {
                $("form[data-flow='Log in form'] #user").parent().append('<span class="warning-item tooltipitems" data-tooltip="Username should be at least 5 charaters long"></span>');
            }
        }
    });

    $("form[data-flow='Log in form'] #banaddress").on("input", function() {
        let getParam = $(this).val();
        if($(this).siblings(".warning-item").length || $(this).siblings(".passed-item").length) {
            $(this).siblings(".warning-item").remove();
            $(this).siblings(".passed-item").remove();
        }
        if($.trim(getParam).length > 0) {
			if(banRegex.test(getParam)) {
                $.get("/auth/ajax/checkBanAddressExists?attr=" + getParam, function(data) {
                    console.log(data);
                    if(data == "true") {
                        $("form[data-flow='Log in form'] #banaddress").parent().append('<span class="passed-item tooltipitems" data-tooltip="This address exists."></span>');
                    } else {
                        $("form[data-flow='Log in form'] #banaddress").parent().append('<span class="warning-item tooltipitems" data-tooltip="Address has not been registerd yet"></span>');
                    }
                });
            } else {
                $("form[data-flow='Log in form'] #banaddress").parent().append('<span class="warning-item tooltipitems" data-tooltip="That doesnt look like a valid address"></span>');
            }
        }
    });

    $(".notificationbell").on("mouseover", function() {
        addNotification();
    });
});

function addNotification() {  
    if(!$(".bell-top-anim").length > 0) {
        $('.bell-top').addClass('bell-top-anim');
        $('.bell-bot').addClass('bell-bot-anim');
    }
    setTimeout(function(){
        $('.bell-top').removeClass('bell-top-anim');
        $('.bell-bot').removeClass('bell-bot-anim');
    }, 800); 
}