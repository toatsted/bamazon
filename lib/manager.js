const inquirer = require("inquirer");
const chalk = require("chalk");

const helpers = require("./helpers.js");

module.exports = function(conn){
	inquirer.prompt([
		{
			name: "menu",
			type: "list",
			choices: ["View products", "View low inventory", 
				"Add to inventory", "Add new product"],
			message: "Menu: "
		}])	
		.then(ans => {
			switch(ans.menu){
				case "View products":

					console.log(chalk.blue("\nAll products"));
					conn.query("SELECT * FROM products")
						.then(res => {
							helpers.log(res);
							conn.end();
						})
						.catch(err => console.log(err))
					break;
				case "View low inventory":

					console.log(chalk.blue("\nLow Inventory"));
					conn.query("SELECT * FROM products WHERE stock < 6")
						.then(res => {
							helpers.log(res);
							conn.end();
						})
						.catch(err => console.log(err))
					break;
				case "Add to inventory":

						console.log(chalk.blue("\nAdd to Inventory"));
						conn.query("SELECT * FROM products")
							.then(res => {
								helpers.log(res);
								inquirer.prompt([
										{
											name: "id",
											message: "id: "
										},{
											name: "amt",
											message: "amt: "
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
														console.log(chalk.yellow("Added " + chalk.white(
															ans.amt) + " items"));
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
					inquirer.prompt([{
							name: "name",
							message: "Name: "
						},{
							name: "department",
							message: "Department: "
						},{
							name: "price",
							message: "Price: "
						},{
							name: "stock",
							message: "Stock: "
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
									console.log(chalk.yellow("\nAdded product " + 
										chalk.white(ans.name)));
									conn.end();
								})
								.catch(err => console.log(err))
						})
						.catch(err => console.log(err))
					break;
			}
		})
		.catch(err => console.log(err))
}