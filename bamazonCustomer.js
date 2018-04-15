var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var oConnection = require('./oConnection');


var conn = new oConnection();
var resultset;



function startCustomer() {

    conn.setSQL("select * from products");  //asnc issue
    //conn.setSQL( "UPDATE products set stock_quantity = 42 where item_id = 1 ");

    //var resultset = conn.executeSQL(resultset);
    var result = conn.executeSQL(function (data) {
        console.log(" This is th dataset", data);
    });

    console.log(" is result set back yet", result);
   
}

function performSQL(callback) {
    console.log(" start of performSQL");
    var result = conn.executeSQL();
    console.log(" after performed callbacg of performSQL")
    callback(result);
}

function foo(result) {
    console.log("foo - Result :", result);
}


//startCustomer();
conn.setSQL("select * from products");
//performSQL(foo);


var x = conn.qry;
x();

//conn.connection.end();