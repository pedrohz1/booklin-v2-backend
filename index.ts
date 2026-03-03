import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("fala tropa");
});

app.listen(3000, () => {
  console.log("server open!");
});
