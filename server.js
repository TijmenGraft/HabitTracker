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
var app = express();

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//global variablesid, firstName, middleName, surname, age, gender, bank, articles

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
        id: "0",
        name: "Jog everyday",
        type: "good",
        category: "sports",
        frequency: "[ma,tu]",
        description: "I need to jog everyday",
        startDate: "5-12-2017",
        endDate: "5-12-2018"
    };
    var h2 = {
        id: "1",
        name: "Stop gaming",
        type: "bad",
        category: "gaming",
        frequency: "[ma,tu,we,th,fr,sa,su]",
        description: "I need to stop gaming so often",
        startDate: "5-12-2017",
        endDate: "5-12-2018"
    };
    var h3 = {
        id: "2",
        name: "Take the stairs",
        type: "bad",
        category: "walking",
        frequency: "[ma,tu,we,th,fr,sa,su]",
        description: "I need to stop gaming so often",
        startDate: "5-12-2017",
        endDate: "5-12-2018"
    };
    var h4 = {
        id: "3",
        name: "Go to the gym",
        type: "good",
        category: "sports",
        frequency: "[ma,tu]",
        description: "A great man with great responsibilities",
        startDate: "10-12-2017",
        endDate: "15-12-2017"
    };
    habits.push(h1);
    habits.push(h2);
    habits.push(h3);
    habits.push(h4);

var habitsDataIdContains = function(id) {
    console.log("length:" + habits.length);
    for(var i = 0; i < habits.length; i++) {
        console.log(habits[i].id);
        if(habits[i].id === id) {
            return true;
        }
    }
    return false;
}

var selectHabitById = function(id) {
    console.log("length: " + habits.length);
    for(var i = 0; i < habits.length; i++) {
        if(habits[i].id === id) {
            return habits[i];
        }
    }
}

var habitHandelingFormData = function(id,data) {
    var frequencyArr = [];
    var i = 3;
    while(data[i].name !== "habit_form_description") {
        console.log(i+" "+data[i].value);
        frequencyArr.push(data[i].value);
        ++i;
    }
    var habit = {
        id: id,
        name: data[0].value,
        type: data[2].value,
        category: data[1].value,
        frequency: frequencyArr,
        description: data[i].value,
        startDate: data[++i].value,
        endDate: data[++i].value
    }
    console.log(habit);
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
    console.log("todos requested");
    res.json(habits);
});

app.post("/addHabit", function(req,res){
    var formObj = JSON.stringify(req.body);
    var JsonObj = JSON.parse(formObj);
    var lastHabit = habits[habits.length - 1];
    var newHabitId = parseInt(lastHabit["id"]) + 1;
    var newHabit = habitHandelingFormData(newHabitId,JsonObj);
    habits.push(newHabit);
    res.send(formObj);
});

app.get("/requestHabit", function(req,res) {
    console.log("I have a get request from requestHabit");
    var habitId = req.query.id;
    var selectedHabit = selectHabitById(habitId);
    console.log(habitId);
    console.log(selectedHabit);
    res.send("get reacting");
});

app.get("/update", function(req, res) {
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    if(queryData.id !== undefined && habitsDataIdContains(queryData.id)) {
        console.log("could find it");
        var position = habitsDataIdPosition(queryData.id);
        console.log("Position:" + position);
        habits[position] = {
            id: queryData.id,
            name: queryData.change_habit_form_title,
            type: queryData.change_habit_form_type,
            category: "sport",
            frequency: queryData.change_habit_form_frequency,
            description: queryData.change_habit_form_description,
            startDate: queryData.change_habit_form_start_date,
            endDate: queryData.change_habit_form_end_date
        }
    }
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

