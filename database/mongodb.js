import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import 'dotenv/config'

function mongo_setup(){
  try{
    const client = new MongoClient(process.env['MONGODB_URI_DEV']);
    return client;
  }catch(err){
    console.log(err);
  }
}

async function connect_mongoose(){
  console.log("Connecting mongoose ...")
  await mongoose.connect(process.env['MONGODB_URI_DEV'])
  .then(() =>{
    console.log('Mongoose connected.')
  })
  .catch(err => {
    console.log(err);
  });
  return mongoose;
}


function objectID(_id){
  try{
    const objID = new ObjectId(_id);
    return objID;
  }catch(err){
    return err;
  }
}

export { mongo_setup, objectID, connect_mongoose }