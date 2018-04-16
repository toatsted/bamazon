const chalk = require("chalk");
const inquirer = require("inquirer");

const helpers = require("./helpers.js");

module.exports = function (conn){
	console.log(chalk.blue("All products"));
	conn.query("SELECT * FROM products")
		.then(res => {
			helpers.log(res)
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
										console.log(chalk.yellow("Bought " + chalk.white(
											ans.amt) + " items"));
										console.log(chalk.yellow("for " + chalk.white(
												"$" + ans.amt * prod[0].price)));
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
}	