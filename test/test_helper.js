import mongoose from 'mongoose';
import {connect_mongoose, disconnect_mongoose} from '../database/index.js';
import 'dotenv/config';
  
// tells mongoose to use ES6 implementation of promises
mongoose.Promise = global.Promise;

before(function(done){
  connect_mongoose("development").then(() => {
    done();
  })
})

after(function(done) {
  disconnect_mongoose().then(() => {
    done();
  })
})