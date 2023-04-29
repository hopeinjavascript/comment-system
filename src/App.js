import './App.css';
import AddCommentOrReply from './components/AddCommentOrReply/AddCommentOrReply';
import Comments from './components/Comments/Comments';
import { useEffect, useState } from 'react';

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
function cbAddReply(comments, parentId, replyText) {
  const updatedState = comments.map((comment, index) => {
    if (comment.id === parentId) {
      comment.children = [
        ...comment.children,
        {
          id: Date.now(),
          parentId: parentId,
          name: 'No User' + index,
          img: 'avatar.png',
          text: `@${comment.name} ${replyText}`,
          upVotes: 0,
          downVotes: 0,
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

function App() {
  const [comments, setComments] = useState([]);

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
        console.log(comments);
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
        name: 'New User',
        img: 'avatar.png',
        text: val,
        upVotes: 0,
        downVotes: 0,
        editCount: 0,
        children: [],
      },
    ]);
  };

  const handleAddReply = (replyText, parentId) => {
    const updatedState = cbAddReply(comments, parentId, replyText);
    setComments(updatedState);
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

  return (
    <div className="wrapper">
      <h2 className="heading">Discussion</h2>

      <div className="comment-box">
        <AddCommentOrReply handler={handleAddComment} />
      </div>

      <Comments
        comments={comments}
        handleAddReply={handleAddReply}
        handleEditComment={handleEditComment}
        handleUpVote={handleUpVote}
        handleDownVote={handleDownVote}
      />
    </div>
  );
}

export default App;
