import mongoose from 'mongoose';

import { EventSchema } from './event.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profile: {
    name: {type: String, required: true},
    project: {type: String, required: false}
  },
  trigger_events: {type: [EventSchema], required: false},
  joined: {type: Date}
}, { collection: 'user' })

const User = mongoose.model('User', UserSchema);

export { User };