//file to do with creating and updating the comment modal and other things to do with comments
import * as helper from './helper.js';

//function that adds content to the comment modal. Serves to update it too. 
function commentModContent(postJSON) {
    //clears modal 
    const commModal = document.querySelector('#comment-content');
    helper.deleteChildren(commModal);
    const comments = postJSON.comments;
    //adds title
    const titleNode = helper.createEle('h1', 'Comments', 'centre-align');
    commModal.appendChild(titleNode);
    //loops through post JSON and creates a comment div for each one, consisted of an author and their comment
    comments.forEach(comment => {
        const wrapper = helper.createEleTextless('div', 'comment');
        const authorNode = helper.createEle('h4', `${comment.author}:`, 'left-align');
        const commentNode = helper.createEle('p', `${comment.comment}`);
        wrapper.appendChild(authorNode);
        wrapper.appendChild(commentNode);
        commModal.appendChild(wrapper);
    });    
}
//function that creates comment modal, styles it and appends it to main
function commentModal() {
    const main = document.querySelector('#main');
    const modal = helper.buildModal('comment-modal', 'comment-content', 'comment-box');
    modal.firstChild.classList.add('wide-div');
    main.appendChild(modal);
}

export {commentModContent as commentModContent,
        commentModal as commentModal};