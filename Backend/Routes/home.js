const express=require('express');//new page not in repo
const router=express.Router();
app.get('/',async(req,res)=>{//home page route 
res.render('home');//second parameter would be data needed to render page (ie. )
});
module.exports=router;