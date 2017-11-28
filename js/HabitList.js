function HabitList(id, name) {
    this.id = id;
    this.name = name;
    this.listOfHabits = [];
}

HabitList.prototype.setID = function(id){this.id = id;};
HabitList.prototype.getId = function(){return this.id;};

HabitList.prototype.setName = function(name){this.name = name;};
HabitList.prototype.getName = function(){return this.name;};

HabitList.prototype.setListOfHabits = function(listOfHabits){this.listOfHabits = listOfHabits;};
HabitList.prototype.getListOfHabits = function(){return this.listOfHabits;};

HabitList.prototype.addHabit = function(a){
    if(a instanceof Habit) {
        this.getListOfHabits().push(a);
    }
};

HabitList.prototype.numberOfGoodHabits = function() {
    var goodHabitCounter = 0;
    this.getListOfHabits().forEach(function(entry){
        if(entry.getType() == 1) {
            goodHabitCounter++;
        }
    });
    return goodHabitCounter;
}

HabitList.prototype.numberOfBadHabits = function() {
    var badHabitCounter = 0;
    this.getListOfHabits().forEach(function(entry) {
        if(entry.getType() == 0) {
            badHabitCounter++;
        }
    });
    return badHabitCounter;
}

HabitList.prototype.toString = function() {
    var returnString = "";
    returnString += "Title: "+this.getName() + "\n";
    this.getListOfHabits().forEach(function(entry) {
        returnString += entry.toString();
    });
    return returnString;
}

var testHabitList = new HabitList(1,"Sports");
testHabitList.addHabit(testHabitOne);
testHabitList.addHabit(testHabitOther);