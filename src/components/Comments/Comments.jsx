import React from 'react';
import './Comments.css';
import Comment from '../Comment/Comment';
import { useUserContext } from '../../context/UserContext';

const Comments = ({
  comments,
  handleAddReply,
  handleEditComment,
  handleUpVote,
  handleDownVote,
  handleDeleteComment,
}) => {
  // useContext hook is called in the UserContext.js file itself so that any changes to be made in the future are in one place
  const user = useUserContext();
  console.log(user);

  return (
    <div className="comments">
      {comments?.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            handleAddReply={handleAddReply}
            handleEditComment={handleEditComment}
            handleUpVote={handleUpVote}
            handleDownVote={handleDownVote}
            handleDeleteComment={handleDeleteComment}
          />
        );
      })}
    </div>
  );
};

export default Comments;
