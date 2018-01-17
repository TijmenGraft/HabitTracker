var walletObject = require("userwallet");
var shop = {
	inventory: require("inventory");
	themes: require("themes");
	avatarAddOns: require("avatarAddOns");
}

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
  	document.getElementById("premiumCurrencyDisplay").innerHTML = walletObject["premiumCurrency"];
  	document.getElementById("currencyDisplay").innerHTML = walletObject["currency"];

    document.getElementById("premiumCurrencyIncrease").onclick = function(){
		walletObject["premiumCurrency"] += 100;
	};
  };
};