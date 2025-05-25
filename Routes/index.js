import express from "express";
import userRoutes from "./UserRoutes.js";
import blogRoutes from "./BlogRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);

router.use("/blog", blogRoutes);

const Routes = router;

export default Routes;
