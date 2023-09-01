const {createCipheriv}=require('crypto');
const mongoose=require('mongoose');
const express=require('express');
const mongoose=require('mongoose');
const playlistSchema=new mongoose.Schema({//defined data structure for playlist item
title:String,
director:String,
poster: String,
ratings: Number,
type:String,//movie OR show
releaseDate: Date,
description:String
});
const playlistitem=mongoose.model('playlistitem',playlistSchema);
module.exports=playlistitem;
app.get('/watchLater',async(req,res)=>{
    try{
      if(req.isAuthenticated()) {//make sure authenticated
        const userId=req.user._id;//get user ID 
        const playlistitems=await playlistitem.find({userId});//search query
        res.render('watchLater',{playlistitems});
      }else{
        res.redirect('/login');
      }
    }catch(err){
      console.error('Cannot retrieve watch later playlist',err);
      res.status(500).json({message:'Server error'});
    }
  });
app.delete('/watchLater',async(req,res)=>{//delete from playlist route 
try{
    if(req.isAuthenticated()){
        const userId=req.user._id;
        const deleteitem=req.body._id;//request body id shows id of item to delete 
        const postplaylist=await playlistitem.deleteOne({_id:deleteitem,userID:userId});
    }else{//deleteone function finds id of item to be deleted and deletes it from userID playlist 
        res.redirect('/login');
    }
}catch(err){
    console.log('Error:',err);
    res.status(500).json({message:'Internal server error'});
  }
})
app.post('/watchLater',async(req,res)=>{//add to playlist route
if(req.isAuthenticated()){
const userID=req.user._id;
const ItemToAdd=new playlistitem({
    ...req.body,
    userID
});
await ItemToAdd.save();
}else{
    res.redirect('/login');
}
})
  