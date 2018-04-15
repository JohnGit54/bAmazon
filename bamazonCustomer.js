var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var oConnection = require('./oConnection');



var resultset;

var conn = new oConnection();
conn.setSQL("select * from products");



console.log(conn.mySQL, "  ", conn.resultSet);

function executeSQL() {

    conn.connection.connect(function (err) {
        if (err) {
            console.log("Connect Error: ", err);
            conn.connection.end();
            throw err;
        } else {
            console.log("Connected!");
        }

        conn.connection.query(conn.mySQL, function (err, result) {
            if (err) {
                console.log("sql Create Error: ", err);
                throw err;
            }
            //console.log("Result set num of rec", result.length);

            conn.connection.end();
            console.log("Result set num of rec", result.length);
            displayResult(result);

            return result;
        });
    });


}

function displayResult(result) {
    console.table(result);
}



executeSQL();


conn.setSQL("select * from departments");
executeSQL();
//conn.connection.end();