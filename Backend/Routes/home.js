const express=require('express');//new page not in repo
const router=express.Router();
app.get('/',async(req,res)=>{//home page route 
    //const homemovies=await fetchhomemovies();,include preceding data if necessary to render home page
res.render('home');//second parameter would be data needed to render page (ie. )
});//{homemovies:homemovies}) as second parameter 
module.exports=router;