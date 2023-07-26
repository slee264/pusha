import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'

function mongo_setup(){
  try{
    const client = new MongoClient(process.env['MONGODB_URI_DEV']);
    return client;
  }catch(err){
    console.log(err);
  }
}

function objectID(_id){
  try{
    const objID = new ObjectId(_id);
    return objID;
  }catch(err){
    return err;
  }
}

export { mongo_setup, objectID }