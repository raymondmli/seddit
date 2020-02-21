//file that gets information about posts 
import API_URL from './backend_url.js';

//given the JSON, get # upvotes
function upvoteNumber(postJSON) {
    const upvotes = postJSON.meta.upvotes;
    console.log(upvotes.length());
   // return upvotes.length();
}

//makes upvote put request 
function upvotePost (postJSON, authorisation,remove) {
    const id = postJSON.id;
    const url = `${API_URL}/post/vote?id=${id}`;
    var method = 'PUT';
    if (remove === true) {
        method = 'DELETE';
    } 
    fetch(url, {
        method: method,
        headers: {
            'Authorization' : `Token ${authorisation}`
        }
    })
    .then(res => {
        if (res.status === 403) {
            alert('Invalid auth token');
        }
    });
}
//returns a promise to get the JSON of a post, given the id and authorisation
function getPost (postID, authorisation) {
    const url = `${API_URL}/post/?id=${postID}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization' : `Token ${authorisation}`
        }
    })
    .then(res => {
        return res.json();
    })
}

export {
        upvoteNumber as upvoteNumber,
        upvotePost as upvotePost,
        getPost as getPost};