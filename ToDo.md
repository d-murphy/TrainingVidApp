# Must Do List

* create edit course page with lesson order control (add a hidden form element to capture course order and have javascript write to it, then use to save lesson order)
* pagination on options?
* use complete course button, but javascript to only display after video is finished
* pause every 10 seconds?
* use next? within url of videos during a course
* if view video outside of course, return to homepage.  
* search lessons and videos?  Maybe a second server request within the page

* does deleting course cascade to videos?  add to test?
* check if twice completed lessons creates an issue
* creating a report suite?  user report?

* improve file organization
* Add a unit test
* background job?
* update home and user pages 
* add full text search to 1. lesson selection in course edit 2. lesson/course catalog

# May Do
* add password for admin access
* add email password reset
* add new lessons to the homepage
* Play it again option?
* add text indexing to descriptions?
* create admin route


Completed: 
* Complete login page
* Define objects for database (users, courses, videos)
* Link tables as approapriate
* Created a lesson page to record completions
* Add a lesson
* lock down add a lesson with function decorator
* delete lessons, users
* add, view, delete a course 
* Add video (file upload)
* Add video images (file upload)
* tried to save user before saving file to grab course ID, but it doesn't work this way.  Instead used uuid
* figure out lessons not completed and lessons created by user ( with Josh )



Roadblocks encountered / Lessons Learned: 
* db.session.add(lesson) was erroring while sending a user object rather than Id
* Messed with query / joins for too long when data was available columns in main tables (so far at least)
* struggled to find correct way to wrap @admin function
* surprised to learn image calls should be requested via a route and not just reference the file location
* use of continue in for loop to prevent extra layer of nesting from (Josh)
* use uuid4 to create unique IDs for the image (from Josh); decided not to labels images with course id which would require two db.session.commits



Videos pulled from: 
* https://www.pexels.com/search/videos/classroom/


