var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var oConnection = require('./oConnection');





var conn = new oConnection();


var custSQL =[];

var x = "select p.item_id , p.product_name , d.department_name, \
 p.price , p.stock_quantity  from products p , departments d \
  where p.department_id  = d.department_id " ;

  custSQL.push(x);


//homework page 1 task 5 - display all products
console.log (" This is the CUSTOMER. javascript");
conn.setSQL("select * from products");
conn.executeSQL(conn);

var _conn = new oConnection();
_conn.setSQL( custSQL[0] );
_conn.executeSQL(_conn);
 
 
