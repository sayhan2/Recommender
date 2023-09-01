express=require('express');//CRUD for schema to interact with database
mongoose=require('mongoose');
const user=require('movie/backend/routes/user');
const bcrypt=require('bcrypt');
const {validation}=require ('express-validator');
const router=express.Router();
router.post('/createAccount',async(req,res)=>{//create operation(user)
    try{
      const{email,password,FirstName, LastName}=req.body;//extracts inputted user info
      const hashedPassword=await bcrypt.hash(password, 10);
      const newuser=new user({email, password:hashedPassword,FirstName,LastName});//creates new user object
      await newuser.save();//saves user object
      res.status(201).json(newuser);//prints user info
    }catch(err){
        res.status(400).json(err.message);
    }
  });
  module.exports=router;
  router.put('/UpdateInfo',async(req,res)=>{//update operation (user)
    if (req.isAuthenticated()){
        try {
            const userId=req.user._id; //finds user's ID
            const updatedInfo=req.body; //takes information user sent in to update the info
            const updatedUser=await user.findByIdAndUpdate(userId,updatedInfo,{new:true });
            res.status(200).json(updatedUser);//show updated info
          }catch(err){
            res.status(500).json({error:err.message});
          }
    }else{
        res.redirect('/login');
    }
  });
  router.delete('/DeleteAccount',async(req,res)=>{//delete operation(user)
    if (req.isAuthenticated()){
        try{
            const _id=req.body._id;
            await user.findbyIDAndDelete(_id);//function from mongoose library
            req.logout();
            res.status(200).json({message:'Account has been deleted'});
        }
        catch(err){
            res.status(500).json({error:err.message});
        }
    }else{
        res.redirect('/login');
    }
  });
  