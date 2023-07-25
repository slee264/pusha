How to:

In JASON format,
### {
  ### Whether you want your job to be repeated
  "repeat": ["true"/"false"] 
  
  ### The interval at which you want your job to be repeated
  If repeat === "true", write your interval in minute/hour/day/week/month/year\
  if repeat !== "true", this will be ignored\
  This will default to "false"\
  
  "repeatInterval": ["1 day"/"2 days"/"3 days"/"1 minute"/"2 minutes"/...]
  
  ### The time at which you want your job to be executed in Javascript Date() format.
  Your time will be converted into UTC, so just write your local time.\
  
  "time": "2023-07-25T11:12:13.000Z"
  
  ### Your push notification title and body
  
  This will shortly be improved upon in its detail\
  "title": "test title"
  "body": "test body"
  
  ### A device token you want your push notification to be sent to
  "device_token": "asd1ol2h4nk12j4n..."\

### }
  * A wrong device token will not result in throwing an error.
  * However, a wrong date format, wrong repeat/repeatInterval, and etc. will generate an HTML response with error information.
  * Keep your response._id(your job ID) for future uses.