"use strict"
const express = require("express");
const fs = require("fs");
const http = require("http");
const url = require("url");
const events = require("events");
const nodemailer = require("nodemailer");
const querystring = require("querystring");
const formidable = require("formidable");
const bodyparser = require("body-parser");
const util = require("util");
var app = express();

app.use(express.static(__dirname + '/public'));

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

app.post("/register", function(req,res) {
	var email = req.body.reg_form_email;
	var username = req.body.req_form_username;
	var password = req.body.req_form_password;
	var comfirm_password = req.body.req_form_comfirm_password;
	console.log(email + " " + username + " " + password + " " + comfirm_password);
});

app.post("/login", function(req,res) {
	var username = ; //continue here
	var password = ;
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

function processFormFieldsIndividual(req, res) {
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on("field", function(field,value){
        console.log(field + " : " + value);
        fields[field] = value;
    });

    form.on("file", function(name,file){
        console.log(name + " : " + file);
        fields[name] = file;
    });

    form.on("progress", function(bytesReceived, bytesExpected) {
        var progress = {
            type: "progress",
            bytesReceived : bytesReceived,
            bytesExpected : bytesExpected
        };
        console.log(progress);
    });

    form.on("end", function() {
        res.writeHead(200, {
            "content-type":"text/plain"
        });
        res.write("received the data: \n\n");
        res.end(util.inspect({
            fields: fields
        }));
    });
    form.parse(req);
}

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server is listening on %s:%s", host, port);
});