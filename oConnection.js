//this is the connection javascript.
//I spent many hours trying to return the result set to calling .js - no luck
//that is going to change the encapsulation I was planning.



var mysql = require("mysql");
const cTable = require('console.table');

var dataset = "this is the original value of dataset";

// constructor oConnection
function oConnection() {
    this.connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        // Your username
        user: "root",
        //Your password    
        password: "root",
        database: "bamazon"
    });

    this.mySQL = "";

    this.params = '';

    this.resultSet;

    this.setSQL = function (sql) {
        this.mySQL = sql;
    }

    this.setParams = function (params) {
        this.params = params;
    }

    this.getParams = function () {
        return this.params;
    }

    this.executeSQL = function (aconn, sql, params, oconnCallback) {
        aconn.connection.query(sql, params, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("  empty dataset ");
                return;
            }
            oconnCallback(result);
        });
    }

} // end of constructor oConn

module.exports = oConnection;
