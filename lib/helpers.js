const chalk = require("chalk");

module.exports.log = function(res){
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
}