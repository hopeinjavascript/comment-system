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

const Comment = ({ comment, handleAddReply, handleCancel }) => {
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

  const toggleIsReplying = () => setIsReplying(!isReplying);

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
          </div>

          <p className="comments__text">{text}</p>

          <div className={`cta ${isReplying ? 'hide' : null}`}>
            <button className={`btn btn-upvote`}>
              <BsHandThumbsUp />
              {upVotes > 0 && <span className="count">{upVotes}</span>}
            </button>
            <button className={`btn btn-downvote`}>
              <BsHandThumbsDown />
              {downVotes > 0 && <span className="count">{downVotes}</span>}
            </button>
            <button className="btn btn-reply" onClick={toggleIsReplying}>
              <VscReply />
              {children.length > 0 && (
                <span className="count">{children.length}</span>
              )}
            </button>
            <button className="btn btn-edit">
              <FiEdit2 />
            </button>
            <button className="btn btn-delete">
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

      <ReplyThread
        id={id}
        children={children}
        handleAddReply={handleAddReply}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Comment;
