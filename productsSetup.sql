drop table if exists products;

create table products(
	id int auto_increment not null,
	name varchar(150),
	department varchar(150),
	price float(8, 2),
	stock int(255),
	sales float(8, 2) default 0,
	primary key(id)
);

insert into products(
	name,
	department,
	price,
	stock
)values
	();

select * from products;
