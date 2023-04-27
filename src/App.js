import './App.css';
import Comments from './components/Comments/Comments';
import { useEffect, useState } from 'react';

const URL = 'http://localhost:3001/comments';

const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(),
};

function App() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchComments = async (URL) => {
      try {
        const res = await fetch(URL, { ...FETCH_OPTIONS, signal });
        if (!res.ok) {
          throw new Error('Error fetching comments!');
        }
        const comments = await res.json();
        console.log(comments);
        setComments(comments);
      } catch (error) {
        console.error('Network Error : ', error);
      }
    };

    fetchComments(URL);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="wrapper">
      <h2 className="heading">Discussion</h2>

      <Comments comments={comments} />
    </div>
  );
}

export default App;
