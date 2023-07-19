import { agenda } from './agenda.js';

const schedule = {
  logHelloWorld: async (data) => {
    console.log("scheduling helloWorld");
    await agenda.every("1 minute", "log hello world")
  }
}

export { schedule }