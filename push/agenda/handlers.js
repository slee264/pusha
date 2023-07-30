import { send } from '../firebase/firebase.js';

const JobHandlers = {
  sendMessage: async (job, done) => {
    console.log("sending message")
    
    const { data } = job.attrs;
    
    const message = {
      data: {
        "title": data.title,
        "body": data.body
      },
      token: data.device_token
    }
    
    send(message);
    
    done();
  }
}

export { JobHandlers }