import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  username: {type: String, required: true}, 
  project_name: {type: String, required: true},
  event_name: {type: String, required: true},
  push_notif_message:{
    type: { 
      _id: {type: String},
      title: {type: String},
      body: {type: String}
    },
    required: false
  },
  created_at: {type: Date, required: true},
  last_executed_at: {type: Date, required: false}
})

const Event = mongoose.model('Event', EventSchema);

export { Event }