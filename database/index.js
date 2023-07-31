import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import 'dotenv/config'

import { User } from './models/userModel.js';
import { Event } from './models/eventModel.js';

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
    result.connected = false;
  });
  
  return result;
}

async function create_user(new_user){
  let result = {success: false};
  try{
    const client = await connect_mongoose();
    if(client.connected){
      const {username, password, profile} = new_user; 
      const exists = await User.exists({ username });
      if(exists){
        result.err = "A user with the username already exists.";
      }else{
        const user = new User({username, password, profile, joined: new Date()});

        const saved = await user.save();

        if(saved){
          result.success = true;
          result.user = saved;
        }
      }
    }
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
}

async function get_user(user){
  let result = {success: false};
  try{
    const client = await connect_mongoose();
    if(client.connected){
      const {username, password} = user;
      const exists = await User.findOne({username});
      if (exists){
        result.success = true;
        result.user = exists;
      }else{
        result.err = "Username doesn't exist."
      }
    }
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
}

async function create_project(user, project_info){
  
}

async function create_event(user_info, event_name, push_notif_message ){
  try{
    const user = await User.findOne({ username: user_info.username });
    
    if (user){
      user.trigger_events.forEach((event) => {
        if(event.event_name == event_name){
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

export { mongo_setup, objectID, connect_mongoose, create_event, create_user, get_user }