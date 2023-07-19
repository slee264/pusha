import { JobHandlers } from '../handlers.js';

const testsDefinitions = (agenda) => {
  console.log("agenda/definitions/tests.js")
  agenda.define("log hello world", JobHandlers.logHelloWorld);
}

export { testsDefinitions }