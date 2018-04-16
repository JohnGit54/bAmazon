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


function managerMenu() {
    var msg = " Would you like to (1) View Products for Sale (2) View Low Inventory \
(3) Add to Inventory (4) Add New Product or (5) Exit ";
    inquirer.prompt(
        {
            name: "selection",
            type: "rawlist",
            message: msg,
            choices: ["View Products", "Low Inventory", "Add Inventory", "Add Product", "Exit"]
        }
    ).then(function (inqRes) {
        if (inqRes.selection === "View Products") {
            viewProds();
        } else if (inqRes.selection === "Low Inventory") {
            lowInventory();
        } else if (inqRes.selection === "Add Inventory") {
            addInventory();
        } else if (inqRes.selection === "Add Product") {
            addProducts();
        } else if (inqRes.selection === "Exit") {
            connection.end();
            process.exit();
        }
    })


}

function viewProds() {
    var sql = "select p.item_id , p.product_name , d.department_name, p.price , p.stock_quantity\
    from products p , departments d where p.department_id  = d.department_id \
    order by p.department_id ,p.price , p.product_name " ;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            connection.end();
            throw err;
        }
        console.log(`'\n\n***** ProductInventory:  *** num of items:  ${result.length}  ***`);
        console.table(result);
        managerMenu();
    });

}

function lowInventory() {
    var sql = "select p.item_id , p.product_name , d.department_name, p.price , p.stock_quantity \
 from products p , departments d where ( p.department_id  = d.department_id ) \
 and ( p.stock_quantity <= 5)  order by p.department_id ,p.price , p.product_name " ;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            connection.end();
            throw err;
        }
        console.log(`\n\n*** ${result.length} items with Low Inventory:  ******`);
        console.table(result);
    });
    managerMenu();
}

function addInventory() {

    //get list of items for manager
    var sql = "select p.item_id , p.product_name , d.department_name, p.price , p.stock_quantity\
    from products p , departments d where p.department_id  = d.department_id \
    order by p.department_id ,p.price , p.product_name " ;

    var array = []; //will have array for inquier list

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            connection.end();
            throw err;
        }
        result.forEach(element => {
            var x = element.item_id + " : " + element.product_name + " : " + element.department_name + " : " + element.price + " : " + element.stock_quantity;
            array.push(x);
        });
        inquirerLowInventory(array);
    })
}

function inquirerLowInventory(array) {
    inquirer.prompt([
        {
            type: "list",
            name: 'item1',
            message: 'select item to add inventory for',
            choices: array
        },
        {
            name: "quant",
            message: "Quantity to Add:"
        }
    ]).then(function (answers) {
        console.log(answers);
        var xAr = answers.item1.split(':');
        var xId = parseInt(xAr[0]);
        console.log("\n add inventory to :", answers.item1, ", the id on table: ", xId);
        console.log("Quantity to add :", answers.quant);
        updateProducts(xId, answers.quant);
    });
}

function updateProducts(id, quantity) {
    var x = " Update products set stock_quantity = stock_quantity + ? where item_id = ?";
    connection.query(x, [quantity, id], function (err, result) {
        if (err) {
            console.log(" Update sql Create Error: ", err);
            connection.end();
            throw err;
        }
        console.log("Quantity updated");
        viewProds()
    })
}

function addProducts() {

    //need to get department name-id from dept table
    var arrayD = [];
    var sql = "select department_id , department_name from departments";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            connection.end();
            throw err;
        }
        result.forEach(element => {
            var x = element.department_id + " : " + element.department_name;
            console.log(x);
            arrayD.push(x);
        });


        console.log('start inquiere');
        inquirer
            .prompt([
                {
                    message: "Which Department",
                    type: "list",
                    choices: arrayD,
                    name: "deptid"
                },
                {
                    message: "Product Name",
                    name: "prodname"
                },
                {
                    message: "How many?",
                    name: "stock"
                },
                {
                    message: "Price?",
                    name: "price"
                }
            ])
            .then(function (res) {
                var di = res.deptid.split(':');
                connection.query(
                    "INSERT INTO products SET ?",
                    {
                        department_id: parseInt(di[0]),
                        product_name: res.prodname,
                        price: res.price,
                        stock_quantity: res.stock
                    },
                    function (err, res) {
                        if (err) {
                            connection.end();
                        } else {
                            console.log(res.affectedRows + " product inserted!\n");
                            // Call updateCrud AFTER the INSERT completes
                            managerMenu();
                        }
                    }
                );
            });//ends then
    })
}


managerMenu();