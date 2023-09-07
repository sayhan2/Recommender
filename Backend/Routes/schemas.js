mongoose=require('mongoose');
express=require('express');
const bcrypt=require('bcrypt');
const user=new mongoose.Schema({//userschema
    _id: mongoose.Schema.Types.ObjectId,
    email:String,
    password:String,//data structure definition 
    FirstName: String,
    LastName: String,
    resetToken:String,//password reset functionality
    tokenExpiration:{
        type:Date,//js datatype specifically for time tracking
        default:null//doesn't assign value until further notice 
    }
});
userSchema.pre('save',async function(next){//middleware executes function before client document saved 
    if(!this.isModified('password'))return next();//made sure password remains same 
    try{
        const salt=await bcrypt.genSalt(10);//10 rounds of hashing passowrd, more secure
        const hashed=await bcrypt.hash(this.password,salt);//hashes password with salt
        this.password=hashed;//hashed pw stored in database 
        next();
    }catch(error){//error handling 
        return next(error);//passes error to next function 
    }
});
module.exports=mongoose.model('user',schema);//model can be used for CRUD
module.exports={
    user
}