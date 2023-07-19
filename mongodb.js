import { MongoClient } from 'mongodb'
import 'dotenv/config'

export function mongo_setup(){
  try{
    const client = new MongoClient(process.env['MONGODB_URI_DEV']);
    return client;
  }catch(err){
    console.log(err);
  }
}