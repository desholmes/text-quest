const express = require("express");
const port = process.env.PORT;

const app = express();

app.use(express.static("/app/public"));

app.listen(port, "0.0.0.0", err => {
  if (err) {
    console.log(err);
  }
  console.info(
    "===> HTTP server listening on port " +
      port +
      ". Open up http://0.0.0.0:" +
      port +
      " in your browser."
  );
});
