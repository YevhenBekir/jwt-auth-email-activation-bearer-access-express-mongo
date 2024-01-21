import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./http/routes/authRoute.js";
import usersRoute from "./http/routes/usersRoute.js";

import errorMiddleware from "./http/middlewares/apiErrorMiddleware.js";


dotenv.config();

const app = express();
const API_PORT = process.env.API_PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;


// DATABASE CONNECTION
await mongoose.connect(DATABASE_URL)
    .then((res) => console.log("Connected to DATABASE !"))
    .catch((error) => console.log(error));


// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// ROUTERS
app.use("/auth", authRoute);
app.use("/users", usersRoute);


// ERROR MIDDLEWARE
app.use(errorMiddleware);


app.listen(API_PORT, () => {
    console.log(`SERVER STARTED ON PORT: ${API_PORT}`);
})