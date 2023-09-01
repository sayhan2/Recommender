const {MongoClient}=require('mongodb');
const passport=require('passport');
require('dotenv').config();
const LocalStrategy=require('passport-local').Strategy;
const uri=process.env.MONGODB_URI;
const client=new MongoClient(uri);
const express=require('express');
const app=express();
module.exports=app;
async function connect(){
  try{
    await client.connect();
    console.log('Connected to db');
  } catch(err){
    console.error('Error connecting to db: ',err);
  }
}
//first database connection call
client.connect();
app.use(express.json());//parses incoming json data to provide to user
// route handler for fetching movie recommendations
app.get('/api/movies',async(req, res)=>{
    try{
      // connect to database
      await client.connect();
      const db=client.db('Cluster0');
      const collection=db.collection('movies');
      const movies=await collection.find().toArray();
      res.json(movies);
    }catch(err){
      console.error('Error fetching movies:', err);
      res.status(500).json({error:'Internal server error'});
    }
  });
  app.use((req,res,next)=>{
    req.dbClient.close();
  });
  const port=3000;//changeport number
  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  });