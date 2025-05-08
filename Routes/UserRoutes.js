import express from "express";
import Signup from "../Controllers/Users/Signup.js";
import Login from "../Controllers/Users/Login.js";

const router = express.Router();

router.post("/signup", Signup);

router.post("/login", Login);



const userRoutes = router

export default userRoutes
