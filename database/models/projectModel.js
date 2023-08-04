import mongoose from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';

import { Event } from './eventModel.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  username: {type: String},
  project_name: {type: String, required: true},
  events: {type: [Event.schema], required: false},
  created_at: {type: Date}
})

ProjectSchema.static('create_project', async function (params) {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const {user, project} = params;
    if (!user || !project){
      result.err = "Invalid input";
      break t;
    }
    const new_project = new Project({username: user.username, ...project, created_at: new Date()})
    const saved = await new_project.save();
    if(saved){
      result.success = true;
      result.project = saved;
      break t;
    }
    
    result.err = "Project not saved"
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

ProjectSchema.static('get_project_by_id', async function(params) {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const {_id} = params;
    const found = await Project.findById(_id);
    if(found){
      result.success = true;
      result.project = found;
      break t;
    }
    
    result.err = "Project with _id: \"" + _id.toString() + "\" not found"
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

ProjectSchema.static('get_project_by_name', async function(params) {
  let result = {success: false};
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const {user, project} = params;
    const $regex = escapeStringRegexp(project.project_name);
    const found = await Project.find({
      username: user.username,
      project_name: {$regex}
    });

    if(found){
      result.success = true;
      result.project = found;
    }
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

ProjectSchema.method('add_event', async function (params) {
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const new_event = await Event.create_event({project: this, event: params});
    
    if(new_event){
      this.events.push(new_event.event);
      const saved = await this.save();
      if(saved){
        result.success = true;
        result.event = new_event.event;
      }
      break t;
    }
    
    result.err = "Project not saved";

  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

// ProjectSchema.method('update_project', async function (user){
  
// })

ProjectSchema.pre('delete', async function(next, project){
  const {events} = project;
  if(!events){
    next();
  }
  await project.events.forEach(async (event) => {
    await Event.findByIdAndDelete(event._id);
  })
  next();
})

ProjectSchema.static('delete', async function(project){
  let result = {success: false};
  try{
    const {_id} = project;
    const removed = await Project.findByIdAndDelete(_id);
    if(removed){
      result.success = true;
    }
  }catch(err){
    result.err = err.message;
  }
  
  return result;
})

const Project = mongoose.model('Project', ProjectSchema);

export { Project };