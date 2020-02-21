//file that creates logged in user information modal and obtains user information
import API_URL from './backend_url.js';
import * as helper from './helper.js';
import * as postInfo from './postInfo.js';
//userModal: Builds modal containing info about current user 
function userModal () {
    const modal = helper.buildModal('user-modal','userMod-content');
    return modal;
}
//updateUserMod: adds user info onto modal by calling getInfo and extracting its details
//button calls this function to update modal and show it 
//needs to be called after userModal has been called 
function updateUserMod (self, userID, authorisation) {
    //select the modal and clear it
    const userMod = document.querySelector('#userMod-content');
    helper.deleteChildren(userMod);
    //add title 
    const modalTitle = helper.createEle('h1', 'My Details', 'centre-align');
    userMod.appendChild(modalTitle);

    //pass in 'self' argument to get the JSON about the logged in user
    const userInfo = getInfo(userID, authorisation, 'self');
    if(self !== 'self') {
        console.log('not self');
        //getInfo returns a promise to get a user's JSON 
        userInfo = getInfo(userID, authorisation, 'not-self'); 
    }

    //Updates all the text content in the modal with the data from the json returned from promise
    userInfo.then(async json => {
        updateInfoMod('Username', `${json.username}`, userMod);
        updateInfoMod('Email', `${json.email}`, userMod);
        updateInfoMod('# of posts', `${json.posts.length}`, userMod);
        updateInfoMod('# of upvotes', `${await getUpvotes(json)}`, userMod);
    });
}

//updateInfoMod: Helper function for updateUserMod. 
//takes title,content and parent arguments, creates their elements and appends them to their parent
function updateInfoMod(title, content, parent) {
    const titleNode = helper.createEle('p',`${title}:`, 'left-align', 'comment');
    const contentNode = helper.createEle('p',`${content}`);
    parent.appendChild(titleNode);
    parent.appendChild(contentNode);
}

//getUpvotes: function that takes a user's JSON file and gets #upvotes of each of them
//Goes through each of the user's posts, grabs the #upvotes on it and adds it to the sum 
async function getUpvotes (userJSON) {
    const postArray = userJSON.posts; 
    //get the # of upvote of each post 
    var upvoteNumber = 0;
    //stores an array of promises that promise to return each post's upvote number
    var promiseArray = [];
    postArray.forEach(post => {
        promiseArray.push(upvoteNum(post));
    });
    //Waits for the resolved values of the single promise that promise.all creates to resolve all the promises
    //Will be an array of upvotes of each post 
    const promisedArray = await Promise.all(promiseArray).then(upvotes => {return upvotes}); 
    promisedArray.forEach(value => {upvoteNumber += value});
    return upvoteNumber;
}

//upvoteNum: helper function for the above getUpvotes function.
//returns a promise that promises to return the # of upvotes  
function upvoteNum(post) {
    return postInfo.getPost(post, localStorage.getItem('loginToken'))
            .then(json => {
                const upvoteNumber = json.meta.upvotes.length; 
                return upvoteNumber;
            });
}
 
//getInfo: returns a promise to get a JSON about particular user, given their id 
//if self argument is 'self', then the info of the currently logged in user will be gotten
//else gets the info of user of id 'id'
function getInfo (id, authorisation, self) {
    var url = `${API_URL}/user?id=${id}`; 
    if (self == 'self') { 
        console.log(`${self}`);
        url = `${API_URL}/user`
    };
    return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authorisation}`
            },
            })
            .then(res => {
                //catch 403 status 
                if (res.status === 403) {
                    alert("Invalid auth token");
                } 
                return res.json();
            })
            .catch(error => {
                alert("He's dead Jim (Issue getting user information)");
            });
}


export { getInfo as getInfo,
        userModal as userModal,
        updateUserMod as updateUserMod };
