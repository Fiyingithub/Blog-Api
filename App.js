import express from "express";
import { PORT } from "./Config/config.js";
import { connectToDatabase } from "./DB/MongodbConnection.js";
import Routes from "./Routes/index.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));


// DATABASE CONNECTION
connectToDatabase

app.use('/api', Routes)


app.listen(PORT, ()=> {
    console.log(`Server connected on https://localhost:${PORT}`)
})