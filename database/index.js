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
    if(mongoose.connection.readyState == 1){
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
    }else if(mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0){
      result.err = "mongoose not connected"
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
    if(mongoose.connection.readyState == 1){
      const {username, password} = user;
      const exists = await User.findOne({username});
      if (exists){
        result.success = true;
        result.user = exists;
      }else{
        result.err = "Username doesn't exist."
      }
    }else if(mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0){
      result.err = "mongoose not connected"
    }
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

async function create_project(user){
  let result = {success: false};
  try{
    if(mongoose.connection.readyState == 1){
      const { username, project_name } = user;
      const found = await get_user({username});
      if(found.success){
        const new_project = new Project({username, project_name, created_at: new Date()});
        found.user.projects.push(new_project);
        const saved = await found.user.save();
        if(saved){
          result.success = true;
          result.user = found.user;
        }
      }else{
        result.err = "User not found"
      }
    }else if(mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0){
      result.err = "mongoose not connected"
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
}

async function get_project(user){
  let result = {success: false};
  try{
    if(mongoose.connection.readyState == 1){
      const { username, password } = user;
      const found = await get_user({username, password});

      if(found.success){
        result.success = true;
        result.projects = found.user.projects;
      }else{
        result.err = found.err;
      }
    }else if(mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0){
      result.err = "mongoose not connected"
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

async function update_project(user, project_id){
  let result = {success: false};
  try{
    
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

export { mongo_setup, connect_mongoose, disconnect_mongoose, create_user, get_user, update_user, create_project, get_project }