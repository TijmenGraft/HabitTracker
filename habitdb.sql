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
);

CREATE TABLE habit(
	habit_id int(6),
	in_list_id int(6),
	title varchar(128),
	type int(1),
	description text,
	startdate date,
	enddate date,
	CONSTRAINT PK_HABIT_ID PRIMARY KEY(habit_id),
	CONSTRAINT FK_IN_LIST_ID FOREIGN KEY(in_list_Id) REFERENCES habitlistcatelog(habit_list_id)
);

CREATE TABLE dates(
	date_id int(2),
	date_name varchar(3),
	date_title varchar(20),
	CONSTRAINT PK_DATE_ID PRIMARY KEY(date_id),
)

CREATE TABLE habit_done(
	habit_id int(6),
	date_done int(6),
	CONSTRAINT PK_HABIT_ID_DATE_DONE PRIMARY KEY(habit_id,date_done)
	bonus boolean SET DEFAULT 0,

)