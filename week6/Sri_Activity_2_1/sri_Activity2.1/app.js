const express = require("express");
const path= require("path");

const app = express();
const hostname = "127.0.0.1";
const port = "8080";

app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","main.html"));
});

app.listen(port,hostname ,() => {
    console.log(`Server running on ${hostname}:${port}`);
});