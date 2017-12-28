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
const sqlModuleHabit = require("./client/js/module/sqlModuleHabit");
var app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

var analyticData = {
    totalHabit: 0,
    totalHabitOnDay: [
        0,0,0,0,0,0,0
    ],
    habitsCompleted: 0,
    habitsCompletedOnDay: [
        0,0,0,0,0,0,0
    ],
    habitsPastSevenDays: [
    ],
    habitsGoodVsBad: [
    ]
}
var test = "totalHabit";
console.log("Test" + analyticData.totalHabitOnDay[0])

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

var sqlAnalyticTotalHabitOnDAy = function(i,date) {
    var countHabitsOnDay = "SELECT COUNT(habit_id) as allHabitsOnDay FROM frequency WHERE date_id = ?";
    con.query(countHabitsOnDay, [date], function(err,result){
        if(err) {console.log(err)}
        analyticData.totalHabitOnDay[i] = result[0].allHabitsOnDay;
        console.log(result[0])
    });
}

var sqlAnalyticHabitDoneOnDay = function(i,date) {
    var countCompletedHabitsOnDay = "SELECT COUNT(habit_id) AS completedHabitsOnDay FROM habit_done WHERE date_done = ?";
    con.query(countCompletedHabitsOnDay, [date], function(err,result) {
        if(err) {console.log(err)}
        console.log(date);
        analyticData.habitsCompletedOnDay[i] = [date,result[0].completedHabitsOnDay];
    })
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
    sqlModuleHabit.sqlInsertHabit(newCat, newHabit, sqlModuleHabit.setInList, sqlModuleHabit.setFrequency);
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
    sqlModuleHabit.sqlUpdateHabit(newCat,sqlModuleHabit.updateHabit,sqlModuleHabit.deleteFrequency,sqlModuleHabit.updateHabitList,sqlModuleHabit.setInList);
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
    sqlModuleHabit.sqlHabitDone(selectedHabit,today);
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
    sqlModuleHabit.deleteHabit(habitId);
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
    for(var i = 0; i < days.length; ++i) {
        sqlAnalyticTotalHabitOnDAy(i,days[i]);
    }
    //COUNT ALL THE COMPLETED HABITS 
    var countCompletedHabits = "SELECT COUNT(*) AS completedHabits FROM habit_done";
    con.query(countCompletedHabits, function(err,result) {
        if(err) {console.log(err)}
        console.log(result[0]);
        analyticData.habitsCompleted = result[0].completedHabits;
    });
    //COUNT ALL THE COMPLETED HABITS COMPLETED ON A CERTAIN DAY
    for(var i = 0; i < days.length; ++i) {
        var d = new Date();
        d.setDate(d.getDate()-i);
        var endMonth = d.getMonth();
        var date = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
        sqlAnalyticHabitDoneOnDay(i,date);
    }
    //COUNT ALL THE HABITS MADE ON A CERTAIN DAY
    var d = new Date();
    var startMonth = d.getMonth();
    var startDate = d.getFullYear() + "-" + (++startMonth) + "-" + d.getDate();
    d.setDate(d.getDate()-7);
    var endMonth = d.getMonth();
    var endDate = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
    console.log()
    var countHabitsMadeOnInterval = "SELECT COUNT(startdate) AS newHabits, startdate FROM habit WHERE startdate BETWEEN ? AND ? GROUP BY startdate"
    con.query(countHabitsMadeOnInterval,[endDate,startDate],function(err,result) {
        if(err){console.log(err)}
            console.log(result);
        var temp = [];
        for(var i = 0; i < 7; ++i) {
            var d = new Date();
            d.setDate(d.getDate()-i);
            var endMonth = d.getMonth();
            var endDate = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
            temp.push([endDate,0])
        }
        for(var i = 0; i < result.length; ++i) {
            var d = new Date(result[i].startdate);
            var checkSumMonth = d.getMonth();
            var checkSum = d.getFullYear() + "-" + (++checkSumMonth) + "-" + d.getDate();
            for(var x = 0; x < temp.length; ++x) {
                var checkDate = new Date(temp[x][0]);
                var toCheckDate = new Date(checkSum);
                if(checkDate.getTime() == toCheckDate.getTime()) {
                    temp[x][1] = result[i].newHabits;
                    console.log(temp[x][1]);
                    console.log(result[i].newHabits);
                }
            }
            if(i == result.length-1) {
                console.log("sending back data");

                analyticData.habitsPastSevenDays = temp;
                console.log(analyticData);
            }
        }
    });
    //COUNT GOOD VS BAD HABITS WITH A FREQUENCY HIGHER THAN 0
    var countHabitsGoodVsBad = "SELECT COUNT(habit_id) AS goodBadHabit FROM habit AS H1 WHERE H1.type = 1 AND (SELECT COUNT(*) FROM frequency AS FQ WHERE FQ.habit_id = H1.habit_id > 0)UNION ALL SELECT COUNT(habit_id) AS badHabits FROM habit AS H2 WHERE H2.type = 0 AND (SELECT COUNT(*) FROM frequency AS FQ WHERE FQ.habit_id = H2.habit_id > 0)"
    con.query(countHabitsGoodVsBad, function(err,result) {
        if(err){console.log(err);}
        console.log(result);
        var temp = [];
        for(var i = 0; i < result.length; ++i) {
            temp.push(result[i].goodBadHabit);
            if(i == result.length - 1) {
                analyticData.habitsGoodVsBad = temp;
            }
        }
    });
    res.json(analyticData);
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

