# Must Do List

* create edit course page
* allow adding of videos to course
* pagination on options?
* does deleting course cascade to videos?
* check if twice completed lessons creates an issue

* improve file organization
* Add a unit test
* background job?
* update home and user pages 
* add full text search to 1. lesson selection in course edit 2. lesson/course catalog

# May Do
* drag and drop for adding videos
* add password for admin access
* prevent overwriting files with identical file names
* add email password reset
* add new lessons to the homepage
* show which courses lessons are in on the homepage? 
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


Roadblocks encountered / Lessons Learned: 
* db.session.add(lesson) was erroring while sending a user object rather than Id
* Messed with query / joins for too long when data was available columns in main tables (so far at least)
* struggled to find correct way to wrap @admin function
* surprised to learn image calls should be requested via a route and not just reference the file location

Videos pulled from: 
* https://www.pexels.com/search/videos/classroom/


