import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  username: {type: String, required: true}, 
  project_name: {type: String, required: true},
  event_name: {type: String, required: true},
  push_notif_message:{
    _id: {type: String, required: true, unique: true},
    title: {type: String, required: false},
    body: {type: String, required: false}
  },
  created_at: {type: Date, required: false},
  last_executed_at: {type: Date, required: false}
})

const Event = mongoose.model('Event', EventSchema);

export { Event }