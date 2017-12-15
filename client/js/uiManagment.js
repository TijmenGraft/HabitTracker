$(document).ready(function() {
    var openModel = "";
    window.blocker = false;

    $("input[type=checkbox]").on("click",function() {
        console.log($(this));
    })

    var openModelFunction = function(id) {
        $(id).toggleClass("model-open")
        $(id).animate({
            top: "10%",
            opacity: 1
        }, 100)
        openModel = id;
    };

    var populateChangeHabitForm = function(Habit) {
        console.log("Calling populate habit form");
        console.log(Habit);
        var frequencyArr = Habit.frequency;
        $("input[name=change_habit_form_frequency]").each(function() {
            var currentElement = $(this).val();
            if(frequencyArr.indexOf(currentElement) !== -1) {
                // $(this).checked
                console.log($(this))  
                console.log($(this)[0].checked);
                $(this)[0].checked = true;
                console.log($(this)[0].checked);
            }
        });
        $("input[name=change_habit_form_type]").each(function() {
            var currentElement = $(this).val();
            if(Habit.type === currentElement) {
                $(this).checked = true;
            }
        });
        $("#change_habit_main_id").val(Habit.id);
        $("#change_habit_main_title").val(Habit.name);
        $("#change_habit_main_category").val(Habit.category);
        $("#change_habit_main_description").val(Habit.description);
    };

    $("input[type=checkbox], input[type=radio]").on("click", function(e){
        console.log(this);
        if($(this).attr("checked")) {
            console.log("This is checked");
            $(this).attr("checked", false);
        }
        console.log("Checkbox or radio clicked");
    });


    $("#overview_page").on("click",".add-habit, .add-habit-category", function() {
        console.log("toggler clicked");
        var modelId = '#' + $(this).attr("data-habit") + '';
        openModelFunction(modelId);
        blocker = true;
    })

    $("#overview_page").on("click",".change-habit", function() {
        blocker = true;
        var modelId = '#' + $(this).attr("data-habit") + '';
        openModelFunction(modelId);
        var habitId = $(this).parent().parent().attr("id");
        $("#"+habitId).remove().remove();
        $.getJSON(
            "../requestHabit?id="+habitId, 
            populateChangeHabitForm
        );
    });

    $("#overview_page").on("click",".habit-check", function() {
        var habitId = $(this).parent().parent().attr("id");
        $.getJSON(
            "../habitDone?id="+habitId, 
        );
    });

    $("#overview_page").on("click",".delete-habit", function() {
        var habitId = $(this).parent().parent().attr("id");
        $("#"+habitId).remove();
        $.getJSON(
            "../removeHabit?id="+habitId, 
        );
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
    var maxOpenScreensFloat = screenWidth/442;
    var maxOpenScreenDec = maxOpenScreensFloat.toFixed();
    if(maxOpenScreenDec > 4){
        maxOpenScreenDec = 4;
    } else if(maxOpenScreenDec < 1) {
        maxOpenScreenDec = 1;
    }
    maxOpenScreenDec = maxOpenScreenDec - 1;
    openScreens = 0;

    var windowOpeningAndClosing = function() {
        var i = 0;
        $(".page").each(function() {
            if($(this).hasClass("active")) {
                ++i;
            }   
        });
        var pageWidth = 100/i+"%";
        $(".page").each(function() {
            if($(this).hasClass("active")) {
                $(this).css({
                    "width":pageWidth
                });
            }
        });
    }

    console.log(screenWidth + " Open screens: " + maxOpenScreenDec);
    $(".page-nav").on("click", function() {
        var target = $(this).attr("href");
        if($(target).hasClass("active")) {
            $(this).find("li").toggleClass("page-active");
            $(target).toggleClass("active");
            windowOpeningAndClosing();
            --openScreens;
        } else {
            if(openScreens < maxOpenScreenDec) {
                $(this).find("li").toggleClass("page-active");
                $(target).toggleClass("active");
                windowOpeningAndClosing();
                ++openScreens;
            } else {
                console.log(openScreens);
                console.log("You should close a page");
            }
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

    $(".login-span,.register-span").on("click",function(){
        var form = $(this).find("a").attr("data-form");
        if(form == "login_form") {
            if($("#register_form").hasClass("show")) {
                $("#register_form").removeClass("show");
                $("#register_form").addClass("hidden");
                if($("#login_form").hasClass("hidden")) {
                    $("#login_form").removeClass("hidden");
                    $("#login_form").addClass("show");
                }
            }
        } else {
            $("#register_form").toggleClass("show");
            $("#login_form").toggleClass("show");
        }
        console.log();
        console.log($(this).first().attr("data-form"))
    })
});