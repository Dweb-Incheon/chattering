import React, { useState } from 'react';
import io from 'socket.io-client';
import { TextField, Button, Box, Typography, Container } from '@mui/material';

// const socket = io.connect();
let socket = io("http://localhost:4000", { transports: ['websocket', 'polling'] });


const Login = ({ setAuthType, setAuthenticated, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await socket.emit('user:login', {
      id: username,
      pw: password
    }, (message) => {
      if (message === "id나 비밀번호가 틀립니다.") {
        return alert(message);
      } else {
        setUserId(username);
        setAuthenticated(true);
      }
    });
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
      >
        <img src="images/INU.png" alt="INU 로고" style={{ marginBottom: 20, weight: '100px', height: '80px' }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '80%', 
            mt: 1,
          }}
        >
          <Typography component="h1" variant="h5" align="center">
            로그인
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="아이디"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 3 }}
          >
            로그인
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mb: 3 }}
            onClick={() => setAuthType('register')}
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
