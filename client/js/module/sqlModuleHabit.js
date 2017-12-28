const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

module.exports = {
	sqlInsertHabit: function(exsits, habit, callback, callbackFreq) {
	    var inlist = 0;
	    if(!exsits) {
	        var addCat = "INSERT INTO habitlistcatelog (owned_by,title) VALUES ?";
	        values = [
	            ["1",habit.category]
	        ];
	        con.query(addCat, [values], function(err,result) {
	            if(err) {
	                console.log(err);
	            }
	            inlist = result.insertId;
	            callback(inlist,habit.id);
	        });
	    } else {
	        var selectCat = "SELECT habit_list_id FROM habitlistcatelog WHERE title = ?"
	        con.query(selectCat, [habit.category], function(err,result) {
	            if(err) {
	                console.log(err);
	            }
	            inlist = result[0].habit_list_id;
	            callback(inlist,habit.id);
	        }) 
	    }
	    var insertQuery = "INSERT INTO habit VALUES ?";
	    var values = [
	        [ habit.id, null, habit.name, habit.type, habit.description, habit.startDate, habit.endDate ]
	    ];
	    con.query(insertQuery, [values], function(err,result) {
	        if(err) {
	            console.log(err);
	        }
	        callbackFreq(habit.id,habit.frequency);
	    });
	},

	sqlUpdateHabit: function(exsists,habit,callbackDeleteFrequency,callbackUpdateHabitlist,callbackSetInList) {
	    callbackDeleteFrequency(habit.id,habit.frequency,setFrequency);
	    callbackUpdateHabitlist(exsists,habit,callbackSetInList);
	    var updateHabit = "UPDATE habit SET title = ?, type = ?, description = ? WHERE habit_id = ?";
	    con.query(updateHabit, [habit.name,habit.type,habit.description,habit.id], function(err,result) {
	        if(err){console.log(err);}
	        console.log(result.affectedRows);
	    })
	},

	sqlHabitDone: function(habit,date) {
	    var daysOfWeek = ["mo","tu","we","th","fr","sa","su"];
	    var bonus = false;
	    if(habit.frequency.indexOf(daysOfWeek[date.getDay()]) == -1) {
	        bonus = true;
	    }
	    var month = date.getMonth();
	    var sqlDateFormat = date.getFullYear() + "-" + (++month) + "-" + date.getDate();
	    var insertHabitDoneQuery = "INSERT INTO habit_done VALUES ?";
	    var values = [
	        [habit.id,sqlDateFormat,bonus]
	    ];
	    con.query(insertHabitDoneQuery, [values], function(err,result) {
	        if(err){ console.log(err);}
	        console.log(result.affectedRows);
	    });
	},

	setInList: function(list_id,habit_id) {
	    var updateListId = "UPDATE habit SET in_list_id = ? WHERE habit_id = ?";
	    con.query(updateListId,[list_id,habit_id], function(err,result) {
	        if(err) {
	            console.log(err);
	        }
	    });
	},

	setFrequency: function(id,habitFrequency) {
	    var insertFrequency = "INSERT INTO frequency VALUES (?, (SELECT date_id FROM dates WHERE date_name = ?))";
	    for(var i = 0; i < habitFrequency.length; ++i) {
	        if(habitFrequency[i] == "ma") {
	            habitFrequency[i] = "mo";
	        }
	        con.query(insertFrequency, [id,habitFrequency[i]], function(err,result) {
	            if(err) {
	                console.log(err);
	            }
	            console.log(result);
	        })
	    }
	},

	getTimes: function(id) {
	    var frequency = [];
	    var selectFrequency = 'SELECT D.date_name FROM frequency AS F JOIN dates AS D ON F.date_id = D.date_id WHERE F.habit_id = ? ORDER BY F.date_id ASC';
	    con.query(selectFrequency, [id], function(err, result) {
	        if(err) {
	            console.log(err)
	        }
	        for(var i2 = 0; i2< result.length; ++i2) {
	            frequency.push(result[i2].date_name)
	        }
	        sqlHabits[habitsPosition(id)].frequency = frequency;
	    });
	},

	deleteFrequency: function(id,habitFrequency,callbackSetFrequency) {
	    var deleteFrequencyQuery = "DELETE FROM frequency WHERE habit_id = ?";
	    con.query(deleteFrequencyQuery,[id], function(err,result) {
	        if(err){console.log(err);}
	        console.log(result);
	        if(callbackSetFrequency && habitFrequency) {
	            callbackSetFrequency(id,habitFrequency);
	        }
	    });
	},	

	updateHabitList: function(exsits,habit,callbackSetInList) {
	    var inlist = 0;
	    if(!exsits) {
	        var addCat = "INSERT INTO habitlistcatelog (owned_by,title) VALUES ?";
	        values = [
	            ["1",habit.category]
	        ];
	        con.query(addCat, [values], function(err,result) {
	            if(err) { console.log(err); }
	            inlist = result.insertId;
	            callbackSetInList(inlist,habit.id);
	        });
	    } else {
	        var selectCat = "SELECT habit_list_id FROM habitlistcatelog WHERE title = ?"
	        con.query(selectCat, [habit.category], function(err,result) {
	            if(err) {
	                console.log(err);
	            }
	            inlist = result[0].habit_list_id;
	            callbackSetInList(inlist,habit.id);
	        }) 
	    }
	},

	deleteHabit: function(habitId) {
		var deleteQuery = "DELETE FROM habit WHERE habit_id = ?";
			con.query(deleteQuery, [habitId], function(err,result) {
	        if(err){console.log(err);}
	        console.log(result.affectedRows)
	    });
	}
}