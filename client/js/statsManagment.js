var main = function() {
	var stats = function(data) {
		console.log(data);
	}

	setInterval(function() {
        if(!blocker) {
            console.log("Didnt get blocked");
            $.getJSON("../analytics", stats);
        } else {
            console.log("I got blocked");
        }
    },1000)
}
$(document).ready(main);