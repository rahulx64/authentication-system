import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  verifyemail,
  forgotpassword,
  resetpassword,
  checkauth,
} from "../controllers/auth.controller.js";

import {verifytoken} from "../middleware/verifytoken.js";
router.get("/checkauth", verifytoken, checkauth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verifyemail", verifyemail);

router.post("/forgotpassword",forgotpassword);
router.post("/resetpassword/:token",resetpassword);




export default router;
