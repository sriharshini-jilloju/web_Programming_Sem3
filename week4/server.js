const http = require('http');
const express = require("express");
const fs = require('fs');

const hostname= "127.0.0.1"
const port = 8080;

const app = express()

// app.use("/form",express.static("./form.html"));

app.use(express.json()); //middleware which parse the req pody

app.get("/form",(req,res)=>{
    res.sendFile(__dirname+"/form.html");
});
app.post("/api/create", (req, res) => {
    const formData = req.body;
    let data = [];
    try {
        const fileData = fs.readFileSync("data.json", "utf-8");
        if (fileData) {
            data = JSON.parse(fileData);
        }
    } catch (error) {
        console.error("Error reading data.json:", error);
    }
    data.push(formData);

    try {
        fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");
        res.status(200).json({ message: "Data saved successfully", formData });
    } catch (error) {
        console.error("Error writing to data.json:", error);
        res.status(500).json({ message: "Failed to save data" });
    }
});


app.get("/api/data",(req,res)=>{
    const data=fs.readFileSync("./data.json","utf-8")
    res.json(JSON.parse(data));
});
app.get("/api/search", (req, res) => {
    const query = req.query;
    const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

    const filteredData = data.filter(item => {
        return Object.keys(query).some(key => {
            return item[key] && item[key].toString().toLowerCase() === query[key].toLowerCase();
        });
    });
    if (filteredData.length > 0) {
        res.json(filteredData);
    } else {
        res.status(404).json({ message: "No matching data found" });
    }
});

app.get("/api/data/:id", (req, res) => {
    const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
    const result = data.find(item => item.name === req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});


app.listen(port,hostname,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
});