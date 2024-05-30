import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect();

const Register = ({ setAuthType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await socket.emit('user:register', {
      id: username,
      pw: password
    }, (message) => {
      if(message === "해당 id는 존재하는 id입니다. 다른 id로 가입해주세요!!"){
        return alert(message);
      } else {
        return alert(message);
      }
    });
  };

  return (
    <div>
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      <button onClick={() => setAuthType('login')}>Go to Login</button>
    </div>
  );
};

export default Register;
