import mongoose from 'mongoose';
import 'dotenv/config';
import log from 'why-is-node-running'
import {connect_mongoose, disconnect_mongoose} from '../database/index.js';
import {shutdown_agenda} from '../push/agenda/agenda.js';
  
// tells mongoose to use ES6 implementation of promises
mongoose.Promise = global.Promise;

before(function(done){
  connect_mongoose("development").then(() => {
    done();
  })
})

after(function(done) {
  disconnect_mongoose().then(() => {
    shutdown_agenda(done)
  })
})