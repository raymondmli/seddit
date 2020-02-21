//Contains functions that fetch the feed 
import API_URL from './backend_url.js';
import * as postInfo from './postInfo.js';
import * as helper from './helper.js';
import * as voteInfo from './vote.js';
import * as comments from './comments.js';

//global variables 
const REMOVE_UPVOTE = true;
const ADD_UPVOTE = false;
const NO_FEED_HEADER = null;
const NO_IMAGE = null;
const INVALID_AUTH = 403; 
//Creates header and feed divs and appends it to main div
function feedHeader() {
    //create all the divs and stuff 
    const feed = document.querySelector('#feed');
    //create and append feed header div
    var headerText = 'Popular Posts';
    if(helper.loggedIn()) {
        headerText = 'My Feed';
    }
    const feedHeader = helper.createEleTextless('div', 'feed-header');
    feed.appendChild(feedHeader);
    feedHeader.id = 'feed-head';
    //create feedtitle 
    const feedTitle = helper.createEle('h3', `${headerText}`, 'feed-title', 'alt-text');
    feedHeader.appendChild(feedTitle);
    //create post button
    const postButton = helper.createEle('button', 'Post', 'button', 'button-secondary');
    feedHeader.appendChild(postButton);
    //end div
    voteInfo.upvoteModal(); 
    comments.commentModal();
}


//takes in the post json, adds the info to the divs and appends to the feed
function appendPosts(p, n) {
    //find the feed ul
    const feed = document.querySelector('#feed');    

    //------------------GET AND APPEND THE FEED CONTENTS--------------------\\
    //creates post list item for each post in JSON and append to feed if fetch successful
    const token = localStorage.getItem('loginToken');
    const url =`${API_URL}/user/feed?p=${p}&n=${n}`; 
    //check if user is logged in i.e. there's a token stored 
    if(!helper.loggedIn()) {
        fetchPostsAnon();
    }
    //attempt to fetch user feed 
    else {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
            })
            //check status messages 
            .then(res => {
                if (res.status === INVALID_AUTH) {
                    alert("Invalid auth token");
                } 
                return res.json();
            })
            //create each post element, add to them and append post to feed 
            .then(json => { 
                //if there is no feed header, add the feed header 
                if(document.querySelector('#feed-head') === NO_FEED_HEADER) {
                    feedHeader();
                }
                //sort the posts in order of publication 
                json.posts.sort(function(a,b) {
                    return a.meta.published > b.meta.published;
                });
                //for each post in the feed, create an element for it and add all its contents
                //including buttons, title, publication date, author etc. 
                json.posts.forEach(post => {
                    //create post list element
                    const postElement = helper.createEleTextless('li', 'post')
                    feed.appendChild(postElement);

                    //create divs for each post bit 
                    //vote
                    const vote = helper.createEleTextless('div', 'content');
                    postElement.appendChild(vote);

                    //Create content wrapper. Filled with the content of the post ofc. 
                    const content = helper.createEleTextless('div', 'content');
                    postElement.appendChild(content);
                    //Create title node
                    const postTitle = helper.createEle('h3', post.title, 'post', 'alt-text', 'post-title');
                    //Create author node 
                    const time = helper.unixStampConverter(parseInt(post.meta.published));
                    const author = helper.createEle('p', `Posted by ${post.meta.author} on ${time} 
                                                       to s/${post.meta.subseddit}`, 'post-author');
                    //set the bullshit autotest attributes
                    author.setAttribute('data-id-author', '');
                    author.setAttribute('data-id-upvotes', '');
                    author.setAttribute('data-id-title', '');

                    //Create text node
                    const postText = helper.createEle('p', post.text, 'post', 'text');
                    //create image div
                    const image = document.createElement('img');
                    //create image and add image if image is not null
                    if(post.image !== NO_IMAGE) {
                        image.src = `data:image/png;base64,${post.image}`;
                    }
                    //append everything to content div 
                    helper.appendToParent(content,postTitle, postText, image, author);


                    //----------------create buttons and add listeners------------------\\
                    const upListBtn = helper.createEle('btn', 'Show upvote list', 'button-small', 'button');
                    //update upvote list content and display modal on click
                    upListBtn.addEventListener("click", () => {
                        voteInfo.upModalContent(post, localStorage.getItem('loginToken'));
                        helper.showModal(document.querySelector('#upvote-modal'));
                    });
                    //create show comment button
                    const showComBtn = helper.createEle('btn', 'Show comment list', 'button-small', 'button');
                    //update  comment modal content and display it on click 
                    showComBtn.addEventListener("click", () => {
                        comments.commentModContent(post);
                        helper.showModal(document.querySelector('#comment-modal'));
                    });

                    //create upvote button
                    const upvotes = post.meta.upvotes.length;
                    const upvoteButton = helper.createEle('btn', `Upvote (${upvotes})`, 'button-small', 'button');
                    //create remove upvote button
                    const removeUpvoteBtn = helper.createEle('btn', 'Remove upvote', 'button-small', 'button');
                    //make upvote request on click. 
                    upvoteButton.addEventListener("click", () => {
                        postInfo.upvotePost(post, token, ADD_UPVOTE);
                    });
                    //make remove upvote request on click. 
                    removeUpvoteBtn.addEventListener("click", () => {
                        postInfo.upvotePost(post, token, REMOVE_UPVOTE);
                    });
                    //if we are logged in, show all these buttons.
                    if (helper.loggedIn()) {
                        helper.appendToParent(content, upListBtn,showComBtn,upvoteButton,removeUpvoteBtn);
                    }
                });
            })
            .catch(error => {
                alert("He's dead Jim (Issue getting feed)");
            });
    }
}


//Same as above, except with anon feed. Probably a little redundant. 
//fetches posts when there is no token 
function fetchPostsAnon() {
    const feed = document.querySelector('#feed');
    fetch(`${API_URL}/post/public`, {
        method: 'GET',
    })
    //check status messages 
    .then(res => {
        console.log(res.status);
        return res.json();
    })
    //create each post element, add to them and append post to feed 
    .then(json => {
        json.posts.sort(function(a,b) {
            return a.meta.published < b.meta.published;
        }); 
        //upon succesful login, clear feed and append new feed 
        while (feed.firstChild) {
            feed.removeChild(feed.firstChild);
        }    
        feedHeader();
        //add to feed 
        json.posts.forEach(post => {
            //create post list element
            const postElement = helper.createEleTextless('li', 'post')
            feed.appendChild(postElement);

            //create divs for each post bit 
            //vote
            const vote = helper.createEleTextless('div', 'content');
            postElement.appendChild(vote);

            //MINI-DIV: CONTENT. Filled with the content of the post ofc. 
            const content = helper.createEleTextless('div', 'content');
            postElement.appendChild(content);
            //title
            const postTitle = helper.createEle('h3', post.title, 'post', 'alt-text', 'post-title');
            //author
            //Create author node 
            const time = helper.unixStampConverter(parseInt(post.meta.published));
            const author = helper.createEle('p', `Posted by ${post.meta.author} on ${time} 
                                               to s/${post.meta.subseddit}`, 'post-author'); 
            //text 
            const postText = helper.createEle('p', post.text, 'post', 'text');

            const image = document.createElement('img');
            //create image if image is not null
            if(post.image !== NO_IMAGE) {
                image.src = `data:image/jpg;base64,${post.image}`;
            }
            helper.appendToParent(content,postTitle, postText, image, author);
        });
    })
    .catch(error => {
        //alert("He's dead Jim (Issue loading feed)");
    });
}

export { appendPosts as appendPosts,
        feedHeader as feedHeader,
        fetchPostsAnon as fetchPostsAnon};
