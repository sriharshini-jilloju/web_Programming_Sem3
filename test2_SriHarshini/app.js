const express = require("express");
const path = require("path");
const fs = require("fs"); 
const dataFile = path.join(__dirname, "data.json"); 

const hostname = "127.0.0.1";
const port = "8080";

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

function loadData() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFile, "utf-8", (err, data) => {
      if (err) {
        reject("Error loading data.");
      } else {
        resolve(JSON.parse(data)); 
      }
    });
  });
}

app.get("/", async (req, res) => {
  try {
    const courses = await loadData(); 
    res.render("index.ejs", {
      title: "Home Page",
      body: "pages/home", 
      courses: courses, 
    });
  } catch (error) {
    res.status(500).send("Error loading courses.");
  }
});

app.get("/add-data", async (req, res) => {
  try {
    const courses = await loadData(); // Load courses data
    res.render("index.ejs", {
      title: "Add Data Page", // Update the title
      body: "pages/add-data", // Path to the add-data view
      courses: courses, // Pass courses data to the view
    });
  } catch (error) {
    res.status(500).send("Error loading courses.");
  }
});

app.post("/api/add-data", async (req, res) => {
  try {
    const courses = await loadData();
    const newCourse = {
      id: courses.length + 1,
      course_name: req.body.course_name,
      course_code: req.body.course_code,
      instructor_name: req.body.instructor_name,
      start_date: req.body.start_date,
      credits: parseFloat(req.body.credits),
    };
    courses.push(newCourse);

    fs.writeFile(dataFile, JSON.stringify(courses, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error saving course.");
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    res.status(500).send("Error saving course.");
  }
});

app.use((req, res, next) => {
  console.log(`Request Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, hostname, (error) => {
  if (error) console.error(error.message);
  else console.log(`SERVER STARTED IN:\n${hostname}:${port}`);
});
