const mongoose=require("mongoose");

const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title required"],
    },
    subject:{
        type:String,
        required:[true,"subject required"]
    },
    fileUrl:{
        type:String,
        required:true
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
{timestamps:true}
)

module.exports=mongoose.model("Note",noteSchema);
