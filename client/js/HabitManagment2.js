var main = function() {
    "use strict";

    var showHabits = function(Habits) {
        console.log("Loading habit files");
        for(var key in Habits) {
            var temp = Habits[key].category;
            var CategoryId = "#" + Habits[key].category + "_habit";
            if($(CategoryId).length == 0) {
                var appendHabitList = new HabitList(0,)
            } else {
                var li = '<li class="habit">' + Habits[key].name + "</li>";
                $(CategoryId + "_list").append(li);
            }
            
        }
    }

    setInterval(function() {
        console.log("trying to look for new habits");
        $.getJSON("../showHabits", showHabits);
    },2000)
};
$(document).ready(main);