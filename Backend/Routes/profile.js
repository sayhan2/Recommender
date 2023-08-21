express=require('express');
app.get('/settings',async(req,res,next)=>{
    if (req.isAuthenticated()){
        res.render('/profile',{user:req.user});//creates user object of user: userid(ie. email)
    }//email is sent with each and every request, use email to display data ie. hello email!
    else{
        res.redirect('/login',{user:req.user});
    }
});