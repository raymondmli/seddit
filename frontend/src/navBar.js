import buildLoginForm from './login.js';
import buildSignupForm from './signup.js';
import * as fetchPosts from './fetchPosts.js';
import * as helper from './helper.js';
import * as userInfo from './userInfo.js';

//builds navigation bar and attaches event listeners to each of its buttons 
function navBar () {
    //find the root to add all children
    const root = document.querySelector('#root');
    
    //create header for navigation bar 
    const header = helper.createEleTextless('header', 'banner')
    header.id = 'nav';

    //create logo 
    const logo = helper.createEle('h1', 'Reddit', 'flex-center')
    logo.id = 'logo';

    //create list of login button + search bar + sign up button 
    const ul = document.createElement('ul');
    ul.classList.add('nav', 'centre-align');

    //create and append search bar 
    const navItem1 = helper.createEleTextless('li', 'nav-item');
    const searchBar = helper.createElePlaceholder('input', 'Search Reddit','searchBar');
    searchBar.id = "search";
    searchBar.type = "search";
    searchBar.setAttribute('data-id-search', '');
    navItem1.appendChild(searchBar);
    ul.appendChild(navItem1);

    //create and append login button div + button 
    const navItem2 = document.createElement('li');
    const loginButton = helper.createEle('button', 'Log In', 'button', 'button-primary');
    navItem2.classList.add("nav-item");
    loginButton.setAttribute('data-id-login','');
    navItem2.appendChild(loginButton);
    ul.appendChild(navItem2);

    //create signup button div + button and appends them
    const navItem3 = document.createElement('li');
    navItem2.classList.add('nav-item');
    const signupButton = helper.createEle('button', 'Sign Up', 'button', 'button-primary');
    signupButton.setAttribute('data-id-signup','');
    navItem2.appendChild(signupButton);
    ul.appendChild(navItem3);

    //signout button
    const signoutButton = helper.createEle('button', 'Signout', 
                                            'button', 'button-primary');
    header.appendChild(signoutButton);

    //Details button 
    const userDetButton = helper.createEle('button', 'User Details', 
                                            'button', 'button-primary');
    header.appendChild(userDetButton);
    //create login modal. 
    const login = buildLoginForm();
    //create signup modal.
    const signup = buildSignupForm();
    //build user detail modal.
    const myDetails = userInfo.userModal(); 

    //append children to parents (1st argument)
    helper.appendToParent(header, ul, logo);
    helper.appendToParent(root, header, login, signup, myDetails);

    //make login button, when clicked, pop-up a login modal
    loginButton.addEventListener("click", function() {
        showLogin()
    });

    //make signup button, when clicked, pop-up the signup modal
    signupButton.addEventListener("click", function() {
        signUp();
    });

    //make signout button, actually sign out
    signoutButton.addEventListener("click", function() {
        signout();
    }); 

    userDetButton.addEventListener("click", function() {
        showUserDetails();
    })

}

//Helper function for above.
//If logged in, signs out by clearing local and session storage and loading anon feed
function signout() {
    if (helper.loggedIn()) {
        helper.deleteChildren(document.querySelector('#feed'));
        localStorage.clear();
        window.location.reload();
        fetchPosts.fetchPostsAnon();
    }
    else {
        alert('Not logged in!');
    }
}
//As the name suggests, shows logged in user details, if logged in.
function showUserDetails() {
    const form = document.querySelector("#user-modal");
    if(helper.loggedIn()) {
        userInfo.updateUserMod('self', 0, localStorage.getItem('loginToken'));
        helper.showModal(form);
    }
    else {
        alert('Not logged in!');
    }
}
//Shows login modal. 
function showLogin() {
    const form = document.querySelector("#login-form");
    helper.showModal(form);
}
//Shows sign up modal.
function signUp() {
    const form = document.querySelector("#signup-form");
    helper.showModal(form);
}

export default navBar; 