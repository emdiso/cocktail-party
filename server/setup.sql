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
	date_deleted TIMESTAMP,

	CONSTRAINT FK_Image_User FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- deletes image if user is deleted
);
CREATE TABLE menus (
	id SERIAL PRIMARY KEY,
	user_id INT,
	image_id INT,
	title VARCHAR(100),
	data_created TIMESTAMP DEFAULT NOW(),

	CONSTRAINT FK_Menu_User FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE, -- deletes menu if user is deleted
	CONSTRAINT FK_Menu_Image FOREIGN KEY(image_id)
        REFERENCES images(id)
        ON DELETE SET NULL
);
CREATE TABLE custom_recipes ( -- I made them look like the external api's data (even though we all dislike their naming/structure)
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	image_id INT,
	"strDrink" VARCHAR(100),
	"strAlcoholic" VARCHAR(50),
	"strCategory" VARCHAR(50),
	"strGlass" VARCHAR(50),
	"strInstructions" VARCHAR(300),
	-- ingredients ARRAY, -- list of ingredients
	-- measures ARRAY, -- json list of measurements
	"strIngredient1" VARCHAR(50),
	"strIngredient2" VARCHAR(50),
	"strIngredient3" VARCHAR(50),
	"strIngredient4" VARCHAR(50),
	"strIngredient5" VARCHAR(50),
	"strIngredient6" VARCHAR(50),
	"strIngredient7" VARCHAR(50),
	"strIngredient8" VARCHAR(50),
	"strIngredient9" VARCHAR(50),
	"strIngredient10" VARCHAR(50),
	"strIngredient11" VARCHAR(50),
	"strIngredient12" VARCHAR(50),
	"strIngredient13" VARCHAR(50),
	"strIngredient14" VARCHAR(50),
	"strIngredient15" VARCHAR(50),
	"strMeasure1" VARCHAR(50),
	"strMeasure2" VARCHAR(50),
	"strMeasure3" VARCHAR(50),
	"strMeasure4" VARCHAR(50),
	"strMeasure5" VARCHAR(50),
	"strMeasure6" VARCHAR(50),
	"strMeasure7" VARCHAR(50),
	"strMeasure8" VARCHAR(50),
	"strMeasure9" VARCHAR(50),
	"strMeasure10" VARCHAR(50),
	"strMeasure11" VARCHAR(50),
	"strMeasure12" VARCHAR(50),
	"strMeasure13" VARCHAR(50),
	"strMeasure14" VARCHAR(50),
	"strMeasure15" VARCHAR(50),
	"dateModified" VARCHAR(50),

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
	api_recipe_id INT, -- null if item is custom recipe
	custom_recipe_id INT, -- null if item is normal recipe

	CONSTRAINT FK_Item_Menu FOREIGN KEY(menu_id)
        REFERENCES menus(id)
        ON DELETE CASCADE,
	CONSTRAINT FK_Item_Custom_Recipe FOREIGN KEY(custom_recipe_id)
        REFERENCES custom_recipes(id)
        ON DELETE SET NULL
);