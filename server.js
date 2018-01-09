"use strict"
const express = require("express");
const fs = require("fs");
const http = require("http");
const url = require("url");
const events = require("events");
const nodemailer = require("nodemailer");
const querystring = require("querystring");
const formidable = require("formidable");
const bodyParser = require('body-parser');
const PersonConstructor = require('./client/js/Person.js');
const util = require("util");
const sqlModuleHabit = require("./client/js/module/sqlModuleHabit");
const sqlModuleAnalytics = require("./client/js/module/sqlModuleAnalytics");
const usefullFunction = require("./client/js/module/usefullFunction");
const register = require("./client/js/module/registerModule");
const ejs = require('ejs');
var app = express();

var habitArr = sqlModuleHabit.sqlHabits;
var nextHabitId = sqlModuleHabit.nextHabitId;

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

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views',__dirname + '/template');
app.set('view engine', 'ejs');

require('./extra/router.js')(app,habitArr,sqlModuleHabit,sqlModuleAnalytics,usefullFunction);


/* SETTING UP
* this is the most important method of our application
* this sets up the db connection and fetches all the data from the db
* this also makes sure that they are formatted correctly
* this is an asychronozid method
* this calls to other function that manipulate with the sql data
* the methods are toHabit and getTimes
*/

/* DATA MANIPULATION
* toHabit: gets a sequal row and start progressing also compatible with other type of json formats of the habit
* will not give a frequency to it another method will do that

* getTimes: will add the frequency to the habit it requires the id of the desired habit 

* habitHadnelingFormData: handels the form data from a user and makes a habit of it
*/

app.use("/register",register);

app.post("/login", function(req,res) {
	var username = req.body.login_form_username; //continue here
    var password = req.body.login_form_password;
    console.log(username + " " + password);
});

app.get("/analytics", function(req,res) {
    
    //COUNT ALL THE HABITS
    analyticData.totalHabit = sqlModuleAnalytics.countHabits();
    
    //COUNT ALL THE HABITS WHO NEED TO BE DONE ON A CERTAIN DAY
    for(var i = 0; i < days.length; ++i) {
        analyticData.totalHabitOnDay[i] = sqlModuleAnalytics.sqlAnalyticTotalHabitOnDAy(i);
    }
    //COUNT ALL THE COMPLETED HABITS
    analyticData.habitsCompleted = sqlModuleAnalytics.countAllCompletedHabits();
    
    //COUNT ALL THE COMPLETED HABITS COMPLETED ON A CERTAIN DAY
    for(var i = 0; i < days.length; ++i) {
        var d = new Date();
        d.setDate(d.getDate()-i);
        var endMonth = d.getMonth();
        var date = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
        analyticData.habitsCompletedOnDay[i] = sqlModuleAnalytics.sqlAnalyticHabitDoneOnDay(i,date);
    }
    //COUNT ALL THE HABITS MADE ON A CERTAIN DAY
    analyticData.habitsPastSevenDays = sqlModuleAnalytics.sqlHabitsMadeOnDay();

    //COUNT GOOD VS BAD HABITS WITH A FREQUENCY HIGHER THAN 0
    analyticData.habitsGoodVsBad = sqlModuleAnalytics.sqlGoodVsBad();
    res.json(analyticData);
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

