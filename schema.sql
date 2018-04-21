DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS products;

CREATE TABLE departments(
	id INT AUTO_INCREMENT NOT NULL,
	name TEXT,
	overhead DECIMAL(8, 2),
	PRIMARY KEY(id)
);

CREATE TABLE products(
	id INT AUTO_INCREMENT NOT NULL,
	name TEXT,
	department TEXT,
	price DECIMAL(8, 2),
	stock INT,
	sales DECIMAL(8, 2) DEFAULT 0,
	PRIMARY KEY(id)
);

SELECT * FROM departments;
SELECT * FROM products;
