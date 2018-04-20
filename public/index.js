const mysql = require("promise-mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const cTable = require("console.table");

const args = process.argv.slice(2);

const helpers = {
	log: function(res){
		console.log(chalk.underline("------------------------"));	
		console.log();
		res.forEach(value => {
			console.log(chalk.yellow(`id: ${value.id}:`) + `
		name: ${value.name}
		department: ${value.department}
		price: ${value.price}
		in-stock: ${value.stock}\n`);
								})
		console.log(chalk.underline("------------------------"));	
	},

	validateNum: function(input){
		if(isNaN(parseFloat(input)))	
			return "Input a valid number";
		return true;
	}
}


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
			inquirer.prompt([
					{
						name: "menu",
						message: "Menu: ",
						type: "list",
						choices: ["View sales by department", "Create new department"]
					}
				])	
				.then(ans => {
					switch(ans.menu){

						case "View sales by department":
							let sales = {};
							conn.query(`
								SELECT p.sales, p.department
								FROM products p
								`)
								.then(res => {
									res.forEach(val => {
										if(!sales[val.department])
											sales[val.department] = 0;
										sales[val.department] += val.sales;
									})

									conn.query(`
										SELECT d.id, d.name, d.overhead
										FROM departments d
										`)
										.then(res => {
											for(let key in sales){
												res.forEach(val => {
													if(key === val.name)
														val.sales = sales[key];
														val.total = val.sales - val.overhead;
												})
											}
											console.log();
											console.table(res);
											conn.end();
										})
										.catch(err => console.log(err))
								})
								.catch(err => console.log(err))
							break;

						case "Create new department":
							inquirer.prompt([
									{
										name: "name",
										message: "Department name: "
									},{
										name: "overhead",
										message: "Department overhead: ",
										validate: function(input){
												if(isNaN(parseFloat(input)))
													return "Input a number";
												return true;
											}
									}
								])
								.then(ans => {
									conn.query(`
										INSERT INTO departments(
											name,
											overhead
										)VALUES
											(?, ?)
									`, [ans.name, ans.overhead])
									.then(res => {
										console.log(chalk.yellow(`\nAdded department '${
											chalk.white(ans.name)}'`));
										conn.end();
									})
									.catch(err => console.log(err))
								})
								.catch(err => console.log(err))
							break
					}
				})
				.catch(err => console.log(err))
			break;

		case "manager":
		case "-m":
			inquirer.prompt([
					{
						name: "menu",
						type: "list",
						choices: ["View products", "View low inventory", 
							"Add to inventory", "Add new product"],
						message: "Menu: "
					}
				])	
				.then(ans => {
					switch(ans.menu){
						case "View products":

							console.log(chalk.blue("\nAll products"));
							conn.query(`SELECT * FROM products`)
								.then(res => {
									helpers.log(res);
									conn.end();
								})
								.catch(err => console.log(err))
							break;
						case "View low inventory":

							console.log(chalk.blue("\nLow Inventory"));
							conn.query(`SELECT * FROM products WHERE stock < 6`)
								.then(res => {
									helpers.log(res);
									conn.end();
								})
								.catch(err => console.log(err))
							break;
						case "Add to inventory":

								console.log(chalk.blue("\nAdd to Inventory"));
								conn.query(`SELECT * FROM products`)
									.then(res => {
										helpers.log(res);
										inquirer.prompt([
												{
													name: "id",
													message: "id: ",
													validate: helpers.validateNum
												},{
													name: "amt",
													message: "amt: ",
													validate: helpers.validateNum
												}
											])
											.then(ans => {
												ans.id = parseInt(ans.id);
												ans.amt = parseInt(ans.amt);
												conn.query(`SELECT * FROM products WHERE ?`,
													{
														id: ans.id
													})
													.then(prod => {
														conn.query(`
															UPDATE products
															SET stock = stock + ?
															WHERE ?`,[
																ans.amt,
																{
																	id: ans.id
																}
															])	
															.then(res => {
																console.log(chalk.yellow(`\nAdded ${chalk.white(
																	ans.amt)} items`));
																conn.end();
															})
															.catch(err => console.log(err))	
													})
													.catch(err => console.log(err))
											})
											.catch(err => console.log(err))	
									})
									.catch(err => console.log(err))	
							break;	
						case "Add new product":
								conn.query(`SELECT name FROM departments`)
								.then(res => {
									inquirer.prompt([{
												name: "department",
												message: "Department: ",
												type: "list",
												choices: res
											},{
												name: "name",
												message: "Name: "
											},{
												name: "price",
												message: "Price: ",
												validate: helpers.validateNum
											},{
												name: "stock",
												message: "Stock: ",
												validate: helpers.validateNum
											}
										])
										.then(ans => {
											conn.query(`INSERT INTO products(
													name,
													department,
													price,
													stock				
												)VALUES
													(?,?,?,?);`,
													[ans.name, ans.department, ans.price, ans.stock])
												.then(res => {
													console.log(chalk.yellow(`\nAdded product ` + 
														chalk.white(ans.name)));
													conn.end();
												})
												.catch(err => console.log(err))
										})
										.catch(err => console.log(err))
								})
								.catch(err => console.log(err))
							break;
					}
				})
				.catch(err => console.log(err))
			break;	

		default:
		case "customer":
		case "-c":
			console.log(chalk.blue("All products"));
			conn.query(`SELECT * FROM products`)
				.then(res => {
					helpers.log(res)
					inquirer.prompt([
							{
								name: "id",
								message: "id: ",
								validate: helpers.validateNum
							},{
								name: "amt",
								message: "amt: ",
								validate: helpers.validateNum
							}
						])
						.then(ans => {
							ans.id = parseInt(ans.id);
							ans.amt = parseInt(ans.amt);
							conn.query(`SELECT * FROM products WHERE ?`,
								{
									id: ans.id
								})
								.then(prod => {
									if(prod[0].stock >= ans.amt){
										conn.query(`
											UPDATE products
											SET stock = stock - ?
											WHERE ?`,[
												ans.amt,
												{
													id: ans.id
												}
											])	
											.then(res => {
												console.log(chalk.yellow(`\nBought ${chalk.white(
													ans.amt)} items`));
												console.log(chalk.yellow(`for ${chalk.white(
														"$" + ans.amt * prod[0].price)}`));
												conn.query(`UPDATE products
													SET sales = sales + ?
													WHERE ?`,[
														ans.amt * prod[0].price,{
															id: ans.id
														}
													])
													.catch(err => console.log(err))
												conn.end();
											})
											.catch(err => console.log(err))	
									}else{
										console.log(chalk.yellow("\nNot enough stock"));
										conn.end();
									}
								})
								.catch(err => console.log(err))
						})
						.catch(err => console.log(err))	
				})
				.catch(err => console.log(err))	
			break;
	}
})
