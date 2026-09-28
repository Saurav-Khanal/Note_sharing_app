const Room=require("../models/Room");
const generateCode=require("../utils/generateCode");
const Note=require("../models/Note");
const createRoom=async (req,res)=>{
    try{
        const {name}=req.body;
        if(!name){
            return res.status(400).json({
                message:"Room name is required"
            })
        }
        const code=generateCode();
        const room=await Room.create({
            name,
            code,
            teacher:req.user._id,
        })
        res.status(201).json({room});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

const joinRoom=async (req,res)=>{
    try{
        const {code}=req.body;
        if(!code){
            return res.status(400).json({
                message:"Code required"
            })
        }
        const room=await Room.findOne({code:code.toUpperCase()});
        if(!room){
            return res.status(400).json({
                message:"Invalid code"
            })
        }
        if(room.members.includes(req.user._id)){
            return res.status(400).json({message:"Already joined"});
        }
     room.members.push(req.user._id);
     await room.save();
     res.json({room}) ;  
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const getMyRooms=async(req,res)=>{
    try{
        let rooms;
        if(req.user.role==="teacher"){
            rooms=await Room.find({teacher:req.user._id});
        }else{
            rooms=await Room.find({members:req.user._id});
        }
        res.json({rooms});
    }catch(err){
        res.status(500).json({message:err.message});
 }
}

const regenerateCode=async (req,res)=>{
    try{
        const room=await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Room not found"});
        }
     if(room.teacher.toString()!==req.user._id.toString()){
        return res.status(403).json({message:"only teacher can regenerate code"});
     }
     room.code=generateCode();
     await room.save();
     res.json({room});   
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const deleteRoom=async (req,res)=>{
    try{
        const room=await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Room not found"});
        }
        if(room.teacher.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"only the room teacher can delete"})
        }
        await Note.deleteMany({room:room._id});
        await room.deleteOne();
        res.json({message:"Room deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}



module.exports={createRoom,joinRoom,getMyRooms,regenerateCode,deleteRoom,};