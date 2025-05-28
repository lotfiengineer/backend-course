const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 3500;

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res, next) => {
  console.log("three");
  res.send("Finished!");
};

// custom middleware logger
app.use(logger);

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get(/^\/$|^\/index(\.html)?$/, (req, res) => {
  // app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get(/\/new-page(\.html)?/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get(/\/old-page(\.html)?/, (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.get(
  /\/hello(\.html)?/,
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

app.get(/^\/chain(\.html)?$/, [one, two, three]);

app.get(/\/*/, (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
