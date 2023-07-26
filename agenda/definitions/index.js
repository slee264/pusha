import { messageDefinitions } from './message.js';

const definitions = [messageDefinitions];

const allDefinitions = (agenda) => {
  console.log("Collecting definitions ...");
  definitions.forEach((definition) => definition(agenda))
  console.log("Definitions collected.")
}

export { allDefinitions }