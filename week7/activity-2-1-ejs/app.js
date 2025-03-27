const express = require("express");
const path = require("path");
const { users } = require("./data");

const hostname = "127.0.0.1";
const port = "8080";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res, next) => {
  res.render("index.ejs", {
    title: "Home Page",
    body: "./pages/home.ejs",
    users,
  });
});

app.get("/about-us", (req, res, next) => {
  res.render("index.ejs", { title: "Home Page", body: "./pages/about-us.ejs" });
});

app.get("/contact-us", (req, res, next) => {
  res.render("index.ejs", {
    title: "Home Page",
    body: "./pages/contact-us.ejs",
  });
});

app.listen(port, hostname, (error) => {
  if (error) console.error(error.message);
  else console.log(`SERVER STARTED IN:\n${hostname}:${port}`);
});
