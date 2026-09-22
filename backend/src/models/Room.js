const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:[true,"Room name is required"]
    },
    code: {
      type: String,
      required: true,
      unique:true,
      uppercase: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
  },
  { timestamps: true }
);

module.exports=mongoose.model("Room",roomSchema);