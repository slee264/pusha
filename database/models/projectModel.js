import mongoose from 'mongoose';

import { Event } from './eventModel.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  username: {type: String},
  project_name: {type: String, required: true},
  events: {type: [Event.schema], required: false},
  created_at: {type: Date}
})

ProjectSchema.method('add_event', async function (event) {
  let result = {success: false}
  t: try{
    if(mongoose.connection.readyState != 1){
      result.err = "Mongoose not connected (or not done connecting)!"
      break t;
    }
    const { username, project_name, event_name } = event;
    if(!username || project_name || event_name){
      result.err = "Invalid input";
      break t;
    }
    const new_event = new Event(
      {
        username, 
        project_name, 
        event_name, 
        created_at: new Date()
      }
    );
    this.events.push(new_event);
    const saved = this.save();
    if(saved){
      result.success = true;
      result.event = saved;
    }
  }catch(e){
    console.log(e);
    result.err = e.message;
  }
  return result;
})

// ProjectSchema.method('update_project', async function (user){
  
// })

const Project = mongoose.model('Project', ProjectSchema);

export { Project };