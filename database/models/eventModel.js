import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  username: {type: String, required: true},
  project: {
    project_name: {type: String, required: true},
    _id: {type: mongoose.ObjectId, required: true}
  },
  event_name: {type: String, required: true},
  push_notif_message:{
    type: { 
      title: {type: String},
      body: {type: String}
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
    // console.log(err)
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
    const {title, body} = params;
    if(!title || !body){
      result.err = "Need to provide both title and body fields (even if they're empty)!";
      break t;
    }
    this.push_notif_message = {title, body}
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

const Event = mongoose.model('Event', EventSchema);

export { Event }