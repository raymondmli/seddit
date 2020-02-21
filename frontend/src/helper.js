//Collection of generally useful helper functions 
const MILLISECONDS = 1000;
//General function to help build modals 
function buildModal(idModal, idContent,...classes) {
    //creates a wrapper div, adds the modal class assigns the id 
    //(which is important because modals are selected and displayed using their id)
    const popDiv = document.createElement('div');
    popDiv.classList.add('modal');
    popDiv.id = idModal;

    //creates the content div, adds classes selected by user and assigns id as before 
    const popForm = document.createElement('div');
    if(classes.length !== 0) {
        classes.forEach(c => {
            popForm.classList.add(c);
        });
    }
    else {
        popForm.classList.add('modal-content');
    }
    popDiv.appendChild(popForm);
    popForm.id = idContent;
    //returns the wrapper div. Content div is selected by popDiv.firstChild
    return popDiv; 
}

//function that creates element, adds innerText, appends classes selected by user 
function createEle(elementType, text, ...classes) {
    const element = document.createElement(elementType);
    element.innerText = text;
    if (classes.length !== 0) {
        classes.forEach(classname => {
            element.classList.add(classname);
        });
    }
    return element; 
}

//function that creates element, does not add innerText, appends classes if there are any 
function createEleTextless(elementType, ...classes) {
    const element = document.createElement(elementType);
    if (classes.length !== 0) {
        classes.forEach(classname => {
            element.classList.add(classname);
        });
    }
    return element; 
}

//NOTE: I thought it'd be easier to use 3 separate functions due to the lack of function overloading in JS
//function that creates element, adds placeHolder, appends classes if there are any 
function createElePlaceholder(elementType, text, ...classes) {
    const element = document.createElement(elementType);
    element.placeholder = text;
    if (classes.length !== 0) {
        classes.forEach(classname => {
            element.classList.add(classname);
        });
    }
    return element; 
}
//deletes all the children of a given element 
function deleteChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }    
}
//Displays modal. 
function showModal(modal) {
    modal.classList.add('show');
}

//Event listener that serves to close model upon a click outside of its area 
function removeModalListener() {
    window.onclick = function(e){
        //select all the relevant modals 
        const loginPopup = document.querySelector('#login-form');
        const signupPopup = document.querySelector('#signup-form');
        const upvotePopup = document.querySelector('#upvote-modal'); 
        const commPopup = document.querySelector('#comment-modal');
        const userPopup = document.querySelector('#user-modal');
        const guidePopup = document.querySelector('#guide-modal')
        //check if outside of modal is clicked for each one and close all modals. 
        var popUplist = [loginPopup, signupPopup, upvotePopup, commPopup, userPopup, guidePopup];
        //remove popup element
        if (guidePopup === null) {
            popUplist = [loginPopup, signupPopup, upvotePopup, commPopup, userPopup];
        }
        popUplist.forEach(pop => {
            if(e.target === pop) {
                console.log('haha');
                popUplist.forEach(up => {
                    up.classList.remove('show');
                })
            }
        });
    }
}
//checks if the user is logged in, which is defined as the localStorage.username being not null
function loggedIn() {
    if (localStorage.getItem('username') !== null) {
        console.log('logged in');
        return true;
    }
    else {
        console.log('not logged in');
        return false;
    }
}

//converts a unix timestamp to the format that I require
function unixStampConverter(stamp) {
    //Month array
    const months = ['January','February','March','April','May',
                        'June','July','August','September','October',
                        'November','December'];

    //Timestamp to milliseconds and pass to new date obj.
    const date = new Date(stamp*MILLISECONDS);
    const day = date.getDate();
    //Select correct suffix for the date. 
    //i.e. if it's 3/09/2019, then the suffix for the day is 'rd' as in '3rd of September 2019'. 
    var daySuffix = 'th';
    if (day === 1) { 
        daySuffix = 'st';
    }
    else if (day === 2) {
        daySuffix = 'nd';
    }
    else if (day === 3) {
        daySuffix = 'rd';
    }
    //if minute < 10, then it'll look stupid i.e. 5 minutes past 3pm would be '15:5' as opposed to '15:05'
    //have to manually append the zero 
    var minute = date.getMinutes();
    if (minute < 10) { 
        minute = '0' + minute;
        console.log(minute);
    }
    //get date string in the desired format 
    const dateTime = 'the ' + date.getDate() + `${daySuffix} of ` + months[date.getMonth()] + ' ' + date.getFullYear() 
                    +' at '+ date.getHours() + ':' + `${minute}`;
    return dateTime;
}

//takes an array of children and appends to parent
function appendToParent(parent, ...children) {
    children.forEach(child => {
        parent.appendChild(child);
    });
}

//pops up once at app init.  
function guideModal() {
    const root = document.querySelector('#root');
    const modal = buildModal('guide-modal', 'guide-content');
    root.appendChild(modal)

    const content = document.querySelector('#guide-content');
    content.appendChild(createEle('p','Click anywhere outside these popup boxes to close!'));
}
//yep
export { buildModal as buildModal,
        deleteChildren as deleteChildren,
        createEle as createEle,
        createElePlaceholder as createElePlaceholder,
        createEleTextless as createEleTextless,
        showModal as showModal,
        removeModalListener as removeModalListener,
        loggedIn as loggedIn,
        unixStampConverter as unixStampConverter,
        appendToParent as appendToParent,
        guideModal as guideModal};