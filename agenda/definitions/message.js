import { JobHandlers } from '../handlers.js';

const messageDefinitions = (agenda) => {
  console.log("Defining Message...")
  agenda.define("sendPushNotification", {shouldSaveResult: true}, JobHandlers.sendMessage);
  console.log("Message defined.")
}

export { messageDefinitions }