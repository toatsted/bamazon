const inquirer = require("inquirer");

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
					break;

				case "Create new department":
					inquirer.prompt([
							{
								name: "name",
								message: "Department name: "
							},{
								name: "overhead",
								message: "Department overhead: ",
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
								console.log(`\nAdded department '${ans.name}'`);
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