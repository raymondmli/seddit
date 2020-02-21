import * as helper from './helper.js';
import * as posts from './fetchPosts.js';

const ARBITRARY_SCROLL_HEIGHT_DIFF = 10; 
const POSTS_TO_ADD = 1;
/* 
Function that checks whether we're at the bottom of the page upon scroll 
And then if at bottom, appends feed with the next post. 
*/
function checkScroll() {
    const root = document.querySelector('#root'); 
    const rootOffset = root.offsetTop + root.clientHeight; 
    var pageOffset = window.pageYOffset + window.innerHeight; 
    //if current offset of page spills over the root dimensions, append feed with the next 1 post
    if (pageOffset > rootOffset - ARBITRARY_SCROLL_HEIGHT_DIFF) {
        var postsDisplayed = sessionStorage.getItem('postsDisplayed');
        //store count of posts displayed
        sessionStorage.setItem('postsDisplayed', parseInt(postsDisplayed) + POSTS_TO_ADD);
        posts.appendPosts(parseInt(postsDisplayed), POSTS_TO_ADD);
    }
}

export {checkScroll as checkScroll};