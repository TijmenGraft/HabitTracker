const path = require('path');
const sqlModuleHabit = require('./sqlModuleHabit');
const usefullFunction = require('./usefullFunction');
const sqlModuleAnalytics = require('./sqlModuleAnalytics');

function logger(req,res,next) {
	console.log('%s\t%s\t%s', new Date(), req.method, req.url);
	next();
}

module.exports = function(app,habitArr,articalArr) {
	app.use(logger);

	app.post('/login', async function(req,res,next){
		var result = await sqlModuleHabit.login(req);
		console.log('++++CALLBACK RESULT++++')
		console.log(result);
		if(result > 0) {
			res.redirect('/html/habits/'+result);
		} else {
			res.end();
		}
	})

	app.get("/showHabits", function(req, res) {
		var data = usefullFunction.organiseIntoCategory(habitArr);
	    res.render('habitPageTemplate.ejs',{habit_array: data})
	});

	app.get('/h[ae](bit|01)?(s+)|html[/-]ha(bit|[01])?(s+)|fr(e)?q(uenc)?y', function(req,res,next) {
		var data = usefullFunction.organiseIntoCategory(habitArr);
		console.log(articalArr);
	    res.render('habitPageTemplate.ejs',{habit_array: data, artical_array: articalArr});
	});

	app.get('/newhabit', function(req,res,next) {
		var categories = usefullFunction.allCategories(habitArr);
		res.render('addHabitTemplate.ejs',{ category_array: categories});
	});

	app.post("/addHabit", async function(req,res,next){
	    var formObj = JSON.stringify(req.body);
	    var JsonObj = JSON.parse(formObj);
	    var newCat = await usefullFunction.checkIfCategoryExsits(habitArr,JsonObj[1].value);
	    try {
	    	let a = await sqlModuleHabit.getMaxId();
	    	let newHabit = await usefullFunction.habitHandelingFormData(habitArr,a,JsonObj);
		    sqlModuleHabit.sqlInsertHabit(newCat, newHabit, sqlModuleHabit.setInList, sqlModuleHabit.setFrequency);
		    habitArr.push(newHabit);
		    res.end('{"success" : "Updated Successfully", "status" : 200}');
	    } catch(e) {
	    	console.log(e);
	    }
	});

	app.get('/requestHabit/:habitId', function(req,res,next) {
		var habit = usefullFunction.selectHabitById(habitArr,req.params.habitId);
		console.log(habit);
		console.log("trying to render");
		res.render('updateHabitTemplate.ejs',{ habit_obj: habit });
	});

	app.get("/requestHabit", function(req,res) {
	    var habitId = req.query.id;
	    var selectedHabit = usefullFunction.selectHabitById(habitId);
	    if(selectedHabit === false) {
	        res.status(404).json({
	            error: "Couldnt find the habit"
	        });
	    } else {
	        res.json(selectedHabit);
	    }
	});

	app.post("/update", function(req, res) {
	    var formObj = JSON.stringify(req.body);
	    var JsonObj = JSON.parse(formObj);
	    var id = JsonObj[0].value;
	    JsonObj.splice(0,1);
	    var updateHabit = usefullFunction.habitHandelingFormData(habitArr,id,JsonObj);
	    console.log(updateHabit);
	    var newCat = usefullFunction.checkIfCategoryExsits(habitArr,JsonObj[1].value);
	    sqlModuleHabit.sqlUpdateHabit(newCat,updateHabit,sqlModuleHabit.deleteFrequency,sqlModuleHabit.updateHabitList,sqlModuleHabit.setInList,sqlModuleHabit.updateHabitList);
	    var position = usefullFunction.habitsPosition(habitArr,id);
	    habitArr.splice(position,1);
	    habitArr.splice(--position,0,updateHabit);
	    res.send(updateHabit);
	});

	app.get("/habitDone", function(req,res) {
	    var habitId = req.query.id;
	    var selectedHabit = usefullFunction.selectHabitById(habitId);
	    var today = new Date();
	    var day = today.getDate();
	    var month = today.getMonth()+1;
	    var year = today.getFullYear();
	    var input = day + "-" + month + "-" + year;
	    selectedHabit.checkDate.push(input);
	    sqlModuleHabit.sqlHabitDone(selectedHabit,today);
	    if(selectedHabit === false) {
	        res.status(404).json({
	            error: "Couldnt update the habit"
	        });
	    } else {
	        res.json("Checked successfull");
	    }
	});

	app.get("/removeHabit", function(req,res) {
	    var habitId = req.query.id;
	    var position = usefullFunction.habitsPosition(habitArr,habitId);
	    habitArr.splice(position,1);
	    sqlModuleHabit.deleteHabit(habitId);
	});

	app.get('/login', function(req,res) {
		console.log(req.body);
	});

	app.get('register', function(req,res) {

	});

	app.get('/salt', function(req,res) {
		console.log("sending salt");
		res.end();
	});
}