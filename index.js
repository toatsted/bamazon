const mysql = require("promise-mysql");
const clear = require("clear");

const customer = require("./lib/customer.js");
const manager = require("./lib/manager.js");

const args = process.argv.slice(2);

clear();
console.log();
mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Samueljh1",
	database: "bamazon"
}).then((conn) => {
	switch (args[0]) {

		default:
		case "manager":
		case "-m":
			manager(conn);
			break;	

		case "customer":
		case "-c":
			customer(conn);
			break;
	}
})
