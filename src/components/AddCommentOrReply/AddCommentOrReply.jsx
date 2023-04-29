import React, { useEffect, useRef } from 'react';
import './AddCommentOrReply.css';
import { IoAddSharp } from 'react-icons/io5';
import { GrPowerReset } from 'react-icons/gr';
import { VscReply } from 'react-icons/vsc';
import { MdOutlineCancel } from 'react-icons/md';

const AddCommentOrReply = ({ handler, btnText, handleCancel }) => {
  const inputRef = useRef('');

  useEffect(() => {
    inputRef.current.focus();
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
        placeholder="Enter your comment"
        rows={btnText === 'Reply' ? '5' : '3'}
      />
      <div className="cta-column">
        <button type="submit" className="btn btn-submit">
          {btnText ?? 'Submit'}
          {btnText === 'Reply' ? <VscReply /> : <IoAddSharp />}
        </button>
        {btnText === 'Reply' && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-cancel"
          >
            Cancel <MdOutlineCancel />
          </button>
        )}
        <button type="reset" className="btn btn-reset">
          Reset <GrPowerReset />
        </button>
      </div>
    </form>
  );
};
export default AddCommentOrReply;
