


/// This is javascript that was used to create tables  , add foeign key , and iserted records.


var mysql = require("mysql");
//var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    //Your password    
    password: "root",
    database: "bamazon"

    //password - removed comma- becuase going to create a database
    //password: "root"
});


// //this did create the database
// var createDatabase_bamazon = function () {
//     connection.connect(function (err) {
//         if (err) throw err;
//         console.log("Connected!");
//         /*Create a database named "mydb":*/
//         connection.query("CREATE DATABASE bamazon", function (err, result) {
//             if (err) throw err;
//             console.log("Database created");
//         });
//     }); 
//     connection.end();
// }
// createDatabase_bamazon();

var createTable_products = function () {
    // will use this to create the products and departments tables.
    var sqlCreateTableProducts = "  CREATE TABLE products ( item_id INT NOT NULL AUTO_INCREMENT, \
 product_name  VARCHAR(100) NOT NULL,  department_id INT NOT NULL, price DECIMAL(10,2) NULL, \
 stock_quantity INT NULL, PRIMARY KEY (item_id) )"  ;
 //var sqlDropTable = 'DROP TABLE products';
 
 var sqlCreateTableDepartments = "  CREATE TABLE departments ( department_id INT NOT NULL AUTO_INCREMENT, \
    department_name  VARCHAR(50) NOT NULL,   overhead_costs DECIMAL(16,2) NULL , \
     PRIMARY KEY (department_id) )"  ;

 var sqlAlterTable = " ALTER TABLE products  ADD CONSTRAINT FOREIGN KEY ( department_id ) REFERENCES departments (department_id)  ";

 var insertDepts = " INSERT INTO departments ( department_name , overhead_costs )  \
VALUES('Home Goods' , 2000) , ('Electronics',85060) , ('Toys',750) , ('Tools', 3000) , ('Clothes - Ladies' , 7400) , ('Clothes - Men' , 200) ";

var insertProducts = " INSERT INTO products ( product_name , department_id , price , stock_quantity )  \
VALUES('Blue-ray Player' , 2,  47.99 , 5000  ) ,  ('HD LED TV 30inch' , 2,  140.00 , 200  ) ,\
('HD LED TV 40inch' , 2,  190.00 , 200  ) , ('HD LED TV 55inch' , 2,  300.00 , 200  ) , ('HD LED TV 70inch' , 2,  1050.00 , 200  ) ,\
('Shirt -calvin klein XL' , 6,  30.00 , 400  ) , ('Shirt -calvin klein XS' , 6,  30.00 , 3  ) , ('Mens Pants- skinny jeans',6 ,84.99, 20 )" ;
 



    //console.log(sqlCreateDepartments);

    connection.connect(function (err) {
        if (err) {
            console.log("Error: ", err);
            throw err;
        }
        console.log("Connected!");
        connection.query( insertProducts , function (err, result) {
            if (err) {
                console.log("sql Create Error: ", err);
                throw err;
            }
            console.log("Table created");
            connection.end();
        });
    });
    
}


createTable_products();