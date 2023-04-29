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

  // add comment
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
      />
    </div>
  );
}

export default App;
