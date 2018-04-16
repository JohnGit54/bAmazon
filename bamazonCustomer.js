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

//if (!connection._connectCalled) {
connection.connect(function (err) {
  if (err) {
    console.log("Connect Error: ", err);
    connection.end();
    throw err;
  } else {
    console.log("Connected! as id ", connection.threadId);
  }
})
//}



var custSQL = [];

var x = "select p.item_id , p.product_name , d.department_name, \
 p.price , p.stock_quantity  from products p , departments d \
  where p.department_id  = d.department_id \
   order by p.department_id ,p.price , p.product_name " ;

custSQL.push(x);

x = " Select item_id, stock_quantity from products where item_id = ? "
custSQL.push(x);


//homework page 1 task 5 - display all products
console.log(" This is the CUSTOMER. javascript");
// conn.setSQL("select * from products");
// conn.executeSQL(conn);


function showList(callback) {
  // var _conn = new oConnection();
  // _conn.setSQL(custSQL[0]);
  // _conn.executeSQL(_conn);
  connection.query(custSQL[0], function (err, result) {
    if (err) {
      console.log("sql Create Error: ", err);
      connection.end();
      throw err;
    }
    console.table(result);
    callback();
  });
}



function startPrompt() {
  var inStockQuantity;

  inStockQuantity = promptID();
  inquirer
    .prompt([
      {
        message: "What is the Product ID or QUIT?",
        name: "prod_id"
      },
      {
        message: "How many do you wish to buy?",
        name: "quant"
      }
    ])
    .then(answers => {
      if (answers.prod_id == "QUIT") process.exit();
      if (isNaN(answers.prod_id)) {
        console.log(" Please enter numeric ID value");
        startPrompt();
      } else {
        connection.query(custSQL[1], answers.prod_id, function (err, result) {
          if (err) throw err;
          if (result.length == 0) {
            console.log(" Id number not valid, try again ");
            startPrompt();
          }
          inStockQuantity = result[0].stock_quantity;
          console.log("valid id and quantity");
          update_products(answers);
          showList(startPrompt);
        });
      }

    });
};



function promptID(){
  inquirer
  .prompt([
    {
      message: "What is the Product ID or QUIT?",
      name: "prod_id"
    }   
  ])
  .then(answers => {
    if (answers.prod_id == "QUIT") process.exit();
    if (isNaN(answers.prod_id)) {
      console.log(" Please enter numeric ID value");
      //startPrompt();
      return false;
    } else {
      connection.query(custSQL[1], answers.prod_id, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          console.log(" Id number not valid, try again ");
          //startPrompt();
          return false;
        }
        inStockQuantity = result[0].stock_quantity;
        console.log("valid id and quantity, on hand: " , inStockQuantity);
        return inStockQuantity
        update_products(answers);
        showList(startPrompt);
      });
    }

  });
}

function update_products(answers) {
  var x = " Update products set stock_quantity = stock_quantity - ? where item_id = ?";
  connection.query(x, [answers.quant, answers.prod_id], function (err, result) {
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


console.log("Show list of Products");
showProductList();

