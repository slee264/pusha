How to:

In JSON format,
### {
  ### Whether you want your job to be repeated
  * If repeat !== "true", this will be ignored and default to "false".
  "repeat": "true"/"false"
  
  ### The interval at which you want your job to be repeated
  * If repeat === "true", write your interval in minute/hour/day/week/month/year
  * if repeat !== "true", this will be ignored.
  * Only the first integer encountered that's before a space character in {repeatInterval} will be counted.
  * Likewise for the interval.
  * ex) "1 2 day" will be interpreted as "1 day" and not "12 day"
  
  "repeatInterval": ["1 day"/"2 days"/"3 days"/"1 minute"/"2 minutes"/...]
  
  ### The time at which you want your job to be executed in Javascript Date() format.
  * Your job will be executed at the time you provide in the timezone you provide.
  * The complete list of timezones can be found in "https://fbtest-uocfw.run.goorm.site/timezones".
  * (You can try searching for your city. ex) "https://fbtest-uocfw.run.goorm.site/timezones/chicago")
  * (Try searching for your city first. If you don't get any result, try your region. Do not try your country. e.g. "Chicago", "America", "Africa", "Atlantic" ...)
  * If your time is BEFORE the time at which you post your job, it will NOT be executed.
  * I recommend posting your job at least 5 minute before the time you want your job first executed.
  * Seconds will be ignored. (Every job is executed at hh:mm:00.)
  
  "timezone": Your timezone (e.g. "America/New_York", "Asia/Bangkok", ...)\
  "date": In String format (e.g. "2023-07-25", "2024-02-20", ...)\
  "hour": In military time ("0" - "23")\
  "minute": ("0" - "59")\

  
  Ex) {"repeat": "true", "repeatInterval": "5 minutes", "timezone": "America/New York", date": "2022-07-25", "hour": "12", "minute": "34", ...}
  Will be first executed On July 25th, 2022 at 12:13 in ET and repeated every 5 minute from then on.
  
  ### Your message(push notification title and body)
  
  * This will shortly be improved upon in its detail
  
  "message": {"title": "test title", "body": "test body"}
  
  ### A device token you want your push notification to be sent to
  "device_token": "asd1ol2h4nk12j4n..."

### }
  POST to https://fbtest-uocfw.run.goorm.site/ with body including the above data.
  
  * A wrong device token will not result in throwing an error.
  * However, a wrong date format, wrong repeat/repeatInterval, and etc. will generate an HTML response with error information.
  * Keep your response._id(your job ID) for future uses.
