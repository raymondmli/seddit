import API_URL from './backend_url.js';
import * as helper from './helper.js';

const SUCCESS = 200;
const MALFORMED_REQUEST = 400;
const TAKEN_USERNAME = 409;
//Function builds the signup modal 
function buildSignupForm () {
    //build modal wrapper div and modal content div
    const modal = helper.buildModal('signup-form','signup-content');
    //get the modal content div (which will be what we append content to)
    const popForm = modal.firstChild;
    //title of form 
    const signupTitle = helper.createEle('h1', 'Signup', 'centre-align');
    popForm.appendChild(signupTitle);

    //------------create input fields-----------------\\
    const fieldDiv = helper.createEleTextless('div', 'form-item');
    popForm.appendChild(fieldDiv);
    //user field
    const usernameForm = helper.createElePlaceholder('input', 
                            'Username. 0-9a-zA-Z_- are valid', 'form-item');

    fieldDiv.appendChild(usernameForm);

    //password: Sets password minimum length. 
    const pwForm = helper.createElePlaceholder('input', 'Password (8 char. min. No spaces)', 'form-item');
    pwForm.setAttribute('type', 'password');
    pwForm.setAttribute('minlength', '8');
    fieldDiv.appendChild(pwForm);
    //event handler for form. Provides live feedback for validity 
    pwForm.addEventListener('input', () => {
        invalidHandler(pwForm, checkPW);
    });
    
    //email field
    const emailForm = helper.createElePlaceholder('input', 'Email in the form <emailname>@<whateverserver>.com'
                                                    , 'form-item');
    fieldDiv.appendChild(emailForm);
     //event handler for form. Provides live feedback for validity 
     emailForm.addEventListener('input', () => {
        invalidHandler(emailForm, checkEmail);
    });
    
    //name field
    const realName = helper.createElePlaceholder('input', 'Real name (alphanumeric chars only)', 'form-item');
    //event handler for form. Provides live feedback for validity 
    realName.addEventListener('input', () => {
        invalidHandler(realName, checkUsername);
    }); 
    fieldDiv.appendChild(realName);

    //-------------create buttons----------------------\\

    const submit = document.createElement('button');
    submit.classList.add('button', 'button-secondary');
    submit.innerText = 'Submit';
    popForm.appendChild(submit);


    //-------------add button event listeners----------------\\
    //submit button that sends signup request 
    submit.addEventListener("click", function() {
        //if valid inputs, sends signup request 
        if(!checkInputFields(usernameForm.value, emailForm.value.trim(), realName.value) === true) {
            console.log('invalid signup entries');
        }
        else {
             //send signup request.  
            fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    //trim username to avoid trailing and leading whitespace
                    username: usernameForm.value.trim(), 
                    password: pwForm.value,
                    email: emailForm.value,
                    name: realName.value
                })
                })
                //catch error statuses and alert user 
                .then(res => {
                    if (res.status === TAKEN_USERNAME) {
                        alert("Username taken");
                    } 
                    else if (res.status === MALFORMED_REQUEST) {
                        alert("Malformed request");
                    }
                    else if (res.status === SUCCESS) {
                        alert("Success! You can now log in with your username and password!");
                    }
                    return res.json();
                })
                .then(reply => { 
                    //set the signup token item to signup token. really not sure what this is for
                    if (reply.token !== undefined) {
                        localStorage.setItem('signupToken', `${reply.token}`);
                    }
                })
                .catch(error => {
                    alert("He's dead Jim (Signup error)");
                });
        }
    });

    return modal;
}
//helper function for the above that checks whether email, username and name are ok
function checkInputFields(username, email, name) {
    if(!checkUsername(username)) {
        alert("Illicit username. Valid characters: 0-9,a-z,A-Z,_,-,@,.^");
        return false; 
    }
    else if (!checkEmail(email)) {
        alert("Illicit email. Please enter in the format <email>@<email_server>.com");
        return false;
    }
    else if (!checkUsername(name)) {
        alert("Alphanumeric characters only please");
        return false; 
    }
    return true; 
}

//helper function that checks email format
function checkEmail(email) {
    //pattern needed to check 
    const emailFormat = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/;
    if(email.match(emailFormat)) {
        return true;
    }
    return false;
} 
//helper function that checks username format
function checkUsername(username) {
    //pattern needed to check 
    const legalChar = /^[0-9a-zA-Z\_\+\-\@\.\^\s]+$/;
    if(username.trim().match(legalChar)) {
        return true;
    }
    return false;
}
//helper function that checks password format
function checkPW(pw) {
    //pattern needed to check 
    const legalPw = /^[^\s]{8,}$/;
    if(pw.match(legalPw)) {
        return true;
    }
    return false;
}
//handler function that causes form box to glow red if invalid
//green if valid 
function invalidHandler(form, checkFunction) {
    if(checkFunction(form.value) === true) {
        form.classList.remove('red-outline');
        form.classList.add('green-outline');
    }
    else {
        form.classList.remove('green-outline');
        form.classList.add('red-outline');
    }
}
export default buildSignupForm;