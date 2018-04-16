var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
    console.log(" in prompt ID - what is answers", answers);
    if (answers.prod_id.toUpperCase() == "QUIT") process.exit();
    if (isNaN(answers.prod_id)) {
      console.log(" Please enter numeric ID value");
      startPrompt();
      return;
    } else {
      var sql = "Select item_id, stock_quantity from products where item_id = ? ";
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
      if (isNaN(answers.quant)){
        console.log("Please enter numeric quantity value");
        promptQuantity(result);
        return;
      }
      if (result[0].stock_quantity >= answers.quant) {
        update_products(result[0].item_id, answers.quant);
        showList(startPrompt);
        return;
      } else {
        console.log(`Sorry Insufficient Quantity, we have ${result[0].stock_quantity} on hand`);
        promptQuantity(result);
      }
    })
}
// promptQuantity();


function update_products(aID, aQnt) {
  var x = " Update products set stock_quantity = stock_quantity - ? where item_id = ?";
  connection.query(x, [aQnt, aID], function (err, result) {
    if (err) {
      console.log("sql Create Error: ", err);
      connection.end();
      throw err;
    }
    console.log(" Updated table");

  });

}

function showProductList() {
  showList(startPrompt); // needed a callback to make sure list was shown first
}


console.log("\n\n\n\n\nShow list of Products");
showProductList();

