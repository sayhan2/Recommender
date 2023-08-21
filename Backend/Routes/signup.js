const express=require('express');
const User=require('../../routes/user');
const bcrypt=require ('bcrypt');
const {validation}=require ('express-validator');
const router =express.Router();
app.post('/createAccount',async (req,res)=>{
const {email, password}=req.body;//email password read from request body 
const hashedPassword=await bcrypt.hash(password, 10);
try {
    const newUser=await User.create({
      email: email,
      password: hashedPassword,
    });
  }catch(error){
    console.error('Error creating user:',error);
    res.status(500).json({message:'user canot be created'});
  }
});
module.exports=router;