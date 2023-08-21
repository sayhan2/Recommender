const mongoose=require('mongoose');//define schema(ie. store user info in data structure)
const bcrypt=require('bcrypt');
const schema=new mongoose.Schema({
    email:String,
    password:String,//data structure definition 
    resetToken:String,//password reset functionality
    tokenExpiration:{
        type: Date,//js datatype specifically for time tracking
        default: null//doesn't assign value until further notice 
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
module.exports=mongoose.model('User',schema);//model can be used for CRUD
module.exports=user;