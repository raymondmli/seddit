# seddit
A subset of the ever popular collection of web forums known as Reddit for COMP2041

Features:

**Login**

The site presents a login form where a user can present their credentials. Also tells users they failed to login.

**Registration**

<button data-id-signup>Sign Up</button>

An option to register.

**Feed Interface** 

Each post includes:
1. who the post was made by 
2. when it was posted
3. The image itself, if there is one present
4. How many upvotes it has (or none) 
5. The post title 
6. The post description text
7. How many comments the post has
8. What suseddit this was posted to i,e `/s/meme`

While completing these tasks for level 0, consider the future inclusion of HTTP requests when 
designing your code - this will be helpful for future levels.

## API Fetching 

**Login**
The login form now communicates with the backend (`POST /login`) after input validation to verify 
whether the provided credentials are valid for an existing user. Once the user has logged in, they 
should see their own news feed (the home page).

NB. This is slightly different to what they will see as a
non-logged in user. A non-logged in user should still see posts from `GET /post/public`.

**Registration**
The option to register for "Seddit" should now accept a set of 
credentials (a username / password pair). This user information is then POSTed to the backend to 
create the user in the database (`POST /signup`). 

**Feed Interface**
The content shown in the user's feed is sourced from the backend (`GET /user/feed`). Contrary to 
the existing popular system which "Seddit" is based off, there is only one location where all posts 
are to appear at this level of functionality. 

## Slightly better UX 

**Show Upvotes**
Allow an option for a logged in user to see a list of all users who have upvoted a post.

**Show Comments**
Allow an option for a logged in user to see all the comments on a post. Same as above.

**Upvote user generated content**
A logged in user can upvote a post on their feed and trigger a api request (`PUT /post/vote`)
In addition the user can also retract their upvote, you can do this via `DELETE /post/vote`

**Post new content**
Logged in users can upload and post new content from a [modal](https://www.webopedia.com/TERM/M/modal_window.html) or seperate page via (`POST /post`). The uploaded content can either be text or text and an image.


**Profile**
Logged in users can see their own profile information such as username, number of posts, 
number of upvotes across all posts. Get this information from (`GET /user`)

## Slightly more rigorous stuff

**Infinite Scroll**
Instead of pagination, users an infinitely scroll through the "subseddit" they are viewing. 
For infinite scroll to be properly implemented you need to progressively load posts as you scroll. 

**Comments**
Logged in users can write comments on "posts" via (`PUT /post/comment`)

**Live Update**
If a logged in user upvotes a post or comments on a post, the posts upvotes and comments should
update without requiring a page reload/refresh.

**Update Profile**
Users can update their personal profile via (`PUT /user`) E.g:
* Update email address
* Update password
* etc.

**User Pages**
Let a logged in user click on a user's name/picture from a post and see a page with the users name and other info.
The user should also see on this page all posts made by that person across all "subseddits".
The user should be able to see their own page as well.

**Follow**
Let a logged in user follow/unfollow another user too add/remove their posts to their feed via (`PUT user/follow`)
Add a list of everyone a user follows in their profile page.
Add just the count of followers / follows to everyones public user page

