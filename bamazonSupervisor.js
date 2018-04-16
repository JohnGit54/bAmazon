var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var currencyFormatter = require('currency-formatter');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    //Your password    
    password: "root",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) {
        console.log("Connect Error: ", err);
        connection.end();
        throw err;
    } else {
        console.log("Connected! as id ", connection.threadId);
    }
})


function SupervisorMenu() {
    var msg = "Would you like to (1) View Products Sales by Department or (2) Create New Department";
    inquirer.prompt(
        {
            name: "selection",
            type: "rawlist",
            message: msg,
            choices: ["View Products Sales by Dept", "Create New Dept", "Exit"]
        }
    ).then(function (inqRes) {
        if (inqRes.selection === "View Products Sales by Dept") {
            viewSalesbyDept();
        } else if (inqRes.selection === "Create New Dept") {
            addDepartment();
        } else if (inqRes.selection === "Exit") {
            connection.end();
            process.exit();
        }
    })


}

function viewSalesbyDept() {
    var sql = "select  department_id , department_name , concat('$', format(overhead_costs, 2)) as 'OverHead Costs' , \
concat('$', format(product_sales , 2)) as 'Product Sales' , \
concat('$', format( product_sales - overhead_costs , 2)) as 'Total Profit' from departments ";



    connection.query(sql, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            connection.end();
            throw err;
        }
        console.log(`\n\n**** Sales by Department :  *****`);

        console.table(result);
        SupervisorMenu();
    });

}




function addDepartment() {

    console.log('start inquierer for add department');
    inquirer
        .prompt([
            {
                message: "Department Name",
                name: "deptname"
            },
            {
                message: "Yearly Overhead Costs?",
                name: "ovrhd"
            } 
        ])
        .then(function (res) {             
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: res.deptname,
                    overhead_costs: res.ovrhd
                },
                function (err, res) {
                    if (err) {
                        connection.end();
                    } else {
                        console.log(res.affectedRows + " Department inserted!\n");
                        // Call updateCrud AFTER the INSERT completes
                        SupervisorMenu();
                    }
                }
            );
        });//ends then
}


SupervisorMenu();