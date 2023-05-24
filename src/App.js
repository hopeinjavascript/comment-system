import './App.css';
import AddCommentOrReply from './components/AddCommentOrReply/AddCommentOrReply';
import Comments from './components/Comments/Comments';
import { useEffect, useRef, useState } from 'react';
import genericHelpers from './helpers/generic';
import { useUserContext } from './context/UserContext';

const URL = 'http://localhost:3001/comments';

const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(),
};

// just to imitate a user
const LOGGED_IN_USER = {
  name: 'Akshay Sood',
  username: 'akshaysood',
  email: 'akshaysood@gmail.com',
};

/* this will essentially add nested comments/replies */
function cbAddReply(comments, parentId, replyText, loggedInUser) {
  const updatedState = comments.map((comment, index) => {
    if (comment.id === parentId) {
      comment.children = [
        ...comment.children,
        {
          id: Date.now(),
          parentId: parentId,
          name: loggedInUser ? loggedInUser.name : 'Guest User ' + index,
          img: 'avatar.png',
          text: `@${comment.name} ${replyText}`,
          upVotes: [],
          downVotes: [],
          editCount: 0,
          children: [],
        },
      ];
    } else {
      comment.children.length > 0 &&
        cbAddReply(comment.children, parentId, replyText);
    }

    return comment;
  });

  return updatedState;
}

function cbEditComment(comments, id, editedText) {
  const updatedState = comments.map((comment) => {
    if (comment.id === id) {
      comment.text = editedText;
      comment.editCount = comment.editCount + 1;
    } else {
      comment.children.length > 0 &&
        cbEditComment(comment.children, id, editedText);
    }

    return comment;
  });

  return updatedState;
}

// helper for cbVotes
function voteCount(comment, voteType, username) {
  /*
  A person can either like OR dislike a given comment, but not both.
  */
  if (voteType === 'upVotes') {
    // upVotes is an array because we are going to store username of the person who liked the comment
    if (!comment.upVotes.includes(username)) {
      comment.upVotes = comment.upVotes.concat(username);
    }
    comment.downVotes = comment.downVotes.filter(
      (userName) => userName !== username
    );
  } else if (voteType === 'downVotes') {
    // downVotes is an array because we are going to remove username of the person who disliked the comment
    if (!comment.downVotes.includes(username)) {
      comment.downVotes = comment.downVotes.concat(username);
    }
    comment.upVotes = comment.upVotes.filter(
      (userName) => userName !== username
    );
  }
}

function cbVotes(comments, id, voteType) {
  const newComments = comments.map((comment) => {
    if (comment.id === id) {
      // just to imitate a logged in user
      if (LOGGED_IN_USER.username) {
        voteCount(comment, voteType, LOGGED_IN_USER.username);
      } else {
        alert('User is not logged in');
      }
    } else {
      comment.children.length > 0 && cbVotes(comment.children, id, voteType); // maintain no. of args !
    }

    return comment;
  });

  return newComments;
}

function cbDeleteComment(comments, id) {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    if (comment.id === id) {
      comments.splice(i, 1);
    }

    comment.children.length > 0 && cbDeleteComment(comment.children, id);
  }

  // spreading because sending same reference of the array won't update the state because of how the React's diffing algorithm works
  return [...comments];
}

function App() {
  const [comments, setComments] = useState([]);
  const countRef = useRef(0);

  const loggedInUser = useUserContext();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchComments = async (URL) => {
      try {
        const res = await fetch(URL, { ...FETCH_OPTIONS, signal });
        if (!res.ok) {
          throw new Error('Error fetching comments!');
        }
        const comments = await res.json();

        // storing in ref won't call the getCommentsCount fn on every new comment/reply that is added -> check pt (1.)
        // we can do this because refs don't cause re-renders and remembers data across re-renders and entire lifecycle of the component
        countRef.commentsCount = getCommentsCount(comments);

        setComments(comments);
      } catch (error) {
        console.error('Network Error : ', error);
      }
    };

    fetchComments(URL);

    return () => {
      controller.abort();
    };
  }, []);

  const handleAddComment = (val) => {
    setComments((prevComments) => [
      ...prevComments,
      {
        id: Date.now(),
        name: loggedInUser ? loggedInUser.name : 'Guest User',
        img: 'avatar.png',
        text: val,
        upVotes: [],
        downVotes: [],
        editCount: 0,
        children: [],
      },
    ]);
    countRef.commentsCount++;
  };

  const handleAddReply = (replyText, parentId, loggedInUser) => {
    const updatedState = cbAddReply(
      comments,
      parentId,
      replyText,
      loggedInUser
    );
    setComments(updatedState);
    countRef.commentsCount++;
  };

  const handleEditComment = (editedText, id) => {
    const updatedState = cbEditComment(comments, id, editedText);
    setComments(updatedState);
  };

  const handleUpVote = (id, voteType) => {
    const newComments = cbVotes(comments, id, voteType);
    setComments(newComments);
  };

  const handleDownVote = (id, voteType) => {
    const newComments = cbVotes(comments, id, voteType);
    setComments(newComments);
  };

  const handleDeleteComment = (id) => {
    const updatedComments = cbDeleteComment(comments, id);
    setComments(updatedComments);
  };

  // comments count
  function getCommentsCount(comments) {
    console.log('getCommentsCount'); //(1.) check why this is printing twice when called this function in JSX directly(where countRef is referred)
    return genericHelpers.recursivelyFlattenArray(comments).length;
  }

  return (
    <div className="wrapper">
      <h2 className="heading">Discussion ({countRef.commentsCount})</h2>

      <div className="comment-box">
        <AddCommentOrReply handler={handleAddComment} />
      </div>

      <Comments
        comments={comments}
        handleAddReply={handleAddReply}
        handleEditComment={handleEditComment}
        handleUpVote={handleUpVote}
        handleDownVote={handleDownVote}
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
}

export default App;
