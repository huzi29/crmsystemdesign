import app from "./app.js";
import connectDB from "./src/DB/connectDB.js";

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

});
