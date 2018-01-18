const con = require("mysql-promise")();
const usefullFunction = require("./usefullFunction");
const cred = require("./cred")

var sqlHabits = [];
var nextHabitId;
con.configure(cred);

(function setUp() {
    console.log("Setting up storage");
    var query = "SELECT H.habit_id, H.title, H.type, HC.title AS category, H.description, H.startdate, H.enddate FROM habit AS H JOIN habitlistcatelog AS HC ON H.in_list_id = HC.habit_list_id WHERE H.in_list_id IS NOT NULL";
    var _frequency = async function(sqlHabits,id,habit) {
    	var frequency = await getTimes(sqlHabits,id,usefullFunction.habitsPosition);
    	habit.frequency = frequency;
        sqlHabits.push(habit);
    }
    con.query(query, function(err,result) {
        if(err) {
            console.log(err);
        }
        for(var i = 0; i < result.length; ++i) {
            var habit = usefullFunction.toHabit(result[i]);
            var id = habit.id;
            _frequency(sqlHabits,id,habit);
        }
    });
})();
/*
* handleDataForm is the function
* data is de data provided by users
* sqlHabits is de array
*/
var login = async function(req){
    console.log('++++Excecuting login++++');
    var username = req.body.login_form_username; //continue here
    var password = req.body.login_form_password;
    var loginQRY = 'SELECT user_id FROM users WHERE username = "'+username+'" AND password = "'+password+'" LIMIT 1';
    let result = await con.query(loginQRY);
    return result[0][0].user_id;
}

var getMaxId = async function(){
	var maxID = "SELECT habit_id FROM habit ORDER BY habit_id DESC LIMIT 1;";
    let res = await con.query(maxID);
    let int = res[0][0].habit_id;
    int++;
    return int;
}

var setFrequency = async function(id,habitFrequency) {
    var insertFrequency = "INSERT INTO frequency VALUES (?, (SELECT date_id FROM dates WHERE date_name = ?))";
    for(var i = 0; i < habitFrequency.length; ++i) {
        if(habitFrequency[i] == "ma") {
            habitFrequency[i] = "mo";
        }
        await con.query(insertFrequency, [id,habitFrequency[i]]);
    }
};

var sqlInsertHabit = async function(exsits, habit, callback, callbackFreq) {
	console.log("+++sql insert habit+++");
	console.log(exsits);
    var inlist = 0;
    if(!exsits) {
        var addCat = "INSERT INTO habitlistcatelog (owned_by,title) VALUES ?";
        values = [
            ["1",habit.category]
        ];
        let result = await con.query(addCat, [values]);
        inlist = result[0].insertId;
    } else {
        var selectCat = "SELECT habit_list_id FROM habitlistcatelog WHERE title = ?";
        let result = await con.query(selectCat, [habit.category]);
        inlist = result[0][0].habit_list_id;
    }
    var insertQuery = "INSERT INTO habit VALUES ?";
    var values = [
        [ habit.id, inlist, habit.name, habit.type, habit.description, habit.startDate, habit.endDate ]
    ];
    let result = await con.query(insertQuery, [values]);
    callbackFreq(habit.id,habit.frequency);
};

var getTimes = async function(sqlHabits,id,habitsPosition) {
	console.log("++++Excecuting getTimes++++");
    var frequency = [];
    var selectFrequency = 'SELECT D.date_name FROM frequency AS F JOIN dates AS D ON F.date_id = D.date_id WHERE F.habit_id = ? ORDER BY F.date_id ASC';
    let result = await con.query(selectFrequency, [id])
    for(var i2 = 0; i2 < result[0].length; ++i2) {
        frequency.push(result[0][i2].date_name)
    }
    return frequency;
}

var sqlUpdateHabit = async function(exsists,habit,callbackDeleteFrequency,callbackUpdateHabitlist,setInList,updateHabitList) {
	console.log("++++Handeling sqlUpdateHabit++++");
	console.log("updating habit");
	console.log(exsists);
	var updateHabit = "UPDATE habit SET title = ?, type = ?, description = ? WHERE habit_id = ?";
    con.query(updateHabit, [habit.name,habit.type,habit.description,habit.id], function(err,result) {
        if(err){console.log(err);}
        console.log(result.affectedRows);
    });
    console.log("habit updated");
	console.log("deleteting frequency");
    await callbackDeleteFrequency(habit.id);
    console.log("deleteting successfull");
    console.log("setting frequency");
    await setFrequency(habit.id,habit.frequency);
    console.log("setting successfull");
    console.log("updating habit list");
    let result = await updateHabitList(exsists,habit);
    console.log(result);
    console.log("updating habit list successfull");
    console.log("setting in the list");
    await setInList(result,habit.id);
    console.log("setting successfull");
}

module.exports = {
	sqlInsertHabit: sqlInsertHabit,
	getMaxId: getMaxId,

	sqlUpdateHabit: sqlUpdateHabit,

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

	setInList: async function(list_id,habit_id) {
		console.log("++++Setting in list++++");
		console.log("list %s",list_id);
		console.log("habit %s",habit_id);
	    var updateListId = "UPDATE habit SET in_list_id = ? WHERE habit_id = ?";
	    let result = await con.query(updateListId,[list_id,habit_id]);
	    console.log(result);
	},

	setFrequency: setFrequency,

	getTimes: getTimes,

	deleteFrequency: function(id) {
		console.log("++++Handeling sqlDeleteFrequency++++");
	    var deleteFrequencyQuery = "DELETE FROM frequency WHERE habit_id = ?";
	    con.query(deleteFrequencyQuery,[id]);
	},	

	updateHabitList: async function(exsits,habit,callbackSetInList) {
		console.log("++++Handeling updateHabitList++++");
	    let inlist = 0;
	    if(!exsits) {
	        var addCat = "INSERT INTO habitlistcatelog (owned_by,title) VALUES ?";
	        values = [
	            ["1",habit.category]
	        ];
	        let result = await con.query(addCat, [values]);
	        console.log(result[0].insertId);
	        inlist = result[0].insertId;
	        console.log(inlist);
	        return inlist;
	    } else {
	        var selectCat = "SELECT habit_list_id FROM habitlistcatelog WHERE title = ?"
	        let result = await con.query(selectCat, [habit.category]);
	        inlist = result[0][0].habit_list_id;
	        return inlist;
	    }
	},

	deleteHabit: function(habitId) {
		var deleteQuery = "DELETE FROM habit WHERE habit_id = ?";
			con.query(deleteQuery, [habitId], function(err,result) {
	        if(err){console.log(err);}
	        console.log(result.affectedRows)
	    });
	},

	sqlHabits: sqlHabits,
	nextHabitId: nextHabitId,
    login: login
}