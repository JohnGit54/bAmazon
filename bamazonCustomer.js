var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var oConnection = require('./oConnection');



var conn = new oConnection();
conn.setSQL("select * from products");



function executeSQL(aConn) {
    // console.log(conn.connection._connectCalled) ; <== perfect true false
    prepareConnection(aConn, performSQL);
}

function prepareConnection(conn, callback) {
    console.log("connected: ", conn.connection._connectCalled, ', sql:', conn.mySQL);
    if (!conn.connection._connectCalled) {
        conn.connection.connect(function (err) {
            if (err) {
                console.log("Connect Error: ", err);
                conn.connection.end();
                throw err;
            } else {
                console.log("Connected!");
                callback(conn);
            }
        })
    }
}

function performSQL(conn) {
    conn.connection.query(conn.mySQL, function (err, result) {
        if (err) {
            console.log("sql Create Error: ", err);
            conn.connection.end();
            throw err;
        }

        conn.connection.end();
        console.log("Result set num of rec", result.length);
        displayResult(result);

    });
}

function displayResult(resultSet) {
    console.table(resultSet);
}



conn.setSQL("select * from products");
executeSQL(conn);

//call 2ndrequest - new connection string
var x = new oConnection();
x.setSQL("select * from departments");
executeSQL(x);

