import './ReplyThread.css';
import Comments from '../Comments/Comments';

const ReplyThread = (props) => {
  return (
    <div className={`reply-thread`}>
      {props.id && props.children.length > 1 && (
        <p className="reply-count">
          Total {props.children.length || ''} replies
        </p>
      )}

      <div className="replies">
        {props.children.length > 0 && <Comments comments={props.children} />}
      </div>
    </div>
  );
};

export default ReplyThread;
