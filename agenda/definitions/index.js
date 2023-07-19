import { testsDefinitions } from './tests.js';

const definitions = [testsDefinitions];

const allDefinitions = (agenda) => {
  console.log("agenda/index.js")
  definitions.forEach((definition) => definition(agenda))
}

export { allDefinitions }