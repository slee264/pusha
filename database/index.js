import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import 'dotenv/config'

import { User } from './models/userModel.js';
import { Event } from './models/eventModel.js';
import { Project } from './models/projectModel.js';
import { objectID } from './utils.js';

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

async function disconnect_mongoose(){
  console.log("Disonnecting mongoose ...")
  let result = {connected: false}
  await mongoose.disconnect()
  .then(() =>{
    console.log('Mongoose disconnected.')
  })
  .catch(err => {
    console.log(err);
    result.error = err;
  });
  
  return result;
}

async function create_user(new_user){
  let result = {success: false};
  try{
    const saved = await User.create_user(new_user);
    result = saved;
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
}

async function get_user(user){
  let result = {success: false};
  try{
    const found = await User.get_user(user);
    result = found;
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
}

async function update_user(user){
  let result = {success: false};
  try{
    if(mongoose.connection.readyState == 1){
      const user = {
        username: user.username,
        password: user.password
      }
      await get_user(user)
      .then(user => {
        if(user.success){
          //update user
        }
    })}else if(mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0){
      result.err = "mongoose not connected"
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

async function add_project(params){
  let result = {success: false};
  try{
    const {user, project} = params;
    const found = await User.get_user_obj(user);
    if(found.success){
      const saved = await found.user.add_project(project);
      result = saved;
    }else{
      result = found;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
}

async function get_all_projects(user){
  let result = {success: false};
  try{
    const found = await User.get_user_obj(user);
    if(found.success){
      const found_projects = found.user.getAllProjects();
      result = found_projects;
    }else{
      result = found;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

async function get_project(params){
  let result = {success: false};
  const {user, project} = params;
  t: try{
    const found = await User.get_user_obj(user);
    if(!found.success){
      result = found;
      break t;
    }
    let found_projects = found.user.getProject(project);
    result = found_projects;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

async function update_project(user, project_id){
  let result = {success: false};
  try{
    //update
  }catch(e){
    console.log(e);
    result.err = e;
  }
  
  return result;
}

// async function create_event(user_info, event_name, push_notif_message ){
//   try{
//     const user = await User.findOne({ username: user_info.username });
    
//     if (user){
//       user.trigger_events.forEach((event) => {
//         if(event.event_name == event_name){
//           return modify_event(user_info, event_name, push_notif_message)
//         }
//       })
      
//       const event = new Event({
//         name: event_name, 
//         push_notif_message,
//         created_at: new Date()
//       })
      
//       user.trigger_events.push(event);
//       await user.save();

//     }

//   }catch(err){
//     console.log(err);
//   }
// }

export { mongo_setup, connect_mongoose, disconnect_mongoose, create_user, get_user, update_user, add_project, get_all_projects, get_project }