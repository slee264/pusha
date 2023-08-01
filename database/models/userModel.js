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

UserSchema.method('add_project', async function (project_name) {
  let result = {success: false}
  try{
    const new_project = new Project({username: this.username, project_name, created_at: new Date()});
    this.projects.push(new_project);
    const saved = await this.save();
    if(saved){
      result.success = true;
      result.project = new_project;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

UserSchema.method('getAllProjects', function () {
  let result = {success: false};
  try{
    result.projects = this.projects;
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  
  return result;
})

UserSchema.method('getProjectByName', function (project_name) {
  let result = {success: false, projects: []};
  try{
    this.projects.forEach((project) => {
      if (project.project_name.includes(project_name)){
        result.projects.push(project);
      }
    })
    result.success = true;
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

UserSchema.method('getProjectById', function (project_id) {
  let result = {success: false};
  try{
    for(project in this.projects){
      if (project_id == project._id.toString()){
        result.projects = project;
        break;
      }
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