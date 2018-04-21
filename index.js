const mysql = require("promise-mysql");
const clear = require("clear");

const customer = require("./lib/customer.js");
const manager = require("./lib/manager.js");
const supervisor = require("./lib/supervisor.js");

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
		case "supervisor":
		case "-s"	:
			supervisor(conn);
			break;

		case "manager":
		case "-m":
			manager(conn);
			break;	

		default:
		case "customer":
		case "-c":
			customer(conn);
			break;
	}
})
