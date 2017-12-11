$(document).ready(function() {
    var openModel = "";

    var openModelFunction = function(id) {
        $(id).toggleClass("model-open")
        $(id).animate({
            top: "10%",
            opacity: 1
        }, 100)
        openModel = id;
    }


    $("#overview_page").on("click",".add-habit, .add-habit-category", function() {
        console.log("toggler clicked");
        var modelId = '#' + $(this).attr("data-habit") + '';
        openModelFunction(modelId);
    })

    $("#overview_page").on("click",".change-habit", function() {
        console.log("toggler clicked");
        var modelId = '#' + $(this).attr("data-habit") + '';
        openModelFunction(modelId);
        var habitId = $(this).parent().attr("id");
        console.log(habitId);
        $.getJSON({
            url: '/requestHabit?id='+habitId,
            function(data,status) {
                if(status === 200) {
                    console.log("successfull" + data);
                } else {
                    console.log("failure");
                }
            }
        });
    })

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
    var openScreens = 1;

    console.log(screenWidth + " Open screens: " + maxOpenScreenDec);
    $(".page-nav").on("click", function(openScreens) {
        console.log(this);
        //$(this.attr("id"))
        if($(this).find("li").hasClass(".page-active")) {
            $(this).find("li").removeClass(".page-active");
            console.log("Page is no longer active");
        }else if(openScreens < maxOpenScreenDec) {
            $(this).find("li").addClass(".page-active");
            ++openScreens;
            console.log("Page is now active");
        }else if(openScreens == maxOpenScreenDec){
            console.log("Too many pages active. Close one first.");
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