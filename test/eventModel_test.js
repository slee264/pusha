import { Event } from '../database/models/eventModel.js';

import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import assert from 'assert';

describe('Event', function (){
  
  before(function(done){
    mongoose.connection.collections.events.drop(() => done());
  })
  
  let created_event;
  
  it('should create event', done => {
    let event_params = {
      project: {
        username: "dummy username",
        project_name: "dummy_project",
        _id: new ObjectId()
      },
      event: {
        event_name: "test_event1"
      }
    }
    Event.create_event(event_params).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(typeof(event._id) == typeof(new ObjectId()), true);
      assert.equal(event.event_name, event_params.event.event_name);
      created_event = event;
      done();
    }).catch(err => done(err));
  })
  
  it('should create event but return an error', done => {
    let event_params = {
      project: {
        project_name: "dummy_project",
        _id: new ObjectId()
      },
      event: {
        event_name: "test_event1"
      }
    }
    
    Event.create_event(event_params).then(res => {
      const {success, err} = res;
      assert.equal(success, false);
      console.log(err);
      done();
    }).catch(err => done(err));
  })
  
  it('should create event but return an error', done => {
    let event_params = {
      project: {
        username: "dummy username",
        project_name: "dummy_project",
        _id: new ObjectId()
      },
      event: {
        event_id: "test_event1"
      }
    }
    
    Event.create_event(event_params).then(res => {
      const {success, err} = res;
      assert.equal(success, false);
      console.log(err);
      done();
    }).catch(err => done(err));
  })
  
  it('should retrieve event object', done =>{
    Event.get_event_obj({
      event:{
        _id: created_event._id
      }
    }).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(event._id.toString(), created_event._id.toString())
      created_event = event;
      done();
    }).catch(err => done(err));
  })
  
  it('should add a push notif message to an event', done => {
    done();
  })
})
