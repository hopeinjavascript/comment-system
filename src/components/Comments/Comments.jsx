import React from 'react';
import './Comments.css';
import Comment from '../Comment/Comment';

const Comments = ({ comments, handleAddReply }) => {
  return (
    <div className="comments">
      {comments?.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            handleAddReply={handleAddReply}
          />
        );
      })}
    </div>
  );
};

export default Comments;
