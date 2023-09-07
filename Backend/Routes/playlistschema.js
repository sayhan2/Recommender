const {createCipheriv}=require('crypto');
const mongoose=require('mongoose');
const express=require('express');
const playlistSchema=new mongoose.model({
title:{
type: String,
required: true
},
description: String,//description not mandatory
userID:{
    type: mongoose.Schema.Types.ObjectID,
    ref:'User',
    required:true
},
PlaylistIDs:[{
    type:mongoose.Schema.Types.ObjectID,
    ref:'MovieOrShow',
}],
});
const playlist=mongoose.model('playlist',playlistSchema);
module.exports=playlist;
router.post('/playlist',async(req,res)=>{//(create) playlist route
    if(!req.isAuthenticated()){
        res.redirect('/login');
    }
    const{title, description, userId, movieOrShowIds}=req.body;
    const playlist=new playlist({
        title,
        description,
        userId,
        movieOrShowIds,
      });
      try {
        await playlist.save();
        res.status(201).json(playlist);
      }catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Failed to create playlist' });
      }
});
module.exports=router;
router.get('/playlist',async(req,res)=>{//(read) playlist route
if (!req,isAuthenticated()){
    res.redirect('/login');
}
try{
    const playlists=await playlist.find({userId:req.user._id});//playlist query
    res.status(200).json(playlists);//returns playlist in json
  }catch(error){
    console.error(error);
    res.status(500).json({error:'Could not return playlists'});
  }
});
router.put('/playlist',async(req,res)=>{//update playlist route
    if (!req,isAuthenticated()){
        res.redirect('/login');
    }
    try{const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check the operation type (add or delete)
    if (req.body.operation === 'add') {
      // Append the movie/show ID to the playlist
      const itemIdToAdd = req.body.itemId;
      playlist.movieOrShowIds.push(itemIdToAdd);
    } else if (req.body.operation === 'delete') {
      // Remove the movie/show ID from the playlist
      const itemIdToDelete = req.body.itemId;
      const indexToDelete = playlist.movieOrShowIds.indexOf(itemIdToDelete);

      if (indexToDelete !== -1) {
        playlist.movieOrShowIds.splice(indexToDelete, 1);
      }
    }

    // Save the updated playlist
    await playlist.save();

    res.status(200).json(playlist);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Failed to update playlist' });}
});

router.delete('/:id', async (req, res)=>{//(delete) crud playlist route
  try {
        if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const playlist=await playlist.findById(req.params.id);//query for playlsit
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    await playlist.remove();//delete playlst
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});
module.exports=outer;
