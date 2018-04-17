var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var currencyFormatter = require('currency-formatter');

var oConnection = require('./oConnection');
var oConn = new oConnection();


function showList(callback) {
    var sql = "select d.department_name, p.item_id , p.product_name , p.price , p.stock_quantity\
     from products p , departments d where p.department_id  = d.department_id \
     order by p.department_id ,p.price , p.product_name " ;

    oConn.executeSQL(oConn, sql, " ", function (dataset) {
        console.log("\n *** Show Products for Sale Table ***\n");
        console.table(dataset);
        callback();
    })
}



function startPrompt() {
    promptID(); //promt for item ID   
};


function promptID() {

    inquirer.prompt(
        [{
            name: "prod_id",
            message: "What is the Product ID or QUIT?"
        }]
    ).then(function (answers) {
        // console.log(" in prompt ID - what is answers", answers);
        if (answers.prod_id.toUpperCase() == "QUIT") process.exit();
        if (isNaN(answers.prod_id)) {
            console.log(" Please enter numeric ID value");
            startPrompt();
            return;
        } else {
            var sql = "Select item_id, stock_quantity , department_id, price from products where item_id = ? ";
            oConn.executeSQL(oConn, sql, answers.prod_id, function (dataset) {
                if (dataset.length == 0) {
                    console.log(" Id number not valid, try again ");
                    startPrompt();
                    return;
                }
                inStockQuantity = dataset[0].stock_quantity;
                console.log("valid id , Total Stock on hand for item: ", inStockQuantity);
                promptQuantity(dataset);
            })
        }
    });
}

var promptQuantity = function (result) {
    inquirer
        .prompt([
            {
                message: "How many do you wish to buy?",
                name: "quant"
            }
        ])
        .then(answers => {
            //console.log(" in pQ ,", result[0], answers);
            if (isNaN(answers.quant)) {
                console.log("Please enter numeric quantity value");
                promptQuantity(result);
                return;
            }
            if (result[0].stock_quantity >= answers.quant) {
                update_products(result, answers.quant);
            } else {
                console.log(` \n Sorry Insufficient Quantity, we have ${result[0].stock_quantity} on hand\n `);
                promptQuantity(result);
            }
        })
}


function update_products(result, aQnt) {
    var price = result[0].price;
    var prod_id = result[0].item_id;
    var dept_id = result[0].department_id;
    var cost = price * aQnt;
    var costFormatted = currencyFormatter.format(cost, { code: 'USD' });

    console.log(`\n Start of update_products  : ${costFormatted} ,  prod_id= ${prod_id},  department_id: ${dept_id}`);

    oConn.connection.beginTransaction(function (err) {
        if (err) { throw err; }

        var productSQL = " Update products set stock_quantity = stock_quantity - ? where item_id = ?";

        oConn.executeSQL(oConn, productSQL, [aQnt, prod_id], function (dataset) {
            var dptTotSQL = 'UPDATE departments set product_sales =  product_sales + ? where department_id = ?';
            oConn.executeSQL(oConn, dptTotSQL, [cost, dept_id], function (dataset2) {
                oConn.connection.commit(function (err) {
                    if (err) {
                        console.log(" transaction commit error, rollback ", err);
                        return oConn.connection.rollback(function () {
                            throw err;
                        });
                    }
                    console.log(`  \n\n\n Updated table , your bill : ${costFormatted} `);
                    showList(startPrompt);
                })
            })
        })

    });
}

function showProductList() {
    showList(startPrompt); // needed a callback to make sure list was shown first
}


console.log("\n\n\n\n\nShow list of Products");
showProductList();

