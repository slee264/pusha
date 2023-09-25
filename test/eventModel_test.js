import { Event } from '../database/models/eventModel.js';
import { setup_agenda } from '../push/agenda/agenda.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import assert from 'assert';

describe('Event', async function (){
  
  before(function(done){
    mongoose.connection.collections.events.drop(() => done());
  })
  
  let created_event;
  let created_message;
  let env = process.env["NODE_ENV"];
  await setup_agenda(env);
  
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
    created_event.create_message({
      message: {
        title: "test title",
        body: "test body"
      }
    }).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(event.push_notif_message.message.title, "test title")
      assert.equal(event.push_notif_message.message.body, "test body")
      done();
    }).catch(err => done(err));
  })
  
  it('should add a push notif message but should return error', done => {
    created_event.create_message({
      message: {
        body: "test body"
      }
    }).then(res => {
      const {success, event, err} = res;
      assert.equal(success, false);
      assert.equal(event, undefined);
      assert.equal(err.includes("title"), true)
      done();
    }).catch(err => done(err));
  })

  it('should set schedule for the event\'s push_notif_message that repeats', done => {
    created_event.set_message_schedule({
        "runAt": "tomorrow at 6pm",
        "repeat": true,
        "repeatEvery": "5 minutes",
        "repeatAt": "11:36PM",
        "device_token": "e1HdqEmXjFxywCA79C5zQ2:APA91bHMJl52G0v9Qy8peINPRQrjySiISgH8oae83ElqJ0GD5XU1zRnxqBYIN6_8bKJW7UZi_vNirPc6DmIF5UwaeNhjGvX2k5Esmxc77y_fin1tmiaHlN4u-8z74rCX1Rdh1kz2hAMq"
    }).then(res => {
      const { success, event } = res;
      assert.equal(success, true)
      // assert.equal(event.push_notif_message.schedule.repeat, true);
      done();
    }).catch(err => done(err));
  })
  
  it.skip('should set schedule for the event\'s push_notif_message that does not repeat', done => {
    created_event.set_message_schedule({
      timezone: "America/New_York",
      startDate: "2023-08-11",
      hour: "23",
      minute: "14",
      repeat: "false",
      repeatInterval: "5 minutes",
      device_token: ["dqdsIORYBynOXknmZUQumD:APA91bE8zKu7QRSNPq3WdqFDraUDfwo9YSmmHTphAI2bDFV0I1OPaIbrT8CWQ7HzbLaXvcave7ajR1dhiYyaJIDyE3vK0eYwpC-53VjD0vamJM5ac9U5Krgyp-KIef7Lstf0qeqRH7aV"]
    }).then(res => {
      const { success, event } = res;
      assert.equal(success, true)
      assert.equal(event.push_notif_message.schedule.repeat, false);
      done();
    }).catch(err => done(err));
  })
  
  it.skip('should delete push notif messages of the event', done => {
    created_event.delete_push_notif().then(res => {
      const {success} = res;
      assert.equal(success, true)
      done();
    }).catch(err => done(err));
  })
})
