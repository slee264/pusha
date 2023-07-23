import { send } from '../firebase/firebase.js';

const JobHandlers = {
  sendMessage: async (job, done) => {
    const { data } = job.attrs;
    const message = {
      data: {
        "title": data.title,
        "body": data.body
      },
      token: data.device_token
    }
    send(message);
    console.log("message sent")
    done();
  }
}

export { JobHandlers }