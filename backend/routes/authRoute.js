import {register , verifyOtp , sendOtp , login,refreshAccessToken} from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);  
router.post("/refresh", refreshAccessToken); 


export default router;