/**********************************************************************************

* ITE5315 – Assignment 1

* I declare that this assignment is my own work in accordance with Humber Academic Policy.

* No part of this assignment has been copied manually or electronically from any other source

* (including web sites) or distributed to other students. *

* Name: Sri Harshini Jilloju Student ID: N01649103 Date: Feb 20th, 2024 *

***********************************************************************************/
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the 'uploads' directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log("File MIME Type:", file.mimetype);
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
