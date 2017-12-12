$(document).ready(function() {
    var openModel = "";

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
                $(this).attr("checked", true);
            }
        });
        $("input[name=change_habit_form_type]").each(function() {
            var currentElement = $(this).val();
            if(Habit.type === currentElement) {
                $(this).attr("checked", true);
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
    })

    $("#overview_page").on("click",".change-habit", function() {
        var modelId = '#' + $(this).attr("data-habit") + '';
        openModelFunction(modelId);
        var habitId = $(this).parent().attr("id");
        $.getJSON(
            "../requestHabit?id="+habitId, 
            populateChangeHabitForm
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