import { User } from '../database/models/userModel.js';

import assert from 'assert';
import mongoose from 'mongoose';

describe.skip('User', function() {
  before(function(done){
    mongoose.connection.collections.user.drop(() => done())
  })
  
  const user_params = {
      "username": "123",
      "password": "123",
      "profile": {
        "name": "Joey"
      }
    }
  
  const faulty_user_params1 = {
    "username": "123",
    "password": "123",
  }
  
  const faulty_user_params2 = {
    "password": "123",
    "profile": {
      
    }
  }
  
  const faulty_user_params3 = {
    "username": "1234",
    "password": "123",
  }
  
  let created_user;
  it('should return invalid input', (done) => {
    User.create_user(faulty_user_params1).then(res => {
      const {success, user, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("Invalid"), true);
      assert.equal(user, undefined);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should return invalid input', (done) => {
    User.create_user(faulty_user_params2).then(res => {
      const {success, user, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("Invalid"), true);
      assert.equal(user, undefined);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should create a user', (done) => {
    User.create_user(user_params).then(res => {
      const {success, user} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, undefined);
      assert.equal(user.profile.name, user_params.profile.name);
      created_user = user;
      done();
    }).
    catch(err => done(err));
  })
  
  it('should return already exists', (done) => {
    User.create_user(user_params).then(res => {
      const {success, err, user} = res;
      assert.equal(success, false);
      assert.equal(err.includes("already exists"), true);
      assert.equal(user, undefined);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve created user object, including her password', (done) => {
    User.get_user_obj(user_params).then(res => {
      const {user, success} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, user_params.password);
      assert.equal(user.profile.name, user_params.profile.name);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve Invalid input for faulty params', done => {
    User.get_user_obj(faulty_user_params2).then(res => {
      const {success, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("Invalid"), true);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve doesn\'t exist for faulty params', done => {
    User.get_user_obj(faulty_user_params3).then(res => {
      const {success, err} = res;
      assert.equal(success, false);
      assert.equal(err.includes("doesn't exist"), true);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve created user, excluding her password', (done) => {
    User.get_user(user_params).then(res => {
      const {user, success} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, undefined);
      assert.equal(user.profile.name, user_params.profile.name);
      done();
    }).
    catch(err => done(err));
  })
})


describe.skip('User-Project', function() {
  before(function(done){
    mongoose.connection.collections.user.drop(() => {
      mongoose.connection.collections.projects.drop(() => done())
    })
  })
  
  const user_params = {
    "username": "123",
    "password": "123",
    "profile": {
      "name": "Joey"
    }
  }
  
  const f_project_params = {
    "project": "test_pro"
  }
  
  const project_params = {
    "project_name": "test project 1",
  }
  
  const project_params2 = {
    "project_name": "test project 2",
  }

  let created_user;
  
  it('should create user', (done) => {
    User.create_user(user_params).then(res => {
      const {success, user} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, undefined);
      assert.equal(user.profile.name, user_params.profile.name);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve created user, including her password', (done) => {
    User.get_user_obj(user_params).then(res => {
      const {user, success} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, user_params.password);
      assert.equal(user.profile.name, user_params.profile.name);
      created_user = user;
      done();
    }).
    catch(err => done(err));
  })
  
  it('should not create project and return invalid input', done => {
    created_user.add_project(f_project_params).then(res => {
      const {success, project, err} = res;
      assert.equal(success, false);
      assert.equal(project, undefined);
      assert.equal(err.includes("Invalid"), true);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should create project1', done => {
    created_user.add_project(project_params).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project.project_name, project_params.project_name);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should create project2', done => {
    created_user.add_project(project_params2).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project.project_name, project_params2.project_name);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve created user, including her password', (done) => {
    User.get_user_obj(user_params).then(res => {
      const {user, success} = res;
      assert.equal(success, true);
      assert.equal(user.username, user_params.username);
      assert.equal(user.password, user_params.password);
      assert.equal(user.profile.name, user_params.profile.name);
      created_user = user;
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve all projects', done => {
    assert.equal(created_user.projects[0].project_name, project_params.project_name);
    assert.equal(created_user.projects[1].project_name, project_params2.project_name);
    done();
  })
  
  it('should retrieve project obj', done => {
    created_user.get_all_project_objs().then(res => {
      const {success, projects} = res;
      assert.equal(success, true);
      assert.equal(projects[0].project_name, project_params.project_name);
      assert.equal(projects[1].project_name, project_params2.project_name);
      done();
    }).
    catch(err => done(err));
  })
  
  it('should retrieve project obj with id', done => {
    created_user.get_project_obj({
      _id: created_user.projects[0]._id.toString()
    }).then(res => {
      const {success, project} = res;
      assert.equal(success, true);
      assert.equal(project.project_name, project_params.project_name)
      done();
    }).
    catch(err => done(err));
  })
  
  it.skip('should delete project', done => {
    // ***
  })
})