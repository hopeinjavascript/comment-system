import React, { useEffect, useRef } from 'react';
import './AddCommentOrReply.css';
import { GrPowerReset, GrAdd } from 'react-icons/gr';
import { HiReply } from 'react-icons/hi';
import { AiOutlineStop } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { useUserContext } from '../../context/UserContext';

const AddCommentOrReply = ({
  handler,
  btnText,
  handleCancel,
  text = null, // * to get the current text of the comment/reply
}) => {
  const inputRef = useRef(text);

  const loggedInUser = useUserContext();

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.value = text; // we can set the text here because we have the reference to the underlying DOM node.
    return () => {};
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle empty string
    if (inputRef.current.value) handler(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <img className="profile-picture" src="avatar.png" alt="profile" />
      <textarea
        ref={inputRef}
        name="comment"
        className="comment-input"
        placeholder={
          loggedInUser?.name
            ? `@${loggedInUser.name?.split(' ')[0]} Enter your comment`
            : null
        }
        rows={btnText === 'Reply' || btnText === 'Edit' ? '5' : '3'}
      />
      <div className="cta-column">
        <button type="submit" className="btn btn-submit icon-btn">
          {btnText ?? 'Submit'}

          {btnText === 'Reply' ? (
            <HiReply />
          ) : btnText === 'Edit' ? (
            <FiEdit2 />
          ) : (
            <GrAdd />
          )}
        </button>
        {(btnText === 'Reply' || btnText === 'Edit') && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-cancel icon-btn"
          >
            Cancel
            <span className="btn-icon">
              <AiOutlineStop />
            </span>
          </button>
        )}
        <button type="reset" className="btn btn-reset icon-btn">
          Reset <GrPowerReset />
        </button>
      </div>
    </form>
  );
};
export default AddCommentOrReply;
