const express = require("express");

module.exports = (function() {
	"use strict";
	var api = express.Router();

	api.get("/register",function(req,res) {
		console.log("register");
		res.send({ some: "json" });
	});

	return api;
})();