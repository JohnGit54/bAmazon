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

    this.setSQL = function (sql) {
        this.mySQL = sql;
    }

    this.resultSet;

    this.executeSQL = function (aConn) {
        // console.log(conn.connection._connectCalled) ; <== perfect true false
        prepareConnection(aConn, performSQL);
    }
}



// this is outside of oConnection
function prepareConnection(conn, callback) {
    //console.log("connected: ", conn.connection._connectCalled, ', sql:', conn.mySQL);
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
        //displayResult(result);
        console.table(result);
    });
}

//this uses the npm console table package
// function displayResult(resultSet) {
//     console.table(resultSet);
// }




module.exports = oConnection;
