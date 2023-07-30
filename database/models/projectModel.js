import mongoose from 'mongoose';

import { Event } from './eventModel.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  username: {type: String, required: true, unique: true},
  project_name: {type: String, required: true},
  events: {type: [Event.schema], required: false},
  created_at: {type: Date}
})

const Project = mongoose.model('Project', ProjectSchema);

export { Project };