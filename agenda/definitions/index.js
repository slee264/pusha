import { messageDefinitions } from './message.js';

const definitions = [messageDefinitions];

const allDefinitions = (agenda) => {
  console.log("agenda/index.js")
  definitions.forEach((definition) => definition(agenda))
}

export { allDefinitions }