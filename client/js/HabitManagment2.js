var main = function() {
    "use strict";

    var addHabit = function(id,name) {
        if($("#" + id).length == 0) {
            console.log(name);
            var li = '<li class="habit" id="'+id+'">' + name 
            + ' <ul class="icon-group" id="icons"><i class="fa fa-check habit-check" aria-hidden="true"></i>'
            + ' <i class="fa fa-times delete-habit" aria-hidden="true"></i>'
            + ' <i class="fa fa-cog change-habit" data-habit="change_habit_model"></i></ul></li>';
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
        if(!blocker) {
            console.log("Didnt get blocked");
            $.getJSON("../showHabits", showHabits);
        } else {
            console.log("I got blocked");
        }
    },1000)

    /* Adding a habit by sending a request to the server 
    * We use serialize method because it is easy 
    */
    $("#add_habit, #change_habit").submit(function(event) {
        event.preventDefault();
        var $form = $(this);
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
                blocker = false;
            },
            error: function(data) {
                console.log("Couldnt send the data");
                console.log(data);
                blocker = false;
            },
        });
    })
};
$(document).ready(main);