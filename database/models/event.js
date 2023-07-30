import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  name: {type: String, required: true}, 
  push_notif_message:{
    title: {type: String, required: false},
    body: {type: String, required: false}
  },
  created_at: {type: Date, required: false},
  last_executed_at: {type: Date, required: false}
})

const Event = mongoose.model('Event', EventSchema);

export { EventSchema, Event }