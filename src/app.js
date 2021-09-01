const express = require("express");
require("../src/db/conn");
const app = express();
const port = process.env.PORT || 7000;
var cors = require("cors");
const routerUsers = require("./routers/usersRouter");
app.use(cors());
app.use(express.json());
app.use(routerUsers);


app.listen(port, () => {
  console.log(`connection is live at port ${port}`);
});
