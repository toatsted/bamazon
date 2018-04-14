drop table if exists products;

create table products(
	id int auto_increment not null,
	name varchar(150),
	department varchar(150),
	price float(6, 2),
	stock int(255),
	primary key(id)
);

insert into products(
	name,
	department,
	price,
	stock
)values
	("banana", "grocery", .33, 99),
	("hot wheels", "toy", 2.48, 25),
	("pillow", "bedding", 10.99, 72);

select * from products;
