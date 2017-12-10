$(document).ready(function() {
    var openModel = "";

    $(".add-habit, .add-habit-category, .change-habit").on("click", function(){
        var modelId = '#' + $(this).attr("data-habit") + '';
        $(modelId).toggleClass("model-open")
        $(modelId).animate({
            top: "10%",
            opacity: 1
        }, 100)
        openModel = modelId;
    });

    $(document).keyup(function(e) {
        if(e.keyCode == 27) {
            if(!(!openModel.trim())) {
                $(openModel).animate({
                    top: "0%",
                    opacity: 0
                }, 100);
                $(openModel).toggleClass("model-open");
                openModel = "";
            }
        }
    });

    var screenWidth = $("body").width();
    var maxOpenScreensFloat = screenWidth/500;
    var maxOpenScreenDec = maxOpenScreensFloat.toFixed();
    if(maxOpenScreenDec > 4){
        maxOpenScreenDec = 4;
    } else if(maxOpenScreenDec < 1) {
        maxOpenScreenDec = 1;
    }
    maxOpenScreenDec = maxOpenScreenDec - 1;

    console.log(screenWidth + " Open screens: " + maxOpenScreenDec);
    $(".page-nav").on("click", function(i) {
        console.log(this);
        //$(this.attr("id"))
        if($(this > li).hasClass(".page-active")) {
            console.log("Page is active");
        }else if(i < maxOpenScreenDec) {
            console.log("true");

        }
    });

    $("a").on("click", function(event) {
        if(this.hash !== "") {
            var hash = this.hash;
            $("html, body").animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    $(".label-left, .label-right").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        $(this).toggleClass("label-trigger-state");
    });
});