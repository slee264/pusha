import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import 'dotenv/config'

import { User } from './models/user.js';
import { Event } from './models/event.js';

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
  let result = {connected: false}
  await mongoose.connect(process.env['MONGODB_URI_DEV'])
  .then(() =>{
    console.log('Mongoose connected.')
    result.connected = true;
    result.mongoose = mongoose;
  })
  .catch(err => {
    console.log(err);
    result.error = err;
  });
  
  return result;
}

async function create_event(user_info, event_name, push_notif_message ){
  try{
    const user = await User.findOne({ username: user_info.username }).exec();
    
    if (user){
      user.trigger_events.forEach((event) => {
        if(event.name == event_name){
          return modify_event(user_info, event_name, push_notif_message)
        }
      })
      
      const event = new Event({
        name: event_name, 
        push_notif_message,
        created_at: new Date()
      })
      
      user.trigger_events.push(event);
      await user.save();

    }

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

export { mongo_setup, objectID, connect_mongoose, create_event }