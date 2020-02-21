//file that contains functions to create and update the show upvote modal
import * as user from './userInfo.js';
import * as helper from './helper.js';

//Creates modal, adds relevant classes and appends to main div
function upvoteModal() {
    const main = document.querySelector('#main');
    const modal = helper.buildModal('upvote-modal', 'upvote-content', 'comment-box', 'thin');
    main.appendChild(modal);
}

//Given the relevant JSON, updates the upvote modal with the info in it
//Finds and adds list of users who upvoted a post to the modal 
function upModalContent(postJSON, authorisation) {
    const upmodal = document.querySelector('#upvote-content');
    //clear modal first before updating 
    helper.deleteChildren(upmodal);
    const upvoters = postJSON.meta.upvotes;
    //create and append title of course 
    const titleNode = helper.createEle('h1', 'Upvoters', 'centre-align');
    upmodal.appendChild(titleNode);

    //for each user JSON (upvoter), create an element for their name and add it to the modal
    upvoters.forEach(upvoter => {
        const voterInfo = user.getInfo(upvoter, authorisation, 'not-self');
        voterInfo.then(json => {
            const userNode = helper.createEle('p',`${json.username}`);
            upmodal.appendChild(userNode);
        });
    });
}

export {upvoteModal as upvoteModal,
        upModalContent as upModalContent}