const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kungfu1998",
    database: "habitdatabase"
});

var days = [1,2,3,4,5,6,7];

module.exports = {
	countHabits: function() {
		var countHabits = "SELECT COUNT(*) AS allHabits FROM habit";
	    con.query(countHabits, function(err,result) {
	        if(err) { console.log(err); }
	        return result[0].allHabits;
	    });
	},

	sqlAnalyticTotalHabitOnDAy: function(i) {
	    var countHabitsOnDay = "SELECT COUNT(habit_id) as allHabitsOnDay FROM frequency WHERE date_id = ?";
	    con.query(countHabitsOnDay, [days[i]], function(err,result){
	        if(err) {console.log(err)}
	        return result[0].allHabitsOnDay;	    });
	},

	countAllCompletedHabits: function() {
		var countCompletedHabits = "SELECT COUNT(*) AS completedHabits FROM habit_done";
		con.query(countCompletedHabits, function(err,result) {
	        if(err) {console.log(err)}
	        analyticData.habitsCompleted = result[0].completedHabits;
	    });
	},

	sqlAnalyticHabitDoneOnDay: function(i,date) {
	    var countCompletedHabitsOnDay = "SELECT COUNT(habit_id) AS completedHabitsOnDay FROM habit_done WHERE date_done = ?";
	    con.query(countCompletedHabitsOnDay, [date], function(err,result) {
	        if(err) {console.log(err)}
	        return [date,result[0].completedHabitsOnDay];
	    })
	},

	sqlHabitsMadeOnDay: function() {
		var d = new Date();
	    var startMonth = d.getMonth();
	    var startDate = d.getFullYear() + "-" + (++startMonth) + "-" + d.getDate();
	    d.setDate(d.getDate()-7);
	    var endMonth = d.getMonth();
	    var endDate = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
	    var countHabitsMadeOnInterval = "SELECT COUNT(startdate) AS newHabits, startdate FROM habit WHERE startdate BETWEEN ? AND ? GROUP BY startdate"
	    con.query(countHabitsMadeOnInterval,[endDate,startDate],function(err,result) {
	        if(err){console.log(err)}
	        var temp = [];
	        for(var i = 0; i < 7; ++i) {
	            var d = new Date();
	            d.setDate(d.getDate()-i);
	            var endMonth = d.getMonth();
	            var endDate = d.getFullYear() + "-" + (++endMonth) + "-" + d.getDate();
	            temp.push([endDate,0])
	        }
	        for(var i = 0; i < result.length; ++i) {
	            var d = new Date(result[i].startdate);
	            var checkSumMonth = d.getMonth();
	            var checkSum = d.getFullYear() + "-" + (++checkSumMonth) + "-" + d.getDate();
	            for(var x = 0; x < temp.length; ++x) {
	                var checkDate = new Date(temp[x][0]);
	                var toCheckDate = new Date(checkSum);
	                if(checkDate.getTime() == toCheckDate.getTime()) {
	                    temp[x][1] = result[i].newHabits;
	                }
	            }
	            if(i == result.length-1) {
	                return temp;
	            }
	        }
	    });
	},

	sqlGoodVsBad: function() {
		var countHabitsGoodVsBad = "SELECT COUNT(habit_id) AS goodBadHabit FROM habit AS H1 WHERE H1.type = 1 AND (SELECT COUNT(*) FROM frequency AS FQ WHERE FQ.habit_id = H1.habit_id > 0)UNION ALL SELECT COUNT(habit_id) AS badHabits FROM habit AS H2 WHERE H2.type = 0 AND (SELECT COUNT(*) FROM frequency AS FQ WHERE FQ.habit_id = H2.habit_id > 0)"
	    con.query(countHabitsGoodVsBad, function(err,result) {
	        if(err){console.log(err);}
	        var temp = [];
	        for(var i = 0; i < result.length; ++i) {
	            temp.push(result[i].goodBadHabit);
	            if(i == result.length - 1) {
	                return temp;
	            }
	        }
	    });
	}
}