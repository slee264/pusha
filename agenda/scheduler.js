import { agenda } from './agenda.js';

const schedule = {
  sendMessage: async (data) => {
    console.log("scheduling sendMessage");
    await agenda.every("1 minute", "sendPushNotification", data)
  }
}

export { schedule }