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
	user_id INT,
	file_name VARCHAR(200),
	mime_type VARCHAR(50),
	img BYTEA,

	CONSTRAINT FK_Image_User FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- deletes image if user is deleted
);
CREATE TABLE menus (
	id SERIAL PRIMARY KEY,
	user_id INT,
	image_id INT,
	title VARCHAR(100),

	CONSTRAINT FK_Menu_User FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE, -- deletes menu if user is deleted
	CONSTRAINT FK_Menu_Image FOREIGN KEY(image_id)
        REFERENCES images(id)
        ON DELETE SET NULL
);
CREATE TABLE recipes ( -- recipes from Api (use api_recipe_id to get recipe data from api)
	id SERIAL PRIMARY KEY,
	api_recipe_id INT
	-- ingredients ARRAY, -- list of ingredients
	-- measurements ARRAY -- list of measurements
);
CREATE TABLE custom_recipes (
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	image_id INT,
	drink VARCHAR(100),
	is_alcoholic BOOLEAN,
	category VARCHAR(50),
	glass VARCHAR(50),
	instructions VARCHAR(300),
	-- ingredients ARRAY, -- list of ingredients
	-- measures ARRAY, -- json list of measurements
	ingredient1 VARCHAR(50),
	ingredient2 VARCHAR(50),
	ingredient3 VARCHAR(50),
	ingredient4 VARCHAR(50),
	ingredient5 VARCHAR(50),
	ingredient6 VARCHAR(50),
	ingredient7 VARCHAR(50),
	ingredient8 VARCHAR(50),
	ingredient9 VARCHAR(50),
	ingredient10 VARCHAR(50),
	ingredient11 VARCHAR(50),
	ingredient12 VARCHAR(50),
	ingredient13 VARCHAR(50),
	ingredient14 VARCHAR(50),
	ingredient15 VARCHAR(50),
	measure1 VARCHAR(50),
	measure2 VARCHAR(50),
	measure3 VARCHAR(50),
	measure4 VARCHAR(50),
	measure5 VARCHAR(50),
	measure6 VARCHAR(50),
	measure7 VARCHAR(50),
	measure8 VARCHAR(50),
	measure9 VARCHAR(50),
	measure10 VARCHAR(50),
	measure11 VARCHAR(50),
	measure12 VARCHAR(50),
	measure13 VARCHAR(50),
	measure14 VARCHAR(50),
	measure15 VARCHAR(50),
	date_modified DATE,

	CONSTRAINT FK_Custom_Recipe_User FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
	CONSTRAINT FK_Custom_Recipe_Image FOREIGN KEY(image_id)
        REFERENCES images(id)
        ON DELETE SET NULL
);
CREATE TABLE menu_items (
	id SERIAL PRIMARY KEY,
	menu_id INT NOT NULL,
	recipe_id INT, -- null if item is custom recipe
	custom_recipe_id INT, -- null if item is normal recipe

	CONSTRAINT FK_Item_Menu FOREIGN KEY(menu_id)
        REFERENCES menus(id)
        ON DELETE CASCADE,
	CONSTRAINT FK_Item_Recipe FOREIGN KEY(recipe_id)
        REFERENCES recipes(id)
        ON DELETE SET NULL,
	CONSTRAINT FK_Item_Custom_Recipe FOREIGN KEY(custom_recipe_id)
        REFERENCES custom_recipes(id)
        ON DELETE SET NULL
);