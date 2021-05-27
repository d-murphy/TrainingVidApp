# Must Do List

* show courses complete on profile page (with date!?)
* log text is stretching panel on homepage
* css for admin pages and Profile page
* add scroll bar to divs in edit course.  

* Add a unit test
* check if twice completed lessons creates an issue
* creating an api for a reporting suite?  user report?
* background job?

# May Do
* add password for admin access
* add email password reset
* drag and drop prevent courses you created from being dropped in courses others created
* add text indexing to descriptions?
* add full text search to 1. lesson selection in course edit 2. lesson/course catalog
* css for mobile


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
* create course and edit course should appear the same though app logic is different
* add logic to change image and delete old
* Create a second lesson view to navigate to next lesson within course
* css for homepage
* home page, adjust other courses to not show enrolled and latest lessons
* On course page, alternate enroll in course / start the course.  
* use complete course button, but javascript to only display after video is finished
* fade out flash and relocate
* css for lesson / course pages
* record course completions and move completed from enrolled list



Roadblocks encountered / Lessons Learned: 
* db.session.add(lesson) was erroring while sending a user object rather than Id
* Messed with query / joins for too long when data was available columns in main tables (so far at least)
* struggled to find correct way to wrap @admin function
* surprised to learn image calls should be requested via a route and not just reference the file location
* use of continue in for loop to prevent extra layer of nesting from (Josh)
* use uuid4 to create unique IDs for the image (from Josh); decided not to labels images with course id which would require two db.session.commits
* spent a lot of time trying to connect lessons within a course.  My initial solution might have been failing because I wasn't returning my redirect.  Final outcome is cleaner though.  





Videos pulled from: 
* https://www.pexels.com/search/videos/classroom/


