CREATE DATABASE cocktailparty;
\c cocktailparty
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(30),
	hashed_password VARCHAR(100),
	email VARCHAR(50)
);
