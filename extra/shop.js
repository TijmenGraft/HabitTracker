var server = require("server");
var http = require("http");
var url = require("url");
var app;
var walletObject = require("userwallet");
var shop = {
	inventory: require("inventory");
	themes: require("themes");
	avatarAddOns: require("avatarAddOns");
}
var query{
	currency: "SELECT shop_currency FROM users;"
	premiumCurrency: "SELECT shop_premium_currency FROM users;"
}

var port = process.argv[2];
app = server();
http.createserver(app).listen(port);

var tradeCurrencies = function(){
	if(walletObject["premiumCurrency"] >= 100){
		walletObject["premiumCurrency"] -= 100;
		walletObject["currency"] += 1000;
	}
}

var collectDaily = function(){
	walletObject{"premiumCurrency"} += 100;
	var now = $.now;
	var insertDate = "UPDATE users SET last_daily_collect = ?;";
	con.query(dateQuery, [now]);
}

var daySinceLastBonus = function(){
	var dateQuery = "SELECT DATEDIFF(day, last_daily_collect, ?) AS result FROM users;";
	var now = $.now;
	con.query(dateQuery, [now], function(err, result){
		if(err){
			console.log(err);
		}
		if(result.result >= 1){
			return true;
		}
		else{
			return false;
		}
	});
}

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

app.get("/extra/shop", function(req, res){
	con.query(query["currency"], function(err, result){
		if(err){
			console.log(err);
		}
		if(result.length > 1){
			console.log("Error when requesting shop currency: Userdata corrupted.");
		}
		if(result.length == 0){
			console.log("Error when requestion shop currency: User not found or not logged in.");
		}
		if(result.length == 1){
			walletObject["currency"] = result.shop_currency;
		}
	});
	con.query(query["premiumCurrency"], function(err, result){
		if(err){
			console.log(err);
		}
		if(result.length > 1){
			console.log("Error when requesting shop premium currency: Userdata corrupted.");
		}
		if(result.length == 0){
			console.log("Error when requestion shop premium currency: User not found or not logged in.");
		}
		if(result.length == 1){
			walletObject["premiumCurrency"] = result.shop_premium_currency;
		}
	});
	$(#currencyDisplay).text(walletObject["currency"]);
	$(#premiumCurrencyDisplay).text(walletObject{"premiumCurrency"});
	$(#tradePremiumToCommon).onclick = tradeCurrencies;
	if(!daySinceLastBonus){
		$(#dailyBonus).disable(true);
	}
	$(#dailyBonus).onclick = collectDaily;
});

/*
document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
  	document.getElementById("premiumCurrencyDisplay").innerHTML = walletObject["premiumCurrency"];
  	document.getElementById("currencyDisplay").innerHTML = walletObject["currency"];

    document.getElementById("premiumCurrencyIncrease").onclick = function(){
		walletObject["premiumCurrency"] += 100;
	};
  };
};
*/