How to:

In JASON format,
### {
  ### Whether you want your job to be repeated
  * If repeat !== "true", this will be ignored and default to "false".
  "repeat": ["true"/"false"] 
  
  ### The interval at which you want your job to be repeated
  * If repeat === "true", write your interval in minute/hour/day/week/month/year
  * if repeat !== "true", this will be ignored.
  * Only the first integer encountered that's before a space character in {repeatInterval} will be counted.
  * Likewise for the interval.
  * ex) "1 2 day" will be interpreted as "1 day" and not "12 day"
  
  "repeatInterval": ["1 day"/"2 days"/"3 days"/"1 minute"/"2 minutes"/...]
  
  ### The time at which you want your job to be executed in Javascript Date() format.
  * Your time will be converted into UTC, so just write your local time.
  * If your time is BEFORE the time at which you post your job, it will NOT be executed.
  * I recommend posting your job at least 5 minute before the time you want your job first executed.
  "time": "2023-07-25T11:12:00.000Z"
  
  Hour is in military time (0 - 23)
  Minute (0 - 59)
  Second will be ignored. (Every job is executed at hh:mm:00.)
  
  ### Your message(push notification title and body)
  
  * This will shortly be improved upon in its detail
  
  "message": {"title": "test title", "body": "test body"}
  
  ### A device token you want your push notification to be sent to
  "device_token": "asd1ol2h4nk12j4n..."

### }
  POST to https://fbtest-uocfw.run.goorm.site/
  
  * A wrong device token will not result in throwing an error.
  * However, a wrong date format, wrong repeat/repeatInterval, and etc. will generate an HTML response with error information.
  * Keep your response._id(your job ID) for future uses.