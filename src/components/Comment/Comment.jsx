import React, { useState } from 'react';
import AddCommentOrReply from '../AddCommentOrReply/AddCommentOrReply';
import { VscReply } from 'react-icons/vsc';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsHandThumbsUp, BsHandThumbsDown } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import genericHelpers from '../../helpers/generic';
import ReplyThread from '../ReplyThread/ReplyThread';

import './Comment.css';

const { dd, mmm, yyyy } = genericHelpers.getDateTimeDetails();

const Comment = ({
  comment,
  handleAddReply,
  handleEditComment,
  handleUpVote,
  handleDownVote,
  handleDeleteComment,
}) => {
  const {
    id,
    parentId,
    name,
    img,
    text,
    upVotes,
    downVotes,
    editCount,
    children,
  } = comment;

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsReplying = () => setIsReplying(!isReplying);
  const toggleIsEditing = () => setIsEditing(!isEditing);

  return (
    <div className="comment-container" key={id || parentId}>
      <div className="comment">
        <div className="comment-picture">
          <div>
            <img className="profile-picture" src={img} alt="profile" />
          </div>
        </div>
        <div className="comment-content">
          <div className="comments__profile">
            <h3 className="profile-name">{name}</h3>
            <span className="dot"></span>
            <span className="comment-date">{`${dd} ${mmm} ${yyyy}`}</span>
            {editCount > 0 && (
              <>
                <span className="dot"></span>
                <span className="comment-edited">Edited ({editCount})</span>
                {/* <span className="dot"></span>
                <span className="edited-date">{`${dd} ${mmm} ${yyyy}`}</span> */}
              </>
            )}
          </div>

          <p className="comments__text">{text}</p>

          <div className={`cta ${isReplying || isEditing ? 'hide' : null}`}>
            <button
              className={`btn btn-upvote`}
              onClick={() => handleUpVote(id, 'upVotes')}
            >
              <BsHandThumbsUp />
              {upVotes.length > 0 && (
                <span className="count">{upVotes.length}</span>
              )}
            </button>
            <button
              className={`btn btn-downvote`}
              onClick={() => handleDownVote(id, 'downVotes')}
            >
              <BsHandThumbsDown />
              {downVotes.length > 0 && (
                <span className="count">{downVotes.length}</span>
              )}
            </button>
            <button className="btn btn-reply" onClick={toggleIsReplying}>
              <VscReply />
              {children.length > 0 && (
                <span className="count">{children.length}</span>
              )}
            </button>
            <button className="btn btn-edit" onClick={toggleIsEditing}>
              <FiEdit2 />
            </button>
            <button
              className="btn btn-delete"
              onClick={() => handleDeleteComment(id)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        </div>
      </div>

      {/* replying */}
      {isReplying && (
        <AddCommentOrReply
          handler={(val) => {
            handleAddReply(val, id); //id = parentId for the nested comment
            toggleIsReplying();
          }}
          btnText="Reply"
          handleCancel={toggleIsReplying}
        />
      )}

      {/* editing */}
      {isEditing && (
        <AddCommentOrReply
          handler={(editedText) => {
            handleEditComment(editedText, id);
            toggleIsEditing();
          }}
          btnText="Edit"
          handleCancel={toggleIsEditing}
          text={text}
        />
      )}

      <ReplyThread
        id={id}
        children={children}
        handleAddReply={handleAddReply}
        handleEditComment={handleEditComment}
        handleUpVote={handleUpVote}
        handleDownVote={handleDownVote}
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default Comment;
