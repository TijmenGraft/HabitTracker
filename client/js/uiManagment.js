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
});