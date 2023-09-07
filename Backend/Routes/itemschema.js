const express=require('express');
const mongoose=require('mongoose');
const itemSchema=new mongoose.Schema({
  id:{
    type: Number, 
    required:true
   },
  title:{
    type:String,
required: true
  },
  overview:{
    type: String, 
    required: true
},
  poster_path: {
    type: String,
    required:true
},
  backdrop_path:{
    type:String,
    required:true
},
  release_date:{ 
    type: String,
    required:true
},
  media_type:{
    type:String,
    required: true
},
});
const Item=mongoose.model('Item',itemSchema);//only read route is necessary
module.exports=Item;
outer.get('/:itemId',async(req,res)=>{
    try{
      const itemId=req.params.itemId;
      const item=await Item.findOne({id:itemId});
      if(!item){
        return res.status(404).json({error:'Item not found'});
      }
      res.json(item);
    }catch(error){
      console.error(error);
      res.status(500).json({error:'Internal server error'});
    }
  });
  module.exports=router;
 
