USE mysql;
DROP DATABASE if EXISTS steam_market;

CREATE DATABASE steam_market;
USE steam_market;

CREATE TABLE state(
	id_state INT PRIMARY KEY AUTO_INCREMENT,
	description VARCHAR(20)
);
INSERT INTO state(description) VALUES ('Activo'),('Inactivo');

CREATE TABLE game(
	id_game VARCHAR(7) PRIMARY KEY,
	game_name VARCHAR(100) NOT NULL,
	game_img_src VARCHAR(300) NULL,
	game_art_quantity INT DEFAULT 0,
	id_state INT NOT NULL DEFAULT 1 REFERENCES state(id_state)
);

CREATE TABLE article(
	id_article INT PRIMARY KEY AUTO_INCREMENT,
	id_game INT NOT NULL REFERENCES game(id_game),
	art_hash_name VARCHAR(100) NOT NULL,
	art_name VARCHAR(100) NOT NULL,
	art_img_src VARCHAR(300) NULL,
	
	art_update DATETIME NOT NULL,
	art_min_price DOUBLE(7,2) NULL,
	art_min_normal_price DOUBLE(7,2) NULL
);

CREATE TABLE article_registry(
	id_registry INT PRIMARY KEY AUTO_INCREMENT,
	id_article INT NOT NULL REFERENCES article(id_article),
	
	reg_date DATETIME NOT NULL,
	reg_min_price DOUBLE(7,2) NULL,
	reg_min_normal_price DOUBLE(7,2) NULL
);

CREATE TABLE article_price_rank(
	id_rank INT PRIMARY KEY AUTO_INCREMENT,
	id_article INT NOT NULL REFERENCES article(id_article),
	
	/* Información de articulos a la venta */
	for_sell_quantity INT,
	for_sell_data JSON,
	
	/* Información de ordenes de compra */
	purchase_order_quantity INT,
	purchase_order_data JSON
);