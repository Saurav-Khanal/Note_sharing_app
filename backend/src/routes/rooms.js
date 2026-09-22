const express=require("express");
const router=express.Router();

const{
    createRoom,
    joinRoom,
    getMyRooms,
    regenerateCode,
}=require("../controllers/roomController");
const {protect}=require("../middleware/auth");

router.post("/",protect,createRoom);
router.post("/join",protect,joinRoom);
router.get("/my",protect,getMyRooms);
router.post("/:id/regenerate",protect,regenerateCode);

module.exports=router;