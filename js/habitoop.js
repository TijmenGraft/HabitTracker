function Habit(name, type, frequency, description) {
	this.name = name;
	this.type = type;
	this.frequency = frequency;
	this.description = description;
}

Habit.prototype.setName = function(name){this.name = name;}
Habit.prototype.getName = function(){return this.name;}

Habit.prototype.setType = function(type){this.type = type;}
Habit.prototype.getType = function(){return this.type;}

Habit.prototype.setFrequency = function(frequency){this.frequency = frequency;}
Habit.prototype.getFrequency = function(){return this.frequency;}

Habit.prototype.setDescription = function(description){this.description = description;}
Habit.prototype.getDescription = function(){return this.description;}