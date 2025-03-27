/**********************************************************************************

* ITE5315 – Assignment 1

* I declare that this assignment is my own work in accordance with Humber Academic Policy.

* No part of this assignment has been copied manually or electronically from any other source

* (including web sites) or distributed to other students. *

* Name: Sri Harshini Jilloju Student ID: N01649103 Date: Feb 20th, 2024 *

***********************************************************************************/
// Middleware to handle 404 Not Found
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ error: "Route not found" });
};

// Middleware to handle 500 Server Errors
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { notFoundHandler, errorHandler };
