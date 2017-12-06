$(document).ready(function() {
    var openModel = "";

    $(".add-habit, .add-habit-category, .change-habit").on("click", function(){
        var modelId = '#' + $(this).attr("data-habit") + '';
        $(modelId).toggleClass("model-open")
        openModel = modelId;
    });

    $(document).keyup(function(e) {
        if(e.keyCode == 27) {
            if(!(!openModel.trim())) {
                $(openModel).toggleClass("model-open");
                openModel = "";
            }
        }
    });

    var screenWidth = $("body").width();
    var maxOpenScreensFloat = screenWidth/300;
    var maxOpenScreenDec = maxOpenScreensFloat.toFixed();
    if(maxOpenScreenDec > 4){
        maxOpenScreenDec = 4;
    } else if(maxOpenScreenDec < 1) {
        maxOpenScreenDec = 1;
    }
    maxOpenScreenDec = maxOpenScreenDec - 1;

    console.log(screenWidth + " Open screens: " + maxOpenScreenDec);
    $(".page").each(function(i) {
        console.log(this);
        $(this.attr("id"))
        if(i < maxOpenScreenDec) {
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
});