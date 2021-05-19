# Must Do List

* create admin section as its own template, then include in user page
* create admin route
* create edit course page
* update home and user pages 
* allow adding of videos to course
* does deleting course cascade to videos?
* check if twice completed lessons creates an issue

* Add a unit test
* Add video (file upload)
* Add video images (file upload)
* show your courses lessons on your profile page (imagine this will require data return changes)

# May Do
* drag and drop for adding videos
* add password for admin access
* add email password reset
* add new lessons to the homepage
* show which courses lessons are in on the homepage? 
* Play it again option?
* add text indexing to descriptions?


Completed: 
* Complete login page
* Define objects for database (users, courses, videos)
* Link tables as approapriate
* Created a lesson page to record completions
* Add a lesson
* lock down add a lesson with function decorator
* delete lessons, users
* add, view, delete a course 


Roadblocks encountered: 
* db.session.add(lesson) was erroring while sending a user object rather than Id
* Messed with query / joins for too long when data was available columns in main tables (so far at least)
* struggled to find correct way to wrap @admin function
