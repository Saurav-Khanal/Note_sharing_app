const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }
    const existing=await User.findOne({email}) ;
  if(existing){
    return res.status(400).json({message:"Email already in use"});
  }
  const user=await User.create({name,email,password,role});
  const token=generateToken(user._id);
  res.status(201).json({
    token,
    user:{
      id:user._id,
      name:user.name,
      email:user.email,
      role:user.role,
    }
  })
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login=async (req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({message:"email and password required"});
    }

    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
      return res.status(400).json({message:"invalid credentials"});
    }
    const token=generateToken(user._id);
    res.status(200).json({
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      },
    });
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports={signup,login};