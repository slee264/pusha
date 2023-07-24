import moment from 'moment-timezone';

const schedule = {
  sendMessage: async (agenda, data) => {
    const { title, body, device_token, schedule } = data;
    console.log("scheduling sendMessage:", schedule);
    const job = agenda.create('sendPushNotification');
    const options = {
      timezone: "Etc/UTC",
      skipImmediate: true
    }
    job.repeatEvery("1 " + schedule.repeatInterval, options);
    job.repeatAt("at " + schedule.time.getHours() + ":" + schedule.time.getMinutes())
    job.schedule("at " + schedule.time.getHours() + ":" + schedule.time.getMinutes())
    console.log(job)
    // job.repeatAt(schedule.time)
    // switch(schedule.repeat) {
    //   case "true":
    //     const options = {
    //       startDate: schedule.time,
    //       timezone: 'Etc/UTC',
    //       skipImmediate: true
    //     }
    //     await agenda.every("1 " + schedule.repeatInterval, "sendPushNotification", {title, body, device_token}, options)
    //     break;
    //   case "false":
    //     await agenda.schedule(schedule.time, "sendPushNotification", {title, body, device_token})
    //     break;
    // }
  }
}

export { schedule }