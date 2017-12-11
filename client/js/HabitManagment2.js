var main = function() {
    "use strict";

    var addHabit = function(id,name) {
        if($("#" + id).length == 0) {
            console.log(name);
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
                console.log(Habits);
                var li = addHabit(Habits[key].id, Habits[key].name);
                if(li != false) {
                    $(CategoryId + "_list").append(li);
                }
                var option = '<option value="'+appendHabitList.getName()+'">'
                $("#category_list_habit").append(option);
            } else {
                var li = addHabit(Habits[key].id, Habits[key].name);
                if(li != false) {
                    $(CategoryId + "_list").append(li);
                }
            }
        }
    }

    setInterval(function() {
        $.getJSON("../showHabits", showHabits);
    },3000)

    $("#add_habit_submit").on("click", function() {
        console.log("Add habit");
    });
    /* Adding a habit by sending a request to the server 
    * We use serialize method because it is easy 
    */
    $("#add_habit").submit(function(event) {
        event.preventDefault();
        var $form = $(this);
        console.log("test");
        var formData = JSON.stringify($form.serializeArray());
        console.log(formData);
        $.ajax({
            type: $form.attr("method"),
            url: $form.attr("action"),
            data: formData,
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                console.log("Data was send correctly");
                console.log(data);
                console.log(data.habit_form_title);
                console.log("Hello world");
            },
            error: function(data) {
                console.log("Couldnt send the data");
                console.log(data);
            },
        });
    })
};
$(document).ready(main);