"use strict"
const express = require("express");
const fs = require("fs");
const http = require("http");
const url = require("url");
const events = require("events");
const nodemailer = require("nodemailer");
const querystring = require("querystring");
const formidable = require("formidable");
const bodyParser = require('body-parser')
const PersonConstructor = require('./client/js/Person.js');
const util = require("util");
const mysql = require("mysql");
var app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

var analyticData = {
    totalHabit: 0,
    totalHabitOnDay: {
        ma: 0,
        tu: 0,
        we: 0,
        th: 0,
        fr: 0,
        sa: 0,
        su: 0
    },
    habitsCompleted: 0,
    habitsCompletedOnDay: {
        ma: 0,
        tu: 0,
        we: 0,
        th: 0,
        fr: 0,
        sa: 0,
        su: 0
    },
}
var test = "totalHabit";
console.log("Test" + analyticData.totalHabitOnDay.ma)

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/* SETTING UP
* this is the most important method of our application
* this sets up the db connection and fetches all the data from the db
* this also makes sure that they are formatted correctly
* this is an asychronozid method
* this calls to other function that manipulate with the sql data
* the methods are toHabit and getTimes
*/
var nextHabitId = 9999;
var sqlHabits = [];
(function setUp() {
    console.log("Setting up storage");
    var maxID = "SELECT habit_id FROM habit ORDER BY habit_id DESC LIMIT 1;";
    con.query(maxID, function(err, result) {
        if(err) {
            console.log(err)
        }
        nextHabitId = ++result[0].habit_id;
    }) ;
    var query = "SELECT H.habit_id, H.title, H.type, HC.title AS category, H.description, H.startdate, H.enddate FROM habit AS H JOIN habitlistcatelog AS HC ON H.in_list_id = HC.habit_list_id WHERE H.in_list_id IS NOT NULL";
    con.query(query, function(err,result) {
        if(err) {
            console.log(err);
        }
        for(var i = 0; i < result.length; ++i) {
            var habit = toHabit(result[i]);
            var id = habit.id;
            var frequency = getTimes(id);
            sqlHabits.push(habit);
        }
    });
})();


var habitsDataIdContains = function(id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return true;
        }
    }
    return false;
}

var habitsPosition = function(id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return i;
        }
    }
    return false;
}

var selectHabitById = function(id) {
    for(var i = 0; i < sqlHabits.length; i++) {
        if(sqlHabits[i].id == id) {
            return sqlHabits[i];
        }
    }
    return false;
}

var checkIfCategoryExsits = function(category) {
    for(var i = 0; i < sqlHabits.length; ++i) {
        if(sqlHabits[i].category == category) {
            return true;
        }
    }
    return false;
}
/* DATA MANIPULATION
* toHabit: gets a sequal row and start progressing also compatible with other type of json formats of the habit
* will not give a frequency to it another method will do that

* getTimes: will add the frequency to the habit it requires the id of the desired habit 

* habitHadnelingFormData: handels the form data from a user and makes a habit of it
*/
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

var getTimes = function(id) {
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
}



