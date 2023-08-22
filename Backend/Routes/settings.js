express=require('express');
app.get('/settings',async(req,res,next)=>{
if (req.isauthenticated()){
    next();
}else{
    res.redirect('/login');
}
});