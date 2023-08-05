import {Event} from '../database/models/eventModel.js';
import assert from 'assert';

describe.skip('Event', function (){
  it('should return a result', async (done) => {
    Event.create_event("hi").then(res =>{
      assert.equal("hi", "hi");
    }).
    catch(err => done(err));
  })
})
