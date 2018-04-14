const mysql = require("promise-mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");

const args = process.argv.slice(2);



clear();
mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Samueljh1",
	database: "bamazon"
}).then((conn) => {
	switch(args[0]){	

		default:
		case "customer":
			console.log(chalk.blue("\nAll products\n------------" + 
				"------------"))
			conn.query("SELECT * FROM products")
				.then(res => {
					res.forEach(value => {
						console.log(`
id: ${value.id}:
	name: ${value.name}
	department: ${value.department}
	price: ${value.price}
	in-stock: ${value.stock}
						`);
					})
					console.log(chalk.blue("------------" +
						"------------"));
				})
				.catch(err => console.log(err))

			break;
	}
	conn.end();
})
	