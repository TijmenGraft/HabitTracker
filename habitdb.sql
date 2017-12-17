CREATE TABLE user(
	user_id int(6),
	username varchar(50) NOT NULL,
	password varchar(128) NOT NULL,
	email varchar(128) NOT NULL,
	firstname varchar(128) NOT NULL,
	middlename varchar(128),
	lastname varchar(128) NOT NULL,
	gender varchar(128),
	age int(4) NOT NULL,
	bank int(9) SET DEFAULT 0,
	CONSTRAINT PK_USER_ID PRIMARY KEY(user_id),
	CONSTRAINT UC_USERNAME UNIQUE(username)
);

CREATE TABLE habitlistcatelog(
	habit_list_id int(6) NOT NULL,
	owned_by int(6) NOT NULL,
	title varchar(128) NOT NULL,
	description text,
	CONSTRAINT PK_HABIT_LIST_ID PRIMARY KEY(habit_list_id),
	CONSTRAINT FK_USER_ID FOREIGN KEY (owned_by) REFERENCES user(user_id)
		ON DELETE CASCADE,
	CONSTRAINT UC_OWNED_TITLE UNIQUE(owned_by,title)
);

CREATE TABLE habit(
	habit_id int(6),
	in_list_id int(6),
	title varchar(128),
	type int(1), /* 1 is for a good habit 0 is for a bad habit*/
	description text,
	startdate date,
	enddate date,
	CONSTRAINT PK_HABIT_ID PRIMARY KEY(habit_id),
	CONSTRAINT FK_IN_LIST_ID FOREIGN KEY(in_list_Id) REFERENCES habitlistcatelog(habit_list_id)
		ON DELETE SET NULL
);

CREATE TABLE dates(
	date_id int(2),
	date_name varchar(3),
	date_title varchar(20),
	CONSTRAINT PK_DATE_ID PRIMARY KEY(date_id),
);

CREATE TABLE habit_done(
	habit_id int(6),
	date_done int(6),
	bonus boolean SET DEFAULT 0,
	CONSTRAINT PK_HABIT_ID_DATE_DONE PRIMARY KEY(habit_id,date_done)
);

CREATE TABLE frequency(
	habit_id int(6),
	date_id int(6),
	CONSTRAINT PK_HABIT_ID_DATE_ID PRIMARY KEY(habit_id,date_id),
	CONSTRAINT FK_HABIT_ID FOREIGN KEY(habit_id) REFERENCES habit(habit_id),
	CONSTRAINT FK_DATE_ID FOREIGN KEY(date_id) REFERENCES dates(date_id)
);
/*Dumping all the days of the weeks in the db*/
INSERT INTO dates VALUES(1,"mo","monday");
INSERT INTO dates VALUES(2,"tu","tuesday");
INSERT INTO dates VALUES(3,"we","wednesday");
INSERT INTO dates VALUES(4,"th","thursday");
INSERT INTO dates VALUES(5,"fr","friday");
INSERT INTO dates VALUES(6,"sa","saterday");
INSERT INTO dates VALUES(7,"su","sunday");
/*Creating on user to try shit out*/
INSERT INTO user VALUES(0,"tijmen","kungfu1998","tijmengraft@gmail.com","tijmen","van","graft","male",19);
/*Creating 2 habitlist*/
INSERT INTO habitlistcatelog VALUES(0,0,"general","A small little description of the general habit catelog");
INSERT INTO habitlistcatelog VALUES(1,0,"sport","A small little description of the sport habit catelog");
/*Creating five habits 4 beloning to a catelog and one to the backlog*/
INSERT INTO habit VALUES(0,0,"sleeping",1,"Sleeping is an important thing in your life","15-12-2017","15-12-2018");
INSERT INTO habit VALUES(1,0,"going to school",1,"We need to get wiser","15-12-2017","15-8-2017");
INSERT INTO habit VALUES(2,1,"Do 100 pushups",1"To get ready for summer we need do excersise now","15-12-2017","15-6-2017");
INSERT INTO habit VALUES(3,1,"Walk a mile a day",1,"It is said that if you walk a mile a day you keep the cancer away","15-12-2017","15-12-2017");
INSERT INTO habit VALUES(4,null,"Going with the bike to school")
