import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  event_name: {type: String, required: true}, 
  push_notif_message:{
    title: {type: String, required: false},
    body: {type: String, required: false}
  },
  created_at: {type: Date, required: false},
  last_executed_at: {type: Date, required: false}
})

export { EventSchema }