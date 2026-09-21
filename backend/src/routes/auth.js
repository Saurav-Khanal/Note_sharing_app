const express=require("express");
const router=express.Router();//need to ask
const {signup,login}=require("../controllers/authContoller");
const { protect } = require("../middleware/auth");
router.post("/signup",signup);
router.post("/login",login);
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});
module.exports=router;