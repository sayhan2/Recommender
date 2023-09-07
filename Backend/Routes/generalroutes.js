express=require('express');
passport=require('passport');
app.get('/settings',async(req,res,next)=>{
    if (req.isAuthenticated()){
        res.render('profile',{user:req.user});//creates user object of user: userid(ie. email)
    }//email is sent with each and every request, use email to display data ie. hello email!
    else{
        res.redirect('/login');
    }
});
const router=express.Router();
app.get('/',async(req,res)=>{//home page route 
res.render('home');//second parameter would be data needed to render page (ie. )
});
app.get('/settings',async(req,res,next)=>{
    if (req.isauthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
    });
module.exports=router;