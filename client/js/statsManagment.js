var main = function() {
	var drawTotalHabitOnDayChart = function(dayDataArray) {
		var chart = new CanvasJS.Chart("chartContainer", {
			theme: "light1",
			animationEnabled: true,
			title:{
				text:"First chart"
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
		var dArr = [];
		for(var i = 0; i < 6; ++i) {
			var d = new Date(pastSevenDaysArray[0][0])
			dArr.push(d.getTime());
		}
		var chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			title: {
				text: "Hourly Average CPU Utilization"
			},
			axisX: {
				title: "Date"
			},
			axisY: {
				title: "Habits",
			},
			data: [{
				type: "line",
				name: "Habit past seven days",
				connectNullData: true,
				//nullDataLineDashType: "solid",
				xValueType: "date",
				xValueFormatString: "YYYY MM DD",
				yValueFormatString: "\"%\"",
				dataPoints: [
					{ x: dArr[0], y: pastSevenDaysArray[0][0] },
					{ x: dArr[1], y: pastSevenDaysArray[1][0] },
					{ x: dArr[2], y: pastSevenDaysArray[2][0] },
					{ x: dArr[3], y: pastSevenDaysArray[3][0] },
					{ x: dArr[4], y: pastSevenDaysArray[4][0] },
					{ x: dArr[5], y: pastSevenDaysArray[5][0] },
					{ x: dArr[6], y: pastSevenDaysArray[6][0] }
				]
			}]
		});
		chart.render();
	}

	var drawTotal;

	var stats = function(data) {
		console.log(data);
		for(var key in data) {
			if(key == "totalHabitOnDay") {
				drawTotalHabitOnDayChart(data["totalHabitOnDay"])
			} else if(key == "habitsPastSevenDays") {
				drawHabitsMadeInPastSevenDays(data["habitsPastSevenDays"])
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