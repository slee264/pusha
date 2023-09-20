import mongoose from 'mongoose';
import escapeStringRegexp from 'escape-string-regexp';

import { Event } from './eventModel.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  username: {type: String},
  project_name: {type: String, required: true},
  events: {type: [{
    _id: {type: mongoose.ObjectId, required: true},
    event_name: {type: String, required: true},
    created_at: {type: Date, required: true}
  }], required: false},
  created_at: {type: Date}
})

ProjectSchema.pre(['create_project', 
                   'get_project_by_id', 
                   'get_project_by_name', 
                   'add_event',
                   'get_event',
                   'delete'], function(next){
  if(mongoose.connection.readyState != 1){
    throw new Error("Mongoose not connected (or not done connecting)!");
  }
  next();
})

ProjectSchema.static('create_project', async function (params) {
  let result = {success: false};
  t: try{
    const {user, project} = params;
    if (!user || !project || !project.project_name){
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
    const {_id} = params;
    if(!_id || ((typeof(_id) === "string" && _id.length != 24))){
      result.err = "Invalid input";
      break t;
    }
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

    const {user, project} = params;
    
    if(!project.project_name){
      result.err = "Invalid input";
      break t;
    }
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
    const new_event = await Event.create_event({project: this, event: params});
    if(new_event.success){
      this.events.push(new_event.event);
      const saved = await this.save();
      if(saved){
        result.success = true;
        result.event = new_event.event;
      }else{
        result = new_event;
      }
      break t;
    }else{
      result.err = new_event.err;
      break t;
    }
    
    result.err = "Event not added to the project!"

  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  return result;
})

ProjectSchema.method('get_event', async function(params){
  let result = {success: false}
  t: try{
    const {event} = params;
    for(const e of this.events){
      if(e._id.toString() === event._id || e._id === event._id){
        result = await Event.get_event_obj(params);
        break t;
      }
    }
    
    result.err = "Event not found on this project";
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

// ProjectSchema.method('update_project', async function (user){
  
// })

ProjectSchema.pre('delete', async function(next, params){

  const {events} = params;
  if(events){
    await events.forEach(async (event) => {
      const found_event = await Event.findById(event._id);
    })
  }
  next();
})

ProjectSchema.static('delete', async function(project){
  let result = {success: false};
  t: try{
    const {_id} = project;
    const removed = await Project.findByIdAndDelete(_id);
    result.success = true;
    if(removed){
      result.deleted_project = removed;
      break t;
    }
    
    result.removed = null;
  }catch(err){
    result.err = err.message;
  }
  
  return result;
})

const Project = mongoose.model('Project', ProjectSchema);

export { Project };