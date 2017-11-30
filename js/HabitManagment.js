$(document).ready(function(){
    //General habit handeling 
    //this opens the model where the habit form will be contained
    $(document).on("click", ".add-habit", function(){
        console.log("You have clicked on adding a habit");
        var location = $(this).attr('id').replace("add_habit_to_","").toLowerCase();
        $("#add_habit_model").attr({
            "data-destination":location
        });
        $("#add_habit_model").toggleClass("model-show");
    });

    $(document).on("click",".habit", function(){
        console.log("Changing habit fired!");
        var valueType = $(this).attr('data-habitType');
        var valueFrequent = $(this).attr('data-habitFrequency');
        var valueFrequentSplit = valueFrequent.split(",");
        $("#change_habit_main_title").val($(this).attr('data-habitTitle'));
        $('input[name=change_habit_form_type][value='+valueType+']').prop('checked', true);
        for (var i = 0; i < valueFrequentSplit.length; i++) {
            $('input[name=change_habit_form_frequency][value='+valueFrequentSplit[i]+']').prop('checked', true);
        }
        $("#change_habit_main_description").val($(this).attr('data-habitDescription'));
        $("#change_habit_main_startDate").val($(this).attr('data-habitStartDate'));
        $("#change_habit_main_endDate").val($(this).attr('data-habitEndDate'));
    });

    $("#add_habit_submit").on("click", function(){
        console.log(this);
        //id, name, type, category, frequency, description, startDate, endDate
        var habitTitle = $("#habit_main_title").val();
        var habitType = $('input[name=habit_form_type]:checked').val();
        var habitCategory = $("#add_habit_model").attr("data-destination");
        var habitFrequency = [];
        $('.habit-input:checkbox:checked').each(function() {
            var value = (this.checked ? $(this).val() : "");
            habitFrequency.push(value);
        });
        var habitDescription = $("#habit_main_description").val();
        var habitStartDate = $("#habit_main_startDate").val();
        var habitEndDate = $("#habit_main_endDate").val();
        console.log(0 + " " + habitTitle + " " + habitType + " " + habitCategory + " " + habitFrequency + " " + habitDescription + " " + habitStartDate + " " + habitEndDate);
        var newHabit = new Habit(0,habitTitle,habitType,habitCategory,habitFrequency,habitDescription,habitStartDate,habitEndDate);
        var postTo = '#'+habitCategory.toLowerCase()+"_habit_list";
        $(postTo).append(newHabit.toElement());

        var postHabitDataTo = '#'+newHabit.getName()+"_a_habit";
        $(postHabitDataTo).attr({
            "data-habitTitle":habitTitle,
            "data-habitType":habitType,
            "data-habitCategory":habitCategory,
            "data-habitFrequency":habitFrequency,
            "data-habitDescription":habitDescription,
            "data-habitStartDate":habitStartDate,
            "data-habitEndDate":habitEndDate
        });
    });

    $(".add-habit-category").on("click", function(){
        console.log("You have clicked on adding a new habit type");
        var newHabit = new HabitList(1,"Sports");
        console.log(newHabit.toString());
    });

    $("#add_habit_category_submit").on("click", function() {
        var habitCategoryTitle = $("#habit_category_main_title").val();
        var habitCategoryDescription = $("#habit_category_main_description").val();
        var newHabitList = new HabitList(0,habitCategoryTitle,habitCategoryDescription);
        console.log(0 + " " + habitCategoryTitle + " " + habitCategoryDescription);
        $("#habit_wrapper").append(newHabitList.toElement());
    });
});
