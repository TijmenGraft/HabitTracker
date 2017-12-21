var main = function() {
	var drawTotalHabitOnDayChart = function(dayDataArray) {
		var chart = new CanvasJS.Chart("chartContainer", {
			theme: "light1",
			animationEnabled: true,
			title:{
				text:"Total habits made on each day"
			},
			data: [{
				type: "column",
				dataPoints: [
					{label: "Monday:", y: dayDataArray[0]},
					{label: "Tuesday:", y: dayDataArray[1]},
					{label: "Wednesday:", y: dayDataArray[2]},
					{label: "Thursday:", y: dayDataArray[3]},
					{label: "Friday:", y: dayDataArray[4]},
					{label: "Saturday:", y: dayDataArray[5]},
					{label: "Sunday:", y: dayDataArray[6]}
				]
			}]
		});
		chart.render();
	};

	var drawHabitsMadeInPastSevenDays = function(pastSevenDaysArray) {
		var chart = new CanvasJS.Chart("pastSevenDaysContainer", {
			animationEnabled: true,
			title: {
				text: "Number of habits made in past seven days"
			},
			axisX: {
				title: "Date"
			},
			axisY: {
				title: "Habits",
			},
			data: [{
				type: "column",
				name: "Habit past seven days",
				showInLegend: true, 
				legendMarkerColor: "grey",
				legendText: "NHD = Numbers of habits each day",
				dataPoints: [      
					{ y: pastSevenDaysArray[0][1], label: pastSevenDaysArray[0][0] },
					{ y: pastSevenDaysArray[1][1],  label: pastSevenDaysArray[1][0] },
					{ y: pastSevenDaysArray[2][1],  label: pastSevenDaysArray[2][0] },
					{ y: pastSevenDaysArray[3][1],  label: pastSevenDaysArray[3][0] },
					{ y: pastSevenDaysArray[4][1],  label: pastSevenDaysArray[4][0] },
					{ y: pastSevenDaysArray[5][1], label: pastSevenDaysArray[5][0] },
					{ y: pastSevenDaysArray[6][1],  label: pastSevenDaysArray[6][0] }
				]
			}]
		});
		chart.render();
	}

	var drawHabitVsHabitDone = function(habitVsHabitDoneArray) {
		var chart = new CanvasJS.Chart("habitVsHaitDoneContainer", {
		theme: "light2", // "light1", "light2", "dark1", "dark2"
		exportEnabled: false,
		animationEnabled: true,
		title: {
			text: "Desktop Browser Market Share in 2016"
		},
		data: [{
			type: "pie",
			startAngle: 25,
			toolTipContent: "<b>{label}</b>: {y}%",
			showInLegend: "true",
			legendText: "{label}",
			indexLabelFontSize: 16,
			indexLabel: "{label} - {y}%",
			dataPoints: [
				{ y: 51.08, label: "Chrome" },
				{ y: 27.34, label: "Internet Explorer" },
				{ y: 10.62, label: "Firefox" },
				{ y: 5.02, label: "Microsoft Edge" },
				{ y: 4.07, label: "Safari" },
				{ y: 1.22, label: "Opera" },
				{ y: 0.44, label: "Others" }
			]
		}]
		});
		chart.render();
	}

	var drawHabitGoodVsBad = function(habitGoodVsBadArray) {
		var total = (habitGoodVsBadArray[0] + habitGoodVsBadArray[1]);
		var x1 = (habitGoodVsBadArray[0]/total)*100;
		var x2 = (habitGoodVsBadArray[1]/total)*100;
		var chart = new CanvasJS.Chart("goodVsbadContainer", {
		theme: "light2", // "light1", "light2", "dark1", "dark2"
		exportEnabled: false,
		animationEnabled: true,
		title: {
			text: "Distrubution of good and bad habits"
		},
		data: [{
			type: "pie",
			startAngle: 25,
			toolTipContent: "<b>{label}</b>: {y}%",
			showInLegend: "true",
			legendText: "{label}",
			indexLabelFontSize: 16,
			indexLabel: "{label} - {y}%",
			dataPoints: [
				{ y: x1, label: "Good"},
				{ y: x2, label: "Bad" }
			]
		}]
		});
		chart.render();
	}

	var drawHabitDoneLastSevenDay = function(habitDoneLastDayArray) {
		console.log(habitDoneLastDayArray);
		var chart = new CanvasJS.Chart("pastSevenDaysDoneContainer", {
			animationEnabled: true,
			title: {
				text: "Number of habits done in past seven days"
			},
			axisX: {
				title: "Date"
			},
			axisY: {
				title: "Habits",
			},
			data: [{
				type: "column",
				name: "Habit past seven days",
				showInLegend: true, 
				legendMarkerColor: "grey",
				legendText: "NHD = Numbers of habits each day",
				dataPoints: [      
					{ y: habitDoneLastDayArray[0][1], label: habitDoneLastDayArray[0][0] },
					{ y: habitDoneLastDayArray[1][1], label: habitDoneLastDayArray[1][0] },
					{ y: habitDoneLastDayArray[2][1], label: habitDoneLastDayArray[2][0] },
					{ y: habitDoneLastDayArray[3][1], label: habitDoneLastDayArray[3][0] },
					{ y: habitDoneLastDayArray[4][1], label: habitDoneLastDayArray[4][0] },
					{ y: habitDoneLastDayArray[5][1], label: habitDoneLastDayArray[5][0] },
					{ y: habitDoneLastDayArray[6][1], label: habitDoneLastDayArray[6][0] }
				]
			}]
		});
		chart.render();
	}

	var stats = function(data) {
		console.log(data);
		for(var key in data) {
			if(key == "totalHabitOnDay") {
				drawTotalHabitOnDayChart(data["totalHabitOnDay"])
			} else if(key == "habitsPastSevenDays") {
				drawHabitsMadeInPastSevenDays(data["habitsPastSevenDays"])
			} else if(key == "habitsCompletedOnDay") {
				drawHabitVsHabitDone(data["habitsCompletedOnDay	"]);
			} else if(key == "habitsGoodVsBad") {
				drawHabitGoodVsBad(data["habitsGoodVsBad"])	;
			} else if(key == "habitsCompletedOnDay") {
				drawHabitDoneLastSevenDay(data["habitsCompletedOnDay"])
			}
		}
	}

	$.getJSON("../analytics",stats);

	setInterval(function() {
        if(!blocker) {
            $.getJSON("../analytics", stats);
        } 
    },120000)
}
$(document).ready(main);