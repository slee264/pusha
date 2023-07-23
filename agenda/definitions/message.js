import { JobHandlers } from '../handlers.js';

const messageDefinitions = (agenda) => {
  console.log("agenda/definitions/message.js")
  agenda.define("sendPushNotification", {shouldSaveResult: true}, JobHandlers.sendMessage);
}

export { messageDefinitions }