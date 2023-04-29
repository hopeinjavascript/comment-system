import React from 'react';

const UserContext = React.createContext(null);

const URL = 'http://localhost:3001/LOGGED_IN_USER';

const UserContextProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = React.useState({});

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUser(URL) {
      try {
        const res = await fetch(URL, { signal });
        if (!res.ok) {
          throw new Error('Error fetching user!');
        }
        const user = await res.json();
        console.log(user);
        setLoggedInUser(user);
      } catch (error) {
        console.error('Network Error : ', error);
      }
    }

    fetchUser(URL);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <UserContext.Provider value={loggedInUser}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;

const useUserContext = () => {
  return React.useContext(UserContext);
};

export { useUserContext };
