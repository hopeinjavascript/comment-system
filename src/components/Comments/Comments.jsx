import React from 'react';
import './Comments.css';
import { VscReply } from 'react-icons/vsc';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsHandThumbsUp, BsHandThumbsDown } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import genericHelpers from '../../helpers/generic';
import ReplyThread from '../ReplyThread/ReplyThread';

const { dd, mmm, yyyy } = genericHelpers.getDateTimeDetails();

const Comments = ({ comments }) => {
  return (
    <>
      {comments?.map((comment) => {
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
        return (
          <div className="comments" key={id || parentId}>
            <div className="comment-container">
              <div className="comment-picture">
                <div>
                  <img className="profile-picture" src={img} alt="profile" />
                </div>
              </div>
              <div className="comment">
                <div className="comments__profile">
                  <h3 className="profile-name">{name}</h3>
                  <span className="dot"></span>
                  <span className="comment-date">{`${dd} ${mmm} ${yyyy}`}</span>
                </div>

                <p className="comments__text">{text}</p>

                <div className="cta">
                  <button className={`btn btn-upvote`}>
                    <BsHandThumbsUp />
                    {upVotes > 0 && <span className="count">{upVotes}</span>}
                  </button>
                  <button className={`btn btn-downvote`}>
                    <BsHandThumbsDown />
                    {downVotes > 0 && (
                      <span className="count">{downVotes}</span>
                    )}
                  </button>
                  <button className="btn btn-reply">
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

            <ReplyThread id={id} children={children} />
          </div>
        );
      })}
    </>
  );
};

export default Comments;
