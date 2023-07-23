const schedule = {
  sendMessage: async (agenda, data) => {
    const { title, body, device_token, time } = data;
    console.log("scheduling sendMessage");
    await agenda.schedule(time, "sendPushNotification", {title, body, device_token})
  }
}

export { schedule }