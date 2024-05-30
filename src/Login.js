import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect();

const Login = ({ setAuthType, setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await socket.emit('user:login', {
      id: username,
      pw: password
    }, (message) => {
      if(message === "id나 비밀번호가 틀립니다."){
        return alert(message);
      } else {
        setAuthenticated(true);
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setAuthType('register')}>Go to Register</button>
    </div>
  );
};

export default Login;
