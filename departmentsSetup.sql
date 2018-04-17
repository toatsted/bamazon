drop table if exists departments;

create table departments(
	id int auto_increment not null,
	name varchar(150),
	overhead float(8, 2),
	primary key(id)
);

insert into departments(
	name,
	overhead,
)values
	();

select * from departments;
