import mongoose from 'mongoose';

import { Project } from './projectModel.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profile: {
    name: {type: String, required: true}
  },
  projects: {type: [Project.schema], required: false},
  joined: {type: Date}
}, { collection: 'user' })

UserSchema.static('create_user', async function (new_user){
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    
    const {username, password, profile} = new_user;
    if (!username || !password || !profile){
      result.err = "Invalid input";
      break t;
    }
    let exists = await this.exists({ username })
    if(exists){
      result.err = "Username already exists!"
      break t;
    }
    // validate ***
    const user = new User({username, password, profile, joined: new Date()});
    const saved = await user.save();
    result = saved
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

UserSchema.static('get_user_obj', async function (user){
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    const { username } = user;
    if(!username){
      result.err = "Invalid input."
      break t;
    }
    let exists = await this.findOne({username});
    if(exists){
      result.success = true;
      result.user = exists;
    }else{
      result.err = "User doesn't exist!"
    }

  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

UserSchema.static('get_user', async function (user){
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    result = await User.get_user_obj(user);
    if(result.success){
      result.user = result.user.toObject();
      delete result.user.password;
    }
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

UserSchema.method('update_user', async function (user){
  
})

UserSchema.method('add_project', async function (project) {
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const { project_name } = project;
    if(!project_name){
      result.err = "Invalid input."
      break t;
    }
    const new_project = new Project({username: this.username, project_name, created_at: new Date()});
    this.projects.push(new_project);
    const saved = await this.save();
    if(saved){
      result.success = true;
      result.project = saved;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

UserSchema.method('getAllProjects', function () {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    result.projects = this.projects;
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
})

UserSchema.method('getProject', function (project) {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    
    if (!project.project_id && !project.project_name){
      result.err = "Invalid input. Provide project={\"project_id\" / \"project_name\"}"
      break t;
    }
    if(project.project_id){
      // into ProjectModel ***
      for(project in this.projects){
        if (project_id == project._id.toString()){
          result.projects = project;
          break;
        }
      }
    }else if(project.project_name){
      var projects = [];
      this.projects.forEach((e) => {
        if (e.project_name.includes(project.project_name)){
          projects.push(e);
        }
      })
      result.projects = projects;
    }
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

const User = mongoose.model('User', UserSchema);

export { User };