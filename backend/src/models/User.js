const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true,"Email is required"],
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type:String,
    enum:['teacher','student'],
    default:'student'
  },
},{timestamps:true});

userModel.pre("save",async function(){
  if(!this.isModified("password")) return;
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
})

userModel.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model("User",userModel)
