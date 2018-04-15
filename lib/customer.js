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
					conn.query(`SELECT * FROM products WHERE ?`,
						{
							id: parseInt(ans.id)
						})
						.then(prod => {
							conn.query(`
								UPDATE products
								SET stock = stock - ?
								WHERE ?`,[
									parseInt(ans.amt),
									{
										id: ans.id
									}
								])	
								.then(res => {
									console.log(chalk.yellow("Bought " + chalk.white(
										ans.amt) + " items"));
									console.log(chalk.yellow("for " + chalk.white(
											"$" + parseInt(ans.amt) * prod[0].price)));
									conn.end();
								})
								.catch(err => console.log(err))	
						})
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))	
		})
		.catch(err => console.log(err))	
}	