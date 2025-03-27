const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./database/connect");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Model
const Person = require(__dirname + "/database/models/Person");

// Connect to database
connectDB();

// 5a. Show Form for Creating Data
app.get("/create", (req, res) => {
  res.render("create");
});

// 5b. Create New Data
app.post("/api/create", async (req, res) => {
  try {
    const { name, age, email, street, city, state, postalCode, phone, alternatePhone, color, hobbies } = req.body;
    const newPerson = new Person({
      name,
      age,
      email,
      address: { street, city, state, postalCode },
      contact: { phone, alternatePhone },
      preferences: { color, hobbies: hobbies.split(",") }
    });
    await newPerson.save();
    res.redirect("/data");
  } catch (error) {
    res.status(400).send("Error saving data");
  }
});

// 5c. Show All Data
app.get("/data", async (req, res) => {
  const people = await Person.find();
  res.render("data", { people });
});

// 5d. Show Single Data
app.get("/data/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render("singleData", { person });
});

// 5e. Show Update Form
app.get("/update/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render("update", { person });
});

// 5f. Update Data
app.post("/api/update/:id", async (req, res) => {
  try {
    const { name, age, email, street, city, state, postalCode, phone, alternatePhone, color, hobbies } = req.body;
    await Person.findByIdAndUpdate(req.params.id, {
      name,
      age,
      email,
      address: { street, city, state, postalCode },
      contact: { phone, alternatePhone },
      preferences: { color, hobbies: hobbies.split(",") }
    });
    res.redirect("/data");
  } catch (error) {
    res.status(400).send("Error updating data");
  }
});

// 5g. Delete Data
app.get("/api/delete/:id", async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.redirect("/data");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://${process.env.HOST_NAME}:${PORT}`);
});
