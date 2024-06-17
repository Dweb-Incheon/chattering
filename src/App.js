import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ChatApp from './ChatApp';

const App = () => {
  const [authType, setAuthType] = useState('login');
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');

  if (!authenticated) {
    return authType === 'login' ? (
      <Login setAuthType={setAuthType} setAuthenticated={setAuthenticated} 
      setUserId={setUserId} />
    ) : (
      <Register setAuthType={setAuthType} />
    );
  }

  return <ChatApp user = {userId} />;
  // return <Register setAuthType={setAuthType} />;

};

export default App;
