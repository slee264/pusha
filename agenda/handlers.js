const JobHandlers = {
  logHelloWorld: async (job, done) => {
    console.log("logHelloWorld started!")
    const data = job.attrs;
    console.log("Hello World!")
    done();
  }
}

export { JobHandlers }