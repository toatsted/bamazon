const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require("console.table");

const helpers = require("./helpers.js");

module.exports = function(conn){
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
}