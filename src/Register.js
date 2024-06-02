import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import io from 'socket.io-client';

// const socket = io.connect();
let socket = io("http://localhost:4000", { transports: ['websocket', 'polling'] });

const Register = ({ setAuthType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await socket.emit('user:register', { id: username, pw: password }, (message) => {
      if (message === "해당 id는 존재하는 id입니다. 다른 id로 가입해주세요!!") {
        setError(message); // Set error message to display in dialog
        setOpen(true); // Open the dialog
      } else {
        setOpen(true); // Open the success dialog
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    if (!error){
      setAuthType('login');
    }
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
            회원가입
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
            회원가입
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mb: 3 }}
            onClick={() => setAuthType('login')}
          >
            로그인으로 이동
          </Button>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>{error ? "💧 중복된 id 💧" : "🎉 회원가입 성공 🎉"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {error ? error : "회원가입이 성공적으로 완료되었습니다."}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button onClick={handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Register;
