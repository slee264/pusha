import { User } from '../database/models/userModel.js';

import assert from 'assert';
import mongoose from 'mongoose';

describe('User', function() {
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
  
  it('should retrieve created user, including her password', (done) => {
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

describe('User-Project', function() {
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

  let created_user;
  
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
})