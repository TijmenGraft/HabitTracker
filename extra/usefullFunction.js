var habitHandelingFormData = function(sqlHabit,id,data) {
    console.log("++++Handeling form data++++");
    var frequencyArr = [];
    var i = 3;
    console.log(id);
    while(data[i].name !== "habit_form_description") {
        if(data[i].name == "change_habit_form_description") {
            break;
        }
        frequencyArr.push(data[i].value);
        ++i;
    }
    if(habitsDataIdContains(sqlHabit,id)) {
        var oldHabit = selectHabitById(sqlHabit,id);
        var startDate = oldHabit["startDate"];
        var endDate = oldHabit["endDate"]; 
    } else {
        var i_2 = i;
        var startDate = data[++i_2].value;
        var endDate = data[++i_2].value;
    }
    var habit = {
        id: id,
        name: data[0].value,
        type: data[2].value,
        category: data[1].value,
        frequency: frequencyArr,
        description: data[i].value,
        startDate: startDate,
        endDate: endDate,
        checkDate: []
    }
    return habit;
}

var toHabit = function(data) {
    var habit = {
        id: data.habit_id,
        name: data.title,
        type: data.type,
        category: data.category,
        frequency: [],
        description: data.description,
        startDate: data.startdate,
        endDate: data.enddate,
        checkDate: []
    }
    return habit;
}

var habitsDataIdContains = function(sqlHabits,id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return true;
        }
    }
    return false;
}

var habitsPosition = function(sqlHabits,id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return i;
        }
    }
    return false;
}

var selectHabitById = function(sqlHabits,id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return sqlHabits[i];
        }
    }
    return false;
}

var checkIfCategoryExsits = function(sqlHabits,category) {
    for(var i = 0; i < sqlHabits.length; ++i) {
        if(sqlHabits[i].category == category) {
            return true;
        }
    }
    return false;
}

var organiseIntoCategory = function(sqlHabits) {
    var habits = {};
    for (var i = sqlHabits.length - 1; i >= 0; i--) {
        if(!(sqlHabits[i].category in habits)) {
            habits[sqlHabits[i].category] = [];
            habits[sqlHabits[i].category].push(sqlHabits[i]);
        } else {
            habits[sqlHabits[i].category].push(sqlHabits[i]);
        }
        
    }
    return habits;
}

var allCategories = function(sqlHabits) {
    var categories = [];
    for (var i = sqlHabits.length - 1; i >= 0; i--) {
        if(categories.indexOf(sqlHabits[i].category) === -1) {
            categories.push(sqlHabits[i].category)
        }
    }
    return categories;
}

module.exports = {
    habitsDataIdContains: habitsDataIdContains,
    habitsPosition: habitsPosition,
    selectHabitById: selectHabitById,
    checkIfCategoryExsits: checkIfCategoryExsits,
    habitHandelingFormData: habitHandelingFormData,
    toHabit: toHabit,
    organiseIntoCategory: organiseIntoCategory,
    allCategories: allCategories
};