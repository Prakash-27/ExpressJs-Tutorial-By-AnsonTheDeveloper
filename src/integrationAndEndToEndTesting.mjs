import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";


// connecting to MongoDB database.
mongoose
  .connect("mongodb://localhost/express_tutorial") 
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));   

const app = createApp();
  
const localhost = "localhost";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${localhost}:${PORT}`);
});

