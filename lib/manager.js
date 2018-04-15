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

						console.log(chalk.blue("Add to Inventory"));
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
										conn.query(`SELECT * FROM products WHERE ?`,
											{
												id: parseInt(ans.id)
											})
											.then(prod => {
												conn.query(`
													UPDATE products
														SET stock = stock + ?
															WHERE ?`,[
														parseInt(ans.amt),
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
					break;
			}
		})
		.catch(err => console.log(err))
}