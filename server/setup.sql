CREATE DATABASE cocktailparty;
\c cocktailparty
CREATE TABLE users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(30),
	hashed_password VARCHAR(100),
	email VARCHAR(50)
);
CREATE TABLE images (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INTEGER,
	file_name VARCHAR(200),
	mime_type VARCHAR(50),
	img BYTEA
);
