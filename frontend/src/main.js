/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import navBar from './navBar.js';
import * as fetchPosts from './fetchPosts.js';
import * as helper from './helper.js';
import * as scroll from './scroll.js';

//global variables 
const postsLoadedAtStart = 10;
const NOT_SHOWN = null;
const SHOWN = true; 
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    //kill root 
    const root = document.querySelector('#root');
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }    
    //pop up the guide modal once and once only.
    if(sessionStorage.getItem('guide') === NOT_SHOWN) {
        helper.guideModal();
        helper.showModal(document.querySelector('#guide-modal'));
        sessionStorage.setItem('guide', SHOWN);
    }

    //build and append navbar to root 
    navBar();
    //create main div where the rest of the content goes 
    const main = document.createElement('main');
    main.id = 'main';
    root.appendChild(main);
    //create feed div. Where the feed goes.
    const feed = document.createElement('ul'); 
    feed.id = 'feed';
    main.appendChild(feed);
    
    //at the start, load 10 posts or anonymously if not logged in 
    fetchPosts.appendPosts(0,postsLoadedAtStart);
    //add event listener that allows clicking outside modal to close window
    helper.removeModalListener();

    // Setup a timer for the code immediately below
    var timeout;
    // Listen for scroll events. Debounces events so they don't fire 3413423 times 
    // Debouncer inspired by Chris Ferdinandi @ https://gomakethings.com/debouncing-your-javascript-events/
    window.addEventListener('scroll', () => {
        if(helper.loggedIn()) {
            // If there's a timer, cancel it
            if (timeout) {
                window.cancelAnimationFrame(timeout);
            }
            // Setup the new requestAnimationFrame()
            timeout = window.requestAnimationFrame(function () {
                scroll.checkScroll();
            });
        }
    }, false);

    //sets # of posts loaded at start for logged in users. Helps infinite scrolling.
    window.onload = function() {
        sessionStorage.setItem('postsDisplayed', postsLoadedAtStart);
    };
};

export default initApp;
