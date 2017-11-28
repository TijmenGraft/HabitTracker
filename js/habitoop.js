/**
Name: the name of the habit in HTML the title
Type: in which category does this habit fall if the category doesnt exsits yet it should be made
Frequency: How many times does this habit needs to repeat itself each week
Description: A small description of the habit
**/
function Habit(name, type, frequency, description) {
	this.name = name;
	this.type = type;
	this.frequency = frequency;
	this.description = description;

	this.echo = (function() {
		console.log("Hello!");
	});
}

Habit.prototype.setName = function(name){this.name = name;};
Habit.prototype.getName = function(){return this.name;};

Habit.prototype.setType = function(type){this.type = type;};
Habit.prototype.getType = function(){return this.type;};

Habit.prototype.setFrequency = function(frequency){this.frequency = frequency;};
Habit.prototype.getFrequency = function(){return this.frequency;};

Habit.prototype.setDescription = function(description){this.description = description;};
Habit.prototype.getDescription = function(){return this.description;};

Habit.prototype.toString = function() {
	return "This habit:" + this.getName() + " is from the type: " + this.getType() + " with description: " + this.getDescription()
	+ " it needs to be repeated on " + this.getFrequency();
};

Habit.prototype.equals = function(other) {
	if(other instanceof Habit) {
		if(other.getName() === this.getName()) {
			return true;
		}
		return false;
	}
	return false;
}

var testHabitOne = new Habit("Jeroen","General",["di","wo"],"A small description");
var testHabitOther = new Habit("Tijmen","Sports",["ma","wo"],"A small sport description");
console.log(testHabitOne.equals(testHabitOther));


