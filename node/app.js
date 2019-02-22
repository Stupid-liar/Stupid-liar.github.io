const express = require("express");
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", function(req, res){
  res.send("aaa")
})


app.listen(80)