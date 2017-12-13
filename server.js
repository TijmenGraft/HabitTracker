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
    database: "habittracker"
});

con.connect(function(err) {
    if(err) {
        console.log(err);
    }
    // con.query('INSERT INTO habit VALUES("0","Sports","2","test","1","2018-12-27","2019-12-12","3")', function(err,rows,fields) {
    //     console.log("Addding data");
    // });
    console.log("Connected");
});

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//global variablesid, firstName, middleName, surname, age, gender, bank, articles
var nextHabitId = 4;

var users = [];
var user1 = {
    traits: {
        id: 0,
        firstName: "Tijmen",
        middleName: "van",
        surName: "Graft",
        age: "19",
        gender: "male",
        categoryList: [],
        bank: 0,
        articles: []
    }
}
users.push(user1);

var habits = [];
    var h1 = {
        id: 0,
        name: "Jog everyday",
        type: "1",
        category: "sports",
        frequency: "[ma,tu]",
        description: "I need to jog everyday",
        startDate: "5-12-2017",
        endDate: "5-12-2018",
        checkDate: []
    };
    var h2 = {
        id: 1,
        name: "Stop gaming",
        type: "0",
        category: "gaming",
        frequency: "[ma,tu,we,th,fr,sat,sun]",
        description: "I need to stop gaming so often",
        startDate: "5-12-2017",
        endDate: "5-12-2018",
        checkDate: []
    };
    var h3 = {
        id: 2,
        name: "Take the stairs",
        type: "1",
        category: "walking",
        frequency: "[ma,tu,we,th,fr,sat,sun]",
        description: "I need to stop gaming so often",
        startDate: "5-12-2017",
        endDate: "5-12-2018",
        checkDate: []
    };
    var h4 = {
        id: 3,
        name: "Go to the gym",
        type: "1",
        category: "sports",
        frequency: "[ma,tu]",
        description: "A great man with great responsibilities",
        startDate: "10-12-2017",
        endDate: "15-12-2017",
        checkDate: []
    };
    habits.push(h1);
    habits.push(h2);
    habits.push(h3);
    habits.push(h4);

var queryToHabit = function(row) {
    let dateArr = [];
    con.query("SELECT DW.day_of_week_name FROM habit_day_of_week AS HW JOIN day_of_week AS DW ON HW.day_id = DW.day_of_week_id WHERE HW.habit_id ="+row.id,function(err,rows,field) {
        dateArr = [];
        if(!err) {
            for(var i = 0; i < rows.length; ++i) {
                var date = rows[i].day_of_week_name;
                dateArr.push(date)
            }
             dateArr;
        }
    });
    console.log("Date array:\n")
    console.log(dateArr);
    var habit = {
        id: row.id,
        name: row.title,
        type: row.habit_type,
        frequency: dateArr,
        category: row.habit_category_name,
        description: row.habit_description,
        startDate: row.habit_start_date,
        endDate: row.habit_end_date
    }
    console.log(habit);
}

var habitsDataIdContains = function(id) {
    for(var i = 0; i < habits.length; i++) {
        if(habits[i].id == id) {
            return true;
        }
    }
    return false;
}

var habitsPosition = function(id) {
    for(var i = 0; i < habits.length; i++) {
        if(habits[i].id == id) {
            return i;
        }
    }
    return false;
}

var selectHabitById = function(id) {
    for(var i = 0; i < habits.length; i++) {
        if(habits[i].id == id) {
            return habits[i];
        }
    }
    return false;
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
    var data = [];
    con.query("SELECT H.id, H.habit_title, H.habit_description, H.habit_type, H.habit_start_date, H.habit_end_date, HC.habit_category_name FROM HABIT AS H JOIN habit_category AS HC ON H.habit_category_id = HC.habit_category_id", function(err, rows, fields) {
        if(!err) {
            for(var i = 0; i < rows.length; i++) {
                var newHabit = queryToHabit(rows[i]);
                data.push(rows[i]);
            }
        } else {
            console.log("Something went wrong");
        }
    });
    res.json(habits);
});

app.post("/addHabit", function(req,res){
    var formObj = JSON.stringify(req.body);
    var JsonObj = JSON.parse(formObj);
    var newHabit = habitHandelingFormData(nextHabitId,JsonObj);
    ++nextHabitId;
    habits.push(newHabit);
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
    var position = habitsPosition(id);
    habits.splice(position,1);
    habits.splice(--position,0,updateHabit);
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
    console.log(selectedHabit.checkDate);
    if(selectedHabit === false) {
        res.status(404).json({
            error: "Couldnt update the habit"
        });
    } else {
        res.json("Checked successfull");
    }
    console.log("Request habitdone with: "+habitId);
});

app.get("/removeHabit", function(req,res) {
    var habitId = req.query.id;
    var position = habitsPosition(habitId);
    habits.splice(position,1);
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