var habitHandelingFormData = function(id,data) {
    var frequencyArr = [];
    var i = 3;
    while(data[i].name !== "habit_form_description") {
        if(data[i].name == "change_habit_form_description") {
            break;
        }
        frequencyArr.push(data[i].value);
        ++i;
    }
    if(habitsDataIdContains(id)) {
        var oldHabit = selectHabitById(id);
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


var sqlInsertHabit = function(exsits, habit, callback, callbackFreq) {
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
        [ habit.id, null, habit.name, habit.type, habit.description, habit.startdate, habit.endDate ]
    ];
    con.query(insertQuery, [values], function(err,result) {
        if(err) {
            console.log(err);
        }
        callbackFreq(habit.id,habit.frequency);
    });
};

var sqlUpdateHabit = function(exsists,habit,callbackDeleteFrequency,callbackUpdateHabitlist,callbackSetInList) {
    callbackDeleteFrequency(habit.id,habit.frequency,setFrequency);
    callbackUpdateHabitlist(exsists,habit,callbackSetInList);
    var updateHabit = "UPDATE habit SET title = ?, type = ?, description = ? WHERE habit_id = ?";
    con.query(updateHabit, [habit.name,habit.type,habit.description,habit.id], function(err,result) {
        if(err){console.log(err);}
        console.log(result.affectedRows);
    })
}

var sqlHabitDone = function(habit,date) {
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
}

var setInList = function(list_id,habit_id) {
    var updateListId = "UPDATE habit SET in_list_id = ? WHERE habit_id = ?";
    con.query(updateListId,[list_id,habit_id], function(err,result) {
        if(err) {
            console.log(err);
        }
    });
};

var setFrequency = function(id,habitFrequency) {
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
};

var deleteFrequency = function(id,habitFrequency,callbackSetFrequency) {
    var deleteFrequencyQuery = "DELETE FROM frequency WHERE habit_id = ?";
    con.query(deleteFrequencyQuery,[id], function(err,result) {
        if(err){console.log(err);}
        console.log(result);
        if(callbackSetFrequency && habitFrequency) {
            callbackSetFrequency(id,habitFrequency);
        }
    });
};

var updateHabitList = function(exsits,habit,callbackSetInList) {
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
}

var analyticsDataHandel = function() {

};

app.get("/",function(req,res) {
	console.log(req.url);
	if (req.method.toLowerCase() == 'get') {
        displayPage(req,res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req,res);
    }
	console.log("We have a get request");
});

app.get("/showHabits", function(req, res) {
    res.json(sqlHabits);
});

app.post("/addHabit", function(req,res){
    var formObj = JSON.stringify(req.body);
    var JsonObj = JSON.parse(formObj);
    var newCat = checkIfCategoryExsits(JsonObj[1].value);
    var newHabit = habitHandelingFormData(nextHabitId,JsonObj);
    ++nextHabitId;
    sqlInsertHabit(newCat, newHabit, setInList, setFrequency);
    sqlHabits.push(newHabit);
    res.send(formObj);
});

app.get("/requestHabit", function(req,res) {
    var habitId = req.query.id;
    console.log(habitId);
    var selectedHabit = selectHabitById(habitId);
    if(selectedHabit === false) {
        res.status(404).json({
            error: "Couldnt find the habit"
        });
    } else {
        console.log(selectedHabit);
        res.json(selectedHabit);
    }
});

app.post("/update", function(req, res) {
    var formObj = JSON.stringify(req.body);
    var JsonObj = JSON.parse(formObj);
    var id = JsonObj[0].value;
    JsonObj.splice(0,1);
    var updateHabit = habitHandelingFormData(id,JsonObj);
    var newCat = checkIfCategoryExsits(JsonObj[1].value);
    sqlUpdateHabit(newCat,updateHabit,deleteFrequency,updateHabitList,setInList);
    var position = habitsPosition(id);
    sqlHabits.splice(position,1);
    sqlHabits.splice(--position,0,updateHabit);
    res.send(updateHabit);
});

app.get("/habitDone", function(req,res) {
    var habitId = req.query.id;
    var selectedHabit = selectHabitById(habitId);
    var today = new Date();
    console.log(today);
    var day = today.getDate();
    var month = today.getMonth()+1;
    var year = today.getFullYear();
    var input = day + "-" + month + "-" + year;
    selectedHabit.checkDate.push(input);
    sqlHabitDone(selectedHabit,today);
    if(selectedHabit === false) {
        res.status(404).json({
            error: "Couldnt update the habit"
        });
    } else {
        res.json("Checked successfull");
    }
});

app.get("/removeHabit", function(req,res) {
    var habitId = req.query.id;
    var position = habitsPosition(habitId);
    sqlHabits.splice(position,1);
    var deleteQuery = "DELETE FROM habit WHERE habit_id = ?";
    con.query(deleteQuery, [habitId], function(err,result) {
        if(err){console.log(err);}
        console.log(result.affectedRows)
    });
});

app.post("/register", function(req,res) {
    var fields = [];
    var email = req.body.reg_form_email;
    fields["email"] = email;
    var username = req.body.reg_form_username;
    fields["username"] = username;
    var password = req.body.reg_form_password;
    fields["password"] = password;
    var comfirm_password = req.body.reg_form_password_comfirm;
    fields["comfirm_password"] = comfirm_password;
    console.log(email + " " + username + " " + password + " " + comfirm_password);
    console.log(fields);
    res.redirect('back');	
});

app.post("/login", function(req,res) {
	var username = req.body.login_form_username; //continue here
    var password = req.body.login_form_password;
    console.log(username + " " + password);
});

app.get("/analytics", function(req,res) {
    var days = [1,2,3,4,5,6,7];
    //COUNT ALL THE HABITS
    var countHabits = "SELECT COUNT(*) AS allHabits FROM habit";
    con.query(countHabits, function(err,result) {
        if(err) { console.log(err); }
        analyticData.totalHabit = result[0].allHabits;
        console.log(result[0])
    });
    //COUNT ALL THE HABITS WHO NEED TO BE DONE ON A CERTAIN DAY
    var countHabitsOnDay = "SELECT COUNT(habit_id) as allHabitsOnDay FROM frequency WHERE date_id = ?";
    for(var i = 0; i < days.length; ++i) {
        con.query(countHabitsOnDay, [days[i]], function(err,result){
            if(err) {console.log(err)}
            console.log(result[0])
        });
    }
    //COUNT ALL THE COMPLETED HABITS 
    var countCompletedHabits = "SELECT COUNT(*) AS completedHabits FROM habit_done";
    con.query(countCompletedHabits, function(err,result) {
        if(err) {console.log(err)}
        console.log(result[0]);
    });
    //COUNT ALL THE COMPLETED HABITS COMPLETED ON A CERTAIN DAY
    var countCompletedHabitsOnDay = "SELECT COUNT(habit_id) AS completedHabitsOnDay FROM habit_done WHERE date_done = ?";
    for(var i = 0; i < days.length; ++i) {
        con.query(countCompletedHabitsOnDay, [days[i]], function(err,result) {
            if(err) {console.log(err)}
            console.log(result[0]);
        })
    }
});

app.get("*", function(req,res){
	fs.readFile(__dirname + "/client/html/errorpage.html", function(err,data){
		if(err) {
			console.log(err);
		}
		res.writeHead(200, {
			"Content-type":"text/html",
			"Content-length":data.length
		});
		res.write(data);
		res.end();
	});
});

function displayPage(req,res) {
	fs.readFile(__dirname + "/splash.html", function(err,data){
        if(err) {
            console.log(err);
        }
        res.writeHead(200, {
            "Content-type":"text/html",
            "Content-length":data.length
        });
        res.write(data);
        res.end();
    });
}

var server = app.listen(8080, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server is listening on %s:%s", host, port);
});

