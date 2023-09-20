import moment from 'moment-timezone';
import { agenda } from './agenda.js';

const schedule = {
  sendMessage: async (data) => {
    let result = {success: false}
    try {
      const job = agenda.create('sendPushNotification');
      if (data.repeat){
        if(data.repeatEvery){
          job.repeatEvery(data.repeatEvery)
        }
        if(data.repeatAt){
          job.repeatAt(data.repeatAt)
        }
      }
      job.attrs.data = {message: data.message, device_token: data.device_token}
      job.schedule(data.runAt)
      console.log("Saving job to collection ...");
      const saved = await job.save();
      console.log('Successfully saved job to collection: \n');
      result._id = saved.attrs._id;
      result.job = job;
      result.success = true;
    }catch (e) {
      console.error('Error saving job to collection:', e);
      result.error = e.message;
    }
    
    return result;
  }
}

export { schedule }