import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  username: {type: String, required: true}, 
  project_name: {type: String, required: true},
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

EventSchema.static('create_event', function(params){
  const {user, project, event} = params;
  console.log(params);
  // const new_event = new Event({username: user.username, project_name: project.project_name, event_name: event.event_name, push_notif_message, created_at: new Date()})
})

const Event = mongoose.model('Event', EventSchema);

export { Event }