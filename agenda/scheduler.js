import moment from 'moment-timezone';

const schedule = {
  sendMessage: async (agenda, data) => {
    
    const { message, device_token, schedule } = data;
    console.log("Saving job to collection ...");
    
    const job = agenda.create('sendPushNotification');
    const job_time = schedule.time.getHours() + ":" + schedule.time.getMinutes();
    const job_date = schedule.time.getFullYear() + "-" + (schedule.time.getMonth()+1) + "-" + schedule.time.getDate();
    switch(schedule.repeat){
      case "true":

        job.repeatEvery(schedule.repeatInterval);
        job.repeatAt("at " + job_time)
        job.schedule("at " + job_time)

        job.attrs.startDate = job_date;
        break;
        
      default:
        job.schedule(schedule.time)
        break;
    }
    job.attrs.data = {message, device_token};
    job.attrs.repeatTimezone = "Etc/UTC";

    try {
      const result = await job.save();
      console.log('Successfully saved job to collection: \n');
      return { attrs: result.attrs };
    } catch (e) {
      console.error('Error saving job to collection:', e);
      return e;
    }

  }
}

export { schedule }