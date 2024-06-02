'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server, { rememberTransport: false, transports: ['websocket', 'flashsocket', 'xhr-polling'] });

// 사용자 및 채팅방 데이터를 관리하는 모듈
const userNames = (function () {
  let users = {};
  let chatrooms = [];
  let roomMessages = {};
  let joinRoom = {};

  const registerCheck = function (user_info) {
    if (!user_info.id || users[user_info.id]) {
      return false;
    } else {
      users[user_info.id] = user_info.pw;
      return true;
    }
  };

  const loginCheck = function (user_info) {
    if (!user_info.pw || user_info.pw !== users[user_info.id]) {
      return false;
    } else {
      return true;
    }
  };

  const searchRoom = function (room_name) {
    return chatrooms.includes(room_name);
  };

  const makeRoom = function (room_name) {
    chatrooms.push(room_name);
    roomMessages[room_name] = [];
  };

  const getRoomMessages = function (room_name) {
    return roomMessages[room_name];
  };

  const pushMessage = function (room_name, message) {
    if (roomMessages[room_name]) {
      roomMessages[room_name].push(message);
    }
  };

  const checkRoom = function (user) {
    return joinRoom[user];
  }

  const addRoom = function (user, room_name) {
    joinRoom[user] = room_name;
  }

  const deleteRoom = function (user) {
    delete joinRoom[user];
  }



  return {
    loginCheck: loginCheck,
    registerCheck: registerCheck,
    searchRoom: searchRoom,
    makeRoom: makeRoom,
    getRoomMessages: getRoomMessages,
    pushMessage: pushMessage,
    checkRoom: checkRoom,
    addRoom: addRoom,
    deleteRoom: deleteRoom,
  };
})();

/* Socket.io Communication */
io.on('connection', (socket) => {
  let name = "";
  socket.on('user:register', (user_info, fn) => {
    let message = "";
    if (!userNames.registerCheck(user_info)) {
      message = "해당 id는 존재하는 id입니다. 다른 id로 가입해주세요!!";
      fn(message);
    } else {
      message = "회원 가입 성공!!";
      fn(message);
    }
  });

  socket.on('user:login', (user_info, fn) => {
    let message = "";
    if (!userNames.loginCheck(user_info)) {
      message = "id나 비밀번호가 틀립니다.";
      fn(message);
    } else {
      message = "로그인 성공!!";
      fn(message);
    }
  });

  socket.on('search:room', ({ room_name, user }, fn) => {
    let join_room = userNames.checkRoom(user)
    if (join_room){
      userNames.deleteRoom(user);
      socket.leave(join_room);
    }
    let result = userNames.searchRoom(room_name);
    const room_messages = userNames.getRoomMessages(room_name);
    if (result){
      socket.join(room_name);
      userNames.addRoom(user, room_name);
      fn(room_messages, result);
    } else {
      const empty_message = [];
      fn(empty_message, result);
    }
  });

  socket.on('make:room', ({ room_name, user }, fn) => {
      userNames.makeRoom(room_name);
      socket.join(room_name);
      userNames.addRoom(user, room_name);
      const room_messages = userNames.getRoomMessages(room_name);
      fn(room_messages);
  });

  socket.on('send:message', ({ message, room_name })=> {
    userNames.pushMessage(room_name, message);
    io.to(room_name).emit('send:message', {
      user: message.user,
      message: message.message
    });
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
    });
  });
});

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 4000);

if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Start server */
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
