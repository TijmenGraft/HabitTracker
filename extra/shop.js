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
	currency: "SELECT shop_currency FROM users WHERE user_id = ;"
	premiumCurrency: "SELECT shop_premium_currency FROM users WHERE user_id = ;"
}

var port = process.argv[2];
app = server();
http.createserver(app).listen(port);

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