import mongoose from 'mongoose';
const { Schema } = mongoose;

import 'dotenv/config'
import { setup_agenda, scheduleSendMessage, cancelJob } from '../../push/agenda/agenda.js';
import { streamline } from '../../push/utils.js';

const EventSchema = new Schema({
  username: {type: String, required: true},
  project: {
    project_name: {type: String, required: true},
    _id: {type: mongoose.ObjectId, required: true}
  },
  event_name: {type: String, required: true},
  push_notif_message:{
    _id: {type: mongoose.ObjectId, auto: false, required: false},
    type: { 
      message: {
        _id: false,
        type: {
          title: {type: String}, 
          body: {type: String}
        }
      },
      schedule: {
        _id: false,
        type: {
          repeat: {type: Boolean},
          repeatInterval: {type: String},
          timezone: {type: String},
          startDate: {type: String},
          repeatAt: {type: String},
          nextRunAt: {type: String}
        },
        required: false
      },
      device_token: {type: String, _id: false}
    },
    required: false
  },
  created_at: {type: Date, required: true},
  last_executed_at: {type: Date, required: false}
})

EventSchema.pre(['create_event',
                 'get_event_obj',
                 'update_event'], function(){
  if(mongoose.connection.readyState != 1){
    throw new Error("Mongoose not connected (or not done connecting)!");
  }
})

EventSchema.static('create_event', async function(params, err){
  let result = {success: false}
  t: try{
    const {project, event} = params;
    const new_event = new Event({username: project.username, project: {project_name: project.project_name, _id: project._id}, event_name: event.event_name, created_at: new Date()})
    const saved = await new_event.save();
    if(saved){
      result.success = true;
      result.event = {
        _id: saved._id,
        event_name: saved.event_name,
        created_at: saved.created_at
      };
      break t;
    }
    
    result.err = "Event not saved"
  }catch(err){
    console.log(err.message)
    result.err = err.message;
  }
  
  return result;
})

EventSchema.static('get_event_obj', async function(params){
  let result = {success: false}
  t: try{
    const {event} = params;
    if(!event || !event._id || ((typeof(event._id) === "string" && _id.length != 24))){
      result.err = 'Invalid parameters!';
      break t;
    }
    const found = await Event.findById(event._id);
    
    if(found){
      result.success = true;
      result.event = found;
      break t;
    }
    
    result.err = "Event not found";
  }catch(err){
    result.err = err.message;
    console.log(err);
  }
  
  return result;
})

EventSchema.method('update_event', async function(params){
  let result = {success: false}
  t: try{
    
  }catch(err){
    result.err = err.message;
  }
  
  return result;
})

EventSchema.method('create_message', async function(params){
  let result = {success: false}
  t: try{
    const {message} = params;
    if(!message.title || !message.body){
      result.err = "Need to provide both title and body fields!";
      break t;
    }
    this.push_notif_message = {message};
    const saved = await this.save();
    if(saved){
      result.success = true;
      result.event = this;
      break t;
    }
    result.err = "Message not saved"
  }catch(err){
    result.err = err.message;
    console.log(err)
  }
  
  return result
})

EventSchema.method('set_message_schedule', async function(params){
  let result = {success: false}
  t: try{

    params['message'] = this.push_notif_message.message;
    // console.log(params)
    const res = await scheduleSendMessage(params);
    let job = res.job.attrs;
    // console.log(job.nextRunAt.toISOString())
    this.push_notif_message.schedule = {
      "nextRunAt": job.nextRunAt.toISOString(),
      "repeatInterval": job.repeatInterval,
      "repeatAt": job.repeatAt
    };
    this.push_notif_message._id = job._id;
    this.push_notif_message.device_token = job.data.device_token;
    this.push_notif_message.message = job.data.message;
    // console.log(res);
    const saved = await this.save();
    if(saved){
      result.success = true
      result.event = saved;
      break t;
    }
    
    result.err = "Event not saved"
  }catch(err){
    console.log(err)
    result.err = err.message
  }
  
  return result;
})

EventSchema.method('delete_push_notif', async function(){
  let result = {success: false}
  t: try{
    const deleted = await cancelJob({
      _id: this.push_notif_message._id.toString()
    })
    console.log(deleted)
    if(deleted.success){
      this.push_notif_message = undefined;
      await this.save();
      result.success = true;
      break t;
    }
  }catch(err){
    console.log(err);
    result.err = err.message;
  }
  
  return result;
})

const Event = mongoose.model('Event', EventSchema);

export { Event }