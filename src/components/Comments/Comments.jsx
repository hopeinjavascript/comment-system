import React from 'react';
import './Comments.css';
import Comment from '../Comment/Comment';

const Comments = ({
  comments,
  handleAddReply,
  handleEditComment,
  handleUpVote,
  handleDownVote,
}) => {
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
          />
        );
      })}
    </div>
  );
};

export default Comments;
