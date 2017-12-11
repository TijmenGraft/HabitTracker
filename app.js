"use strict";
//Package required for having a normal working server
const http = require("http");
const fs = require("fs");
const url = require("url");
const events = require("events");
const nodemailer = require("nodemailer");
const querystring = require("querystring");
const formidable = require("formidable");
const util = require("util");

var eventEmitter = new events.EventEmitter();


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tijmengraft@gmail.com",
        pass: "Kungfu1998"
    }
});

var mailOptions = {
    from: "tijmengraft@gmail.com",
    to: "tijmengraft@gmail.com",
    subject: "this is a node.js test mail",
    text: "<h1>easy</h1> message",
    html: "<h1>Easy</h1>"
}

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        
        displayPage(req,res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req,res);
    }
});
/**
 * this fucntion will give us the displayPage when we call it
 * @param {*} res 
 */
function displayPage(req,res) {
    console.log(req.url);
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
    if(req.url.indexOf('.css') != -1) {
        var q = url.parse(req.url, true);
        var pathCssFile = q.pathname;
        console.log(pathCssFile);
        console.log(__dirname + pathCssFile);
        fs.readFile(__dirname + pathCssFile, function(err,data){
            if(err) {
                console.log(err);
                res,writeHead(404, {
                    "Content-type":"text/html"
                });
                return res.end("404 Not Found");
            }
            res.writeHead(200, {
                "Content-type":"text/css",
                "Content-length":data.length
            });
            console.log("We got this far");
            res.write(data);
            res.end();
        });
    }
};

/**
 * This method will handle forms when a post requist is coming in
 * @param {*} req 
 * @param {*} res 
 */
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

// transporter.sendMail(mailOptions, function(error, info) {
//     if(error) {
//         console.log(error);
//     } 
//     else {
//         console.log("Email sent:"+ info.response);
//     }
// });

server.listen(8080);
console.log("Server listening");

