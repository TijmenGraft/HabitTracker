CREATE TABLE IF NOT EXISTS workers (
	worker_id int(6) AUTO_INCREMENT,
	authrozised boolean,
	helper boolean,
	CONSTRAINT PK_WORKER_ID PRIMARY KEY(worker_id)
);

CREATE TABLE IF NOT EXISTS full_time_worker(
	full_time_worker_id int(6) AUTO_INCREMENT,
	name varchar(128) NOT NULL,
	workers_id int(6),
	CONSTRAINT PK_FULL_TIME_WORKER_ID PRIMARY KEY(full_time_worker_id),
	CONSTRAINT FK_WORKERS_ID_FULL_TIME FOREIGN KEY (workers_id) REFERENCES workers(worker_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS volunteer_worker(
	volunteer_worker_id int(6) AUTO_INCREMENT,
	name varchar(128) NOT NULL,
	workers_id int(6),
	CONSTRAINT PK_VOLUNTEER_WORKER PRIMARY KEY(volunteer_worker_id),
	CONSTRAINT FK_WORKERS_ID_VOLUNTEER FOREIGN KEY (workers_id) REFERENCES workers(worker_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contractor_worker(
	contractor_worker_id int(6) AUTO_INCREMENT,
	name varchar(128) NOT NULL,
	workers_id int(6),
	CONSTRAINT PK_CONTRACTOR_WORKER_ID PRIMARY KEY(contractor_worker_id),
	CONSTRAINT FK_WORKERS_ID_CONTRACTOR FOREIGN KEY (workers_id) REFERENCES workers(worker_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS releases_badge(
	badge_id int(6) AUTO_INCREMENT,
	given_by_id int(6) NOT NULL,
	CONSTRAINT PK_BADGE_ID PRIMARY KEY(badge_id),
	CONSTRAINT FK_GIVEN_BY_ID FOREIGN KEY (given_by_id) REFERENCES workers(worker_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotel(
	hotel_id int(6) AUTO_INCREMENT,
	hotel_name varchar(128) NOT NULL,
	CONSTRAINT PK_HOTEL_ID PRIMARY KEY(hotel_id)
);

CREATE TABLE IF NOT EXISTS jury(
	jury_id int(6) AUTO_INCREMENT,
	jury_name varchar(128) NOT NULL,
	jury_stays_at int(6) NOT NULL,
	transport_from_airport boolean,
	helped_by int(6),
	CONSTRAINT PK_JURY_ID PRIMARY KEY(jury_id),
	CONSTRAINT FK_STAYS_AT_HOTEL FOREIGN KEY(jury_stays_at) REFERENCES hotel(hotel_id) ON DELETE CASCADE,
	CONSTRAINT FK_HELPED_BY FOREIGN KEY(helped_by) REFERENCES workers(worker_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tracks(
	track_id int(6) AUTO_INCREMENT,
	type varchar(128) NOT NULL,
	happen_date date NOT NULL,
	happen_time time NOT NULL,
	CONSTRAINT PK_TRACK_ID PRIMARY KEY(track_id)
);

CREATE TABLE IF NOT EXISTS movie(
	movie_id int(6) AUTO_INCREMENT,
	movie_title varchar(128) NOT NULL,
	room int(6) NOT NULL,
	revenue int(80) DEFAULT 0,
	CONSTRAINT PK_MOVIE_ID PRIMARY KEY(movie_id)
);

CREATE TABLE IF NOT EXISTS actor(
	actor_id int(6) AUTO_INCREMENT,
	actor_name varchar(128),
	CONSTRAINT PK_ACTOR_ID PRIMARY KEY(actor_id) 
);

CREATE TABLE IF NOT EXISTS movie_director(
	movie_director_id int(6) AUTO_INCREMENT,
	movie_director_name varchar(128),
	CONSTRAINT PK_MOVIE_DIRECTOR_ID PRIMARY KEY(movie_director_id) 
);

CREATE TABLE IF NOT EXISTS played_in(
	movie_id int(6) NOT NULL,
	actor_id int(6) NOT NULL,
	leading_role boolean,
	CONSTRAINT FK_MOVIE_ID_PLAYED_IN FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
	CONSTRAINT FK_ACTOR_ID_PLAYED_IN FOREIGN KEY(actor_id) REFERENCES actor(actor_id)
);

CREATE TABLE IF NOT EXISTS directed(
	movie_id int(6) NOT NULL,
	movie_director_id int(6) NOT NULL,
	CONSTRAINT FK_MOVIE_ID_DIRECTED FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
	CONSTRAINT FK_MOVIE_DIRECTOR_DIRECTED FOREIGN KEY(movie_director_id) REFERENCES movie_director(movie_director_id)
);

CREATE TABLE IF NOT EXISTS movie_awards(
	movie_id int(6) NOT NULL,
	jury_id int(6) NOT NULL,
	award varchar(128) NOT NULL,
	CONSTRAINT FK_MOVIE_ID_MOVIE_AWARDS FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
	CONSTRAINT FK_JURY_ID_MOVIE_AWARDS FOREIGN KEY(jury_id) REFERENCES jury(jury_id)
);

CREATE TABLE IF NOT EXISTS actor_awards(
	actor_id int(6) NOT NULL,
	jury_id int(6) NOT NULL,
	award varchar(128) NOT NULL,
	CONSTRAINT FK_MOVIE_ID_ACTOR_AWARDS FOREIGN KEY(actor_id) REFERENCES actor(actor_id),
	CONSTRAINT FK_JURY_ID_ACTOR_AWARDS FOREIGN KEY(jury_id) REFERENCES jury(jury_id)
);

CREATE TABLE IF NOT EXISTS movie_in_track(
	track_id int(6) NOT NULL,
	movie_id int(6) NOT NULL,
	CONSTRAINT FK_TRACK_ID FOREIGN KEY(track_id) REFERENCES tracks(track_id),
	CONSTRAINT FK_MOVIE_ID_MOVIE_IN_TRACK FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
);