

CREATE TABLE IF NOT EXISTS users (
	user_id int(6) AUTO_INCREMENT,
	username varchar(50) NOT NULL,
	password varchar(128) NOT NULL,
	email varchar(128) NOT NULL,
	firstname varchar(128) NOT NULL,
	middlename varchar(128),
	lastname varchar(128) NOT NULL,
	gender varchar(128),
	age int(4) NOT NULL,
	bank int(9) DEFAULT 0,
	CONSTRAINT PK_USER_ID PRIMARY KEY(user_id),
	CONSTRAINT UC_USERNAME UNIQUE(username),
	CONSTRAINT CH_BANK CHECK (bank>=0)
);

CREATE TABLE IF NOT EXISTS habitlistcatelog(
	habit_list_id int(6) AUTO_INCREMENT,
	owned_by int(6) NOT NULL,
	title varchar(128) NOT NULL,
	description text,
	CONSTRAINT PK_HABIT_LIST_ID PRIMARY KEY(habit_list_id),
	CONSTRAINT FK_USER_ID FOREIGN KEY (owned_by) REFERENCES users(user_id)
		ON DELETE CASCADE,
	CONSTRAINT UC_OWNED_TITLE UNIQUE(owned_by,title)
);

CREATE TABLE IF NOT EXISTS habit(
	habit_id int(6) AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS dates(
	date_id int(2) AUTO_INCREMENT,
	date_name varchar(3),
	date_title varchar(20),
	CONSTRAINT PK_DATE_ID PRIMARY KEY(date_id)
);

CREATE TABLE IF NOT EXISTS habit_done(
	habit_id int(6),
	date_done int(6),
	bonus boolean DEFAULT 0,
	CONSTRAINT PK_HABIT_ID_DATE_DONE PRIMARY KEY(habit_id,date_done)
);

CREATE TABLE IF NOT EXISTS frequency(
	habit_id int(6),
	date_id int(6),
	CONSTRAINT PK_HABIT_ID_DATE_ID PRIMARY KEY(habit_id,date_id),
	CONSTRAINT FK_HABIT_ID FOREIGN KEY(habit_id) REFERENCES habit(habit_id),
	CONSTRAINT FK_DATE_ID FOREIGN KEY(date_id) REFERENCES dates(date_id)
);

CREATE TABLE IF NOT EXISTS article_category(
	category_id int(6) AUTO_INCREMENT,
	category_name varchar(128) NOT NULL,
	category_description text,
	CONSTRAINT PK_CATEGORY_ID PRIMARY KEY(category_id)
);

CREATE TABLE IF NOT EXISTS article(
	article_id int(6) AUTO_INCREMENT,
	article_name varchar(128) NOT NULL,
	category_id int(6) NOT NULL,
	article_description text,
	article_price int(6) NOT NULL,
	CONSTRAINT PK_ARTICLE_ID PRIMARY KEY(article_id),
	CONSTRAINT FK_CATEGORY_ID FOREIGN KEY(category_id) REFERENCES article_category(category_id),
	CONSTRAINT CH_ARTICLE_PRICE CHECK (article_price > 0)
);

CREATE TABLE IF NOT EXISTS item_transaction(
	item_transaction_id int(6) AUTO_INCREMENT,
	user_id int(6),
	article_id int(6) DEFAULT NULL,
	transaction_amount int(10) DEFAULT 0,
	CONSTRAINT PK_ITEM_TRANSACTION_ID PRIMARY KEY(item_transaction_id),
	CONSTRAINT FK_USER_ID_ITEM_TRANSACTION FOREIGN KEY(user_id) REFERENCES users(user_id),
	CONSTRAINT FK_ARTICLE_ID_ITEM_TRANSACTION FOREIGN KEY(article_id) REFERENCES article(article_id)
);

CREATE TABLE IF NOT EXISTS user_items(
	user_id int(6),
	article_id int(6),
	transaction_id int(6),
	CONSTRAINT PK_USER_ITEM PRIMARY KEY(user_id,article_id),
	CONSTRAINT FK_USER_ID_USER_ITEMS FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT FK_ARTICLE_ID_USER_ITEMS FOREIGN KEY (article_id) REFERENCES article(article_id),
	CONSTRAINT FK_TRANSACTION_ID_USER_ITEMS FOREIGN KEY (transaction_id) REFERENCES item_transaction(item_transaction_id)
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
INSERT INTO users (username,password,email,firstname,middlename,lastname,gender,age) VALUES("tijmen","kungfu1998","tijmengraft@gmail.com","tijmen","van","graft","male",19);
/*Creating 2 habitlist*/
INSERT INTO habitlistcatelog VALUES(0,1,"general","A small little description of the general habit catelog");
INSERT INTO habitlistcatelog VALUES(1,1,"sport","A small little description of the sport habit catelog");
/*Creating five habits 4 beloning to a catelog and one to the backlog*/
INSERT INTO habit VALUES(0,1,"sleeping",1,"Sleeping is an important thing in your life","2017-12-15","2018-12-15");
INSERT INTO habit VALUES(1,1,"going to school",1,"We need to get wiser","2017-12-15","2017-8-15");
INSERT INTO habit VALUES(2,2,"Do 100 pushups",1,"To get ready for summer we need do excersise now","2017-12-15","2017-6-5");
INSERT INTO habit VALUES(3,2,"Walk a mile a day",1,"It is said that if you walk a mile a day you keep the cancer away","2017-12-15","2018-12-15");
INSERT INTO habit VALUES(4,null,"Going with the bike to school","2017-12-15","2018-12-15")

