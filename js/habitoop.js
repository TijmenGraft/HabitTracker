/**
 * ID: is the id of the habit so it is easy searchable in the db
 * Name: the name of the habit in HTML the title
 * Type: is it a good habit or a bad habit 1 = goodhabit 0 = badhabit
 * Category: in which category does that habit fall
 * Frequency: How many times does this habit needs to repeat itself each week
 * Description: A small description of the habit
 * StartDate: the date of start of the habit
 * EndDate: the date the habit tracking should end
 * 
**/
function Habit(id, name, type, category, frequency, description, startDate, endDate) {
	this.id = id;
	this.name = name;
	this.type = type;
	this.category = category;
	this.frequency = frequency;
	this.description = description;
	this.startDate = startDate;
	this.endDate = endDate

	this.echo = (function() {
		console.log("Hello!");
	});
}

Habit.prototype.setName = function(id){this.id = id;};
Habit.prototype.getName = function(){return this.id;};

Habit.prototype.setName = function(name){this.name = name;};
Habit.prototype.getName = function(){return this.name;};

Habit.prototype.setType = function(type){this.type = type;};
Habit.prototype.getType = function(){return this.type;};

Habit.prototype.setCategory = function(category){this.category = category;};
Habit.prototype.getCategory = function(){return this.category;};

Habit.prototype.setFrequency = function(frequency){this.frequency = frequency;};
Habit.prototype.getFrequency = function(){return this.frequency;};

Habit.prototype.setDescription = function(description){this.description = description;};
Habit.prototype.getDescription = function(){return this.description;};

Habit.prototype.setStartDate = function(startDate){this.startDate = startDate;};
Habit.prototype.getStartDate = function(){return this.startDate;};

Habit.prototype.setEndDate = function(endDate){this.endDate = endDate;};
Habit.prototype.getEndDate = function(){return this.endDate;};

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

var testHabitOne = new Habit(0,"Jeroen",1,"General",["di","wo"],"A small description","28-10-2017","30-10-2017");
var testHabitOther = new Habit(1,"Tijmen",0,"Sports",["ma","wo"],"A small sport description","28-11,2018","1-1-2018");


