const express=require("express");
const router=express.Router();//need to ask
const {signup,login}=require("../controllers/authContoller");

router.post("/signup",signup);
router.post("/login",login);

module.exports=router;