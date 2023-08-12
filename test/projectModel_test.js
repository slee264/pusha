import { Project } from '../database/models/projectModel.js';
import { Event } from '../database/models/eventModel.js';

import assert from 'assert';
import mongoose from 'mongoose';


describe.skip('Project', function() {
  let created_project;
  before(function(done){
      mongoose.connection.collections.projects.drop(() => done())
  })
  
  it('should create project', done => {
    Project.create_project({
      user:{
        "username": "123"
      },
      project:{
        "project_name": "test_project"
      }
    }).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project.project_name, "test_project");
      created_project = project;
      done();
    }).catch(err => done(err));
  })
  
  it('should return Invalid', done => {
    Project.create_project({
      user:{
        "username": "123"
      },
      project:{
        "project": "test_project"
      }
    }).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false);
      assert.equal(project, undefined);
      assert.equal(err.includes("Invalid"), true)
      done();
    }).catch(err => done(err));
  })
  
  it('retrieve project with id', done => {
    Project.get_project_by_id({_id: created_project._id}).then(res => {
      const {success, project} = res;
      assert.equal(project._id.toString(), created_project._id.toString());
      assert.equal(project.project_name, created_project.project_name)
      done();
    }).catch(err => done(err));
  })
  
  it('retrieve project with id but returns invalid', done => {
    Project.get_project_by_id({name: "hi"}).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false)
      assert.equal(project, undefined);
      assert.equal(err.includes("Invalid"), true);
      done();
    }).catch(err => done(err));
  })
  
  it('retrieve project with wrong id and returns invalid', done => {
    Project.get_project_by_id({_id: '12345'}).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false)
      assert.equal(project, undefined);
      assert.equal(err.includes("Invalid"), true);
      done();
    }).catch(err => done(err));
  })
  
  it('retrieve project with id but returns not found', done => {
    Project.get_project_by_id({_id: '64ce328d7152828a7c02d6c4'}).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false)
      assert.equal(project, undefined);
      assert.equal(err.includes("not found"), true);
      done();
    }).catch(err => done(err));
  })
  
  it('retrieves project with name', done => {
    Project.get_project_by_name({
      user: {
        "username": "123"
      },
      project: {
        project_name: "test_project"
      }
    }).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project[0].project_name.includes("test_project"), true);
      done();
    }).catch(err => done(err));
  })
  
  it('retrieves project with name and non-existent username', done => {
    Project.get_project_by_name({
      user: {
        "username": "12"
      },
      project: {
        project_name: "test project"
      }
    }).then(res => {
      const {success, project, err} = res;
      assert.equal(success, true);
      assert.equal(project.length, 0);
      done();
    }).catch(err => done(err));
  })
  
  it('retrieves project with name but returns invalid', done => {
    Project.get_project_by_name({
      user: {
        "username": "12"
      },
      project: {
        _id: "test project"
      }
    }).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("Invalid"), true);
      done();
    }).catch(err => done(err));
  })
})

describe.skip('Project-Event', function() {
  let created_project;
  
  before(function(done){
    mongoose.connection.collections.projects.drop(() => {
      mongoose.connection.collections.events.drop(() => done());
    })
  })
  
  it('should create project', done => {
    Project.create_project({
      user:{
        "username": "123"
      },
      project:{
        "project_name": "test_project"
      }
    }).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project.project_name, "test_project");
      created_project = project;
      done();
    }).catch(err => done(err));
  })
  
  it('shoud create event and add to project', done => {
    created_project.add_event({
      event: {
        event_name: "test_event"
      }
    }).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(event.event_name, "test_event");
      done();
    }).catch(err => done(err));
  })
  
  it('should create event but return invalid input', done => {
    created_project.add_event({
      event: {
        event_id: "test_event"
      }
    }).then(res => {
      const {success, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("event_name"), true)
      done();
    }).catch(err => done(err));
  })
  
  it('shoud create a second event and add to project', done => {
    created_project.add_event({
      event: {
        event_name: "test_event 2"
      }
    }).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(event.event_name, "test_event 2");
      done();
    }).catch(err => done(err));
  })
  
  it('should retrieve event obj', done => {
    created_project.get_event({
      event: {
        _id: created_project.events[0]._id
      }
    }).then(res => {
      const {success, event} = res;
      assert.equal(success, true);
      assert.equal(event._id.toString(), created_project.events[0]._id.toString());
      done();
    }).catch(err => done(err));
  })
  
  it('should delete project', done => {
    Project.delete(created_project).then(res => {
      const {success, deleted_project} = res;
      assert.equal(success, true);
      assert.equal(deleted_project._id.toString(), created_project._id.toString());
      done();
    }).catch(err => done(err));
  })
  
  it('checks if all the events under the deleted project are deleted as well', done => {
    Event.get_event_obj({
      event: created_project.events[0]._id
    }).then(res => {
      const {success} = res;
      assert.equal(success, false);
      done();
    }).catch(err => done(err));
  })
  
  it('checks if all the events under the deleted project are deleted as well', done => {
    Event.get_event_obj({
      event: created_project.events[1]._id
    }).then(res => {
      const {success} = res;
      assert.equal(success, false);
      done();
    }).catch(err => done(err));
  })
  
})