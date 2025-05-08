import express from "express";
import userRoutes from "./UserRoutes.js";
import blogRoutes from "./BlogRoutes.js";

const router = express.Router()

router.use("/v1/users", userRoutes);

router.use("/v1/blog", blogRoutes)




const Routes = router

export default Routes