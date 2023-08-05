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
                 'update_event'], function(next){
  if(mongoose.connection.readyState != 1){
    throw new Error("Mongoose not connected (or not done connecting)!");
    next();
  }
  next();
})

EventSchema.pre('create_event', function(next, params){
  const {project, event} = params;
  if(!project || !event){
    throw new Error('Invalid parameters!');
  }
  next();
})

EventSchema.static('create_event', async function(params){
  let result = {success: false}
  t: try{
    const {project, event} = params;

    const new_event = new Event({username: project.username, project: {project_name: project.project_name, _id: project._id}, event_name: event.event_name, created_at: new Date()})
    // console.log(new_event);
    const saved = await new_event.save();

    if(saved){
      result.success = true;
      result.event = saved;
      break t;
    }
    
    result.err = "Event not saved"
  }catch(err){
    result.err = err.message;
  }
  
  return result;
})

// EventSchema.static('get_event_by_id')

EventSchema.method('update_event', async function(params){
  let result = {success: false}
  t: try{
    
  }catch(err){
    result.err = err.message;
  }
  
  return result;
})

const Event = mongoose.model('Event', EventSchema);

export { Event }