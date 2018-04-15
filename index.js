const mysql = require("promise-mysql");
const clear = require("clear");

const customer = require("./lib/customer.js");

const args = process.argv.slice(2);

clear();
mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Samueljh1",
	database: "bamazon"
}).then((conn) => {
	switch (args[0]) {

		default:
		case "customer":

			switch(args[1]){
				case "-r":

					conn.query("SELECT * FROM products")
						.then(res => {
							console.log(JSON.stringify(res, null, 2));
							conn.end();
						})
						.catch(err => console.log(err))
					break;

				default:

					customer(conn);
					break;	
			}
			break;
	}

})
