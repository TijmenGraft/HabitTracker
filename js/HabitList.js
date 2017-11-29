function HabitList(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.listOfHabits = [];
}

HabitList.prototype.setID = function(id){this.id = id;};
HabitList.prototype.getId = function(){return this.id;};

HabitList.prototype.setName = function(name){this.name = name;};
HabitList.prototype.getName = function(){return this.name;};

HabitList.prototype.setDescription = function(description){this.description = description;};
HabitList.prototype.getDescription = function(){return this.description;};

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
};

HabitList.prototype.numberOfBadHabits = function() {
    var badHabitCounter = 0;
    this.getListOfHabits().forEach(function(entry) {
        if(entry.getType() == 0) {
            badHabitCounter++;
        }
    });
    return badHabitCounter;
};

HabitList.prototype.toString = function() {
    var returnString = "";
    returnString += "Title: "+this.getName() + "\n";
    this.getListOfHabits().forEach(function(entry) {
        returnString += entry.toString();
    });
    return returnString;
};

HabitList.prototype.toElement = function() {
    /**<div class="habit-card" id="general_habit">
        <div class="habit-card-header">
            <h4>General</h4>
        </div>
        <div class="habit-card-body">
            <ul class="habit-list">
                <li class="good-habit">Good habit example</li>
                <li class="bad-habit">Bad habit example</li>
            </ul>
            <span class="add-habit" id="add_habit_to_general">+</span>
        </div>
        <div class="habit-card-footer">
            <p>Test</p>
        </div>
    </div>
    **/
};

var testHabitList = new HabitList(1,"Sports");
testHabitList.addHabit(testHabitOne);
testHabitList.addHabit(testHabitOther);