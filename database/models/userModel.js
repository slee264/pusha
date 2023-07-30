import mongoose from 'mongoose';

import { Project } from './projectModel.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profile: {
    name: {type: String, required: true}
  },
  projects: {type: [Project.schema], required: false},
  joined: {type: Date}
}, { collection: 'user' })

const User = mongoose.model('User', UserSchema);

export { User };