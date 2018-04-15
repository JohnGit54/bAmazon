


var mysql = require("mysql");

//var oConnection = function () {
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

    this.resultSet = " dummy text in resultSEt";


}












// this.executeSQL = function () {
//     var self = this;


//     if (this.mySQL == "") {
//         console.log("The SQL is empty, set SQL");
//         return;
//     }
//     console.log("in execute, this.mySQL:", this.mySQL);


//     self.connection.connect(function (err) {
//         if (err) {
//             console.log("Connect Error: ", err);
//             throw err;
//         } else {
//             console.log("Connected!");
//         }

//         self.connection.query(self.mySQL, function (err, result) {
//             if (err) {
//                 console.log("sql Create Error: ", err);
//                 throw err;
//             }
//             console.log("Result set num of rec", result.length);

//             self.connection.end();
//             console.log("Result set num of rec", result.length);

//             return result;
//         });
//     });

// }





// this.myCallBack = function (result) {
//     console.log(" in myCallBack ", result[3].product_name);
//     return result;
// }






// //function doSomething(callback) {
// this.doSomething = function (callback) {
//     // ...
//     var self = this;
//     self.connection.connect(function (err) {
//         if (err) {
//             console.log("Connect Error: ", err);
//             throw err;
//         }
//         console.log("Connected!");

//         self.connection.query(self.mySQL, function (err, result) {
//             if (err) {
//                 console.log("sql Create Error: ", err);
//                 throw err;
//             }
//             self.connection.end();
//             console.log("Result set num of rec", result.length);
//             // Call the callback
//             callback(result);
//             return result;
//         });
//     });

// }

// function foo(result) {
//     // I'm the callback
//     console.log(" connecyion.foo ", result);
// }

// this.qry = this.doSomething(foo);








// x = new oConnection();
// x.setSQL(" Select * from products");
// console.log(" mySQL:", x.mySQL);
// console.log(" This is console.executeSQL", x.executeSQL());
//x.connection.end();
module.exports = oConnection;