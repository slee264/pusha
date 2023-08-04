import mongoose from 'mongoose';

import { Project } from './projectModel.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profile: {
    name: {type: String, required: true}
  },
  projects: {
    type: [{
      _id: {type: mongoose.ObjectId, required: true},
      project_name: {type: String, required: true}
    }], 
    required: false},
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
    let saved = await user.save();
    if(saved){
      result.success = true;
      saved = saved.toObject();
      delete saved.password;
      result.user = saved;
    }
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
      break t;
    }
    
    result.err = "User doesn't exist!"

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

UserSchema.static('delete_user', async function (user){
  
})

UserSchema.method('add_project', async function (project) {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const created = await Project.create_project({user: this, project});
    if(created.success){
      this.projects.push({
        _id: created.project._id,
        project_name: created.project.project_name
      });
      const saved = await this.save();
      if(saved){
        result = created;
        break t;
      }  
      result.err = "User not saved!"
    }else{
      result = created;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

UserSchema.method('get_all_project_objs', async function () {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    let found = [];
    for(const project of this.projects){
      found.push((await Project.get_project_by_id(project._id)).project);
    }
    result.projects = found;
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
})

// UserSchema.method('get_project', function (project) {
//   let result = {success: false};
//   t: try{
//     const {_id, project_name} = project;
//     if(mongoose.connection.readyState != 1){
//       result.err = "Mongoose not connected (or not done connecting)!";
//       break t;
//     }
    
//     if (!_id && !project_name){
//       result.err = 'Invalid input. Provide project={\"project_id\" / \"project_name\"}'
//       break t;
//     }
//     if(_id){
//       for(const e of this.projects){
//         if(e._id.toString() === _id){
//           result.success = true;
//           result.project = e;
//           break t;
//         }
//       }
//     }else if(project.project_name){
//       for(const e of this.projects){
//         if(e.project_name.includes(project.project_name)){
//           result.success = true;
//           result.project = e;
//           break t;
//         }
//       }
//     }
    
//     result.err = "Project not found"
//   }catch(e){
//     console.log(e);
//     result.err = e.message;
//   }
//   return result;
// })

UserSchema.method('get_project_obj', async function (project) {
  let result = {success: false};
  t: try{
    const {_id, project_name} = project;
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!";
      break t;
    }
    
    if (!_id && !project_name){
      result.err = 'Invalid input. Provide project={\"project_id\" / \"project_name\"}'
      break t;
    }
    if(_id){
      for(const e of this.projects){
        if(e._id.toString() === _id){
          result = await Project.get_project_by_id(e._id);
          break t;
        }
      }
    }else if(project.project_name){
      result = await Project.get_project_by_name(project_name);
      break t;
    }

    result.err = "Project not found"
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

UserSchema.method('update_project', function() {
  
})

UserSchema.method('delete_project', function() {
  
})

const User = mongoose.model('User', UserSchema);

export { User };