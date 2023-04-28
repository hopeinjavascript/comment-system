import React, { useEffect, useRef } from 'react';
import './AddCommentOrReply.css';
import { IoAddSharp } from 'react-icons/io5';
import { GrPowerReset } from 'react-icons/gr';

const AddCommentOrReply = ({ handler }) => {
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
        rows={3}
      />
      <div className="cta-column">
        <button type="submit" className="btn btn-submit">
          Submit
          <IoAddSharp />
        </button>
        <button type="reset" className="btn btn-reset">
          Reset <GrPowerReset />
        </button>
      </div>
    </form>
  );
};

export default AddCommentOrReply;
