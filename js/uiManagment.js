$(document).ready(function() {
    var openModel = "";

    $(".add-habit, .add-habit-category, .change-habit").on("click", function(){
        var modelId = '#' + $(this).attr("data-habit") + '';
        $(modelId).css({
            "display":"block",
            "visibility":"visible",
            "opacity":1
        });
        openModel = modelId;
    });

    $(document).keyup(function(e) {
        if(e.keyCode == 27) {
            if(!(!openModel.trim())) {
                $(openModel).css({
                    "display":"none",
                    "visibility":"visible",
                    "opacity":0
                });
                openModel = "";
            }
        }
    });
});