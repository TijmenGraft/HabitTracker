$(document).ready(function(){
    //General habit handeling 
    //this opens the model where the habit form will be contained
    $(".add-habit").on("click", function(){
        console.log("You have clicked on adding a habit");
    });

    $("#add_habit_submit").on("click", function(){
        //id, name, type, category, frequency, description, startDate, endDate
        var habitTitle = $("#habit_main_title").val();
        var habitType = $('input[name=habit_form_type]:checked').val();
        var habitCategory = "General";
        var habitFrequency = [];
        $('.habit-input:checkbox:checked').each(function() {
            var value = (this.checked ? $(this).val() : "");
            habitFrequency.push(value);
        });
        var habitDescription = $("#habit_main_description").val();
        var habitStartDate = $("#habit_main_startDate").val();
        var habitEndDate = $("#habit_main_endDate").val();
        console.log(habitTitle + " " + habitType + " " + habitCategory + " " + habitFrequency + " " + habitDescription + " " + habitStartDate + " " + habitEndDate);
    });

    $(".add-habit-category").on("click", function(){
        console.log("You have clicked on adding a new habit type");
        var newHabit = new HabitList(1,"Sports");
        console.log(newHabit.toString());
    });
});
