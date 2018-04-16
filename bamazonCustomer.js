var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var currencyFormatter = require('currency-formatter');

var oConnection = require('./oConnection');
var conn = new oConnection();



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


function showList(callback) {
  var sql = "select p.item_id , p.product_name , d.department_name, p.price , p.stock_quantity\
   from products p , departments d where p.department_id  = d.department_id \
   order by p.department_id ,p.price , p.product_name " ;

  connection.query(sql, function (err, result) {
    if (err) {
      console.log("sql Create Error: ", err);
      connection.end();
      throw err;
    }
    console.table(result);
    callback();
  });
}


var _resultSet;

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
      connection.query(sql, answers.prod_id, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          console.log(" Id number not valid, try again ");
          startPrompt();
          return;
        }
        inStockQuantity = result[0].stock_quantity;
        console.log("valid id and quantity, on hand: ", inStockQuantity);
        _resultSet = result;
        promptQuantity(result);
      });
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
      console.log(" in pQ ,", result[0], answers);
      if (isNaN(answers.quant)) {
        console.log("Please enter numeric quantity value");
        promptQuantity(result);
        return;
      }
      if (result[0].stock_quantity >= answers.quant) {
        update_products(result, answers.quant);
        //showList(startPrompt);
        //return;
      } else {
        console.log(`Sorry Insufficient Quantity, we have ${result[0].stock_quantity} on hand`);
        promptQuantity(result);
      }
    })
}
// promptQuantity();


function update_products(result, aQnt) {
  // var prodSQL = " Update products set stock_quantity = stock_quantity - ? where item_id = ?";
  //console.log('in update rtne :', result);
  var price = result[0].price;
  var prod_id = result[0].item_id;
  var dept_id = result[0].department_id;
  var cost = price * aQnt;
  var costFormatted = currencyFormatter.format(cost, { code: 'USD' });

  console.log(` Start of update_products  : ${costFormatted} ,  prod_id= ${prod_id},  department_id: ${dept_id}`);

  var productSQL = " Update products set stock_quantity = stock_quantity - ? where item_id = ?";
  connection.beginTransaction(function (err) {
    if (err) { throw err; }
    connection.query(productSQL, [aQnt, prod_id], function (error, result_prod) {
      if (error) {
        console.log(" transaction error products table ", error);
        return connection.rollback(function () {
          throw error;
        });
      }
      console.log(" transaction products table done ");
      var dptTotSQL = 'UPDATE departments set product_sales =  product_sales + ? where department_id = ?';

      connection.query(dptTotSQL, [cost, dept_id], function (error, results, fields) {
        if (error) {
          return connection.rollback(function () {
            console.log(" transaction error departments table ", error);
            throw error;
          });
        }
        console.log(" transaction depts table done , beofre commit ");
        connection.commit(function (err) {
          if (err) {
            console.log(" transaction commit error, rollback ", err);
            return connection.rollback(function () {
              throw err;
            });
          }
          console.log('success!');
          console.log(`  \n\n\n Updated table , your bill : ${costFormatted} `);
          showList(startPrompt);
        });
      });
    });
  });


}

function showProductList() {
  showList(startPrompt); // needed a callback to make sure list was shown first
}


console.log("\n\n\n\n\nShow list of Products");
showProductList();

