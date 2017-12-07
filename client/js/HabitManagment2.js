var main = function() {
    "use strict";

    var addHabit = function(id,name) {
        if($("#" + id).length == 0) {
            var li = '<li class="habit" id="'+id+'">' + name 
            + ' <i class="fa fa-check habit-check" aria-hidden="true"></i>'
            + ' <i class="fa fa-times delete-habit" aria-hidden="true"></i>'
            + ' <i class="fa fa-cog change-habit" data-habit="add_habit_change_model" aria-hidden="true"></i></li>';
            return li;
        } else {
            return false;
        }
    }

    var showHabits = function(Habits) {
        for(var key in Habits) {
            var temp = Habits[key].category;
            var CategoryId = "#" + Habits[key].category + "_habit";
            if($(CategoryId).length == 0) {
                var appendHabitList = new HabitList(0,temp,"A small description");
                $("#habit_wrapper").append(appendHabitList.toElement());
                var li = addHabit(Habits[key].id, Habits[key].name);
                if(li != false) {
                    $(CategoryId + "_list").append(li);
                }
            } else {
                var li = addHabit(Habits[key].id);
                if(li != false) {
                    $(CategoryId + "_list").append(li);
                }
            }
        }
    }

    setInterval(function() {
        $.getJSON("../showHabits", showHabits);
    },2000)

    $("#add_habit_submit").on("click", function() {
        console.log("Add habit");
        var Title = $("#habit_main_title").val();
        var Category = $("#habit_main_category").val();
        var Type = $('input[name=habit_form_type]:checked').val();
        var Frequency = [];
        $('.habit-radio:checkbox:checked').each(function() {
            var value = (this.checked ? $(this).val() : "");
            Frequency.push(value);
            console.log(value);
        });
        var Description = $("#habit_main_description").val();
        var StartDate = $("#habit_main_startDate").val();
        var EndDate = $("#habit_main_endDate").val();
        console.log(0 + " " + Title + " " + Type + " " + Category + " " + Frequency + " " + Description + " " + StartDate + " " + EndDate);
    });
};
$(document).ready(main);