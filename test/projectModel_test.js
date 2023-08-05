import { Project } from '../database/models/projectModel.js';

import assert from 'assert';
import mongoose from 'mongoose';


describe('Project', function() {
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