//this file handles building the login form 
import * as fetchPosts from './fetchPosts.js';
import * as helper from './helper.js';
import API_URL from './backend_url.js';

const postsLoadedAtStart = 10;
const SUCCESS = 200;
const MISSING_PASSWORD = 400;
const INVALID_USERNAME = 403;
//function that builds the login modal is by default not shown 
function buildLoginForm () {
    //build the modal  
    const popDiv = helper.buildModal('login-form', 'modal-content');
    //get the div that will contain all the content 
    const popForm = popDiv.firstChild;

    //create form title 
    const loginTitle = helper.createEle('h1', 'Login', 'centre-align');
    popForm.appendChild(loginTitle);

    //create username input form 
    const usernameForm = helper.createElePlaceholder('input', 'Username', 'form-item');
    popForm.appendChild(usernameForm);

    //create password form  
    const pwForm = helper.createElePlaceholder('input', 'Password', 'form-item');
    pwForm.setAttribute('type', 'password');
    popForm.appendChild(pwForm);

    
    //create submit form 
    const submit = helper.createEle('button', 'Log in', 'button', 'button-secondary')
    popForm.appendChild(submit);

    //submit button that sends login request 
    submit.addEventListener("click", function() {
        //send login request 
        fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameForm.value.trim(), 
                password: pwForm.value
            })
            })
            .then(res => {
                //handle statuses
                if (res.status === MISSING_PASSWORD) {
                    alert("Missing username/password");
                }
                else if (res.status === INVALID_USERNAME) {
                    alert("Invalid username/password");
                } 
                else if (res.status === SUCCESS) {
                    alert("Logged in!");
                }
                return res.json();
            })
            .then(reply => { 
                //if able to log in, set the login key and username. Also store the # of posts displayed in sessionStorage
                if (reply.token !== undefined) {
                    localStorage.setItem('loginToken', `${reply.token}`);
                    localStorage.setItem('username',`${usernameForm.value}`);
                    sessionStorage.setItem('postsDisplayed', postsLoadedAtStart);
                    //delete feed and update it. 
                    helper.deleteChildren(document.querySelector('#feed'));
                    fetchPosts.appendPosts(0,postsLoadedAtStart);
                }
            })
            .catch(error => {
                alert("He's dead Jim (Login failure)");
            });
        });

    return popDiv;
}

export default buildLoginForm;