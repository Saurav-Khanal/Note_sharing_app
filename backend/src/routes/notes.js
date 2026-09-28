const express=require("express");
const router=express.Router();
const{
    uploadNote,
    getRoomNotes,
    searchNotes,
    deleteNote
}=require("../controllers/noteController");
const {protect}=require("../middleware/auth");
const upload=require("../middleware/upload");

router.post("/:roomId",protect,upload.single("file"),uploadNote);
router.get("/search",protect,searchNotes);
router.get("/:roomId",protect,getRoomNotes);
router.delete("/:id",protect,deleteNote);
module.exports=router;
