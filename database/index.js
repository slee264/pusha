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
  t: try{
    const {user, project} = params;
    const found = await User.get_user_obj(user);
    if(!found.success){
      result = found;
      break t;
    }
    const saved = await found.user.add_project(project);
    result = saved;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
}

async function get_all_projects(user){
  let result = {success: false};
  t: try{
    const found = await User.get_user_obj(user);
    if(!found.success){
      result = found;
      break t;
    }
    const found_projects = found.user.get_all_projects();
    result = found_projects;
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
    let found_projects = found.user.get_project(project);
    result = found_projects;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
}

// async function update_project(user, project_id){
//   let result = {success: false};
//   try{
//     //update
//   }catch(e){
//     console.log(e);
//     result.err = e;
//   }
  
//   return result;
// }

async function add_event(params){
  let result = {success: false};
  t: try{
    const {user, project, event} = params;
    const user_found = await User.get_user_obj(user);
    if(!user_found.success){
      result = user_found;
      break t;
    }

    const project_found = await user_found.user.get_project(project);
    if(!project_found.success){
      result = project_found;
      break t;
    }
    result = project_found.projects.add_event(event);
    
  }catch(err){
    console.log(err);
    result.err = err.message;
  }

  return result;
}


export { mongo_setup, connect_mongoose, disconnect_mongoose, create_user, get_user, update_user, add_project, get_all_projects, get_project, add_event }