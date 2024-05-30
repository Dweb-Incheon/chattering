const userNames = (function () {
  let users = {};

  const registerCheck = function (user_info) {
    if (!user_info.id || users[user_info.id]) {
      return false;
    } else {
      users[user_info.id] = user_info.pw;
      return true;
    }
  };

  const loginCheck = function (user_info) {
    if (!user_info.pw || (user_info.pw !== users[user_info.id])) {
      return false;
    } else {
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  // const getGuestName = function () {
  //   let name;
  //   let nextUserId = 1;

  //   do {
  //     name = 'Guest ' + nextUserId;
  //     nextUserId += 1;
  //   } while (!claim(id));

  //   return id;
  // };

  // serialize claimed names as an array
  const get = function () {
    return Object.keys(users);
  };

  const free = function (id) {
    if (users[id]) {
      delete users[id];
    }
  };

  return {
    loginCheck: loginCheck,
    registerCheck: registerCheck,
    free: free,
    get: get,
  };
})();

// export function for listening to the socket
module.exports = function (socket) {
  // let name = userNames.getGuestName();  // 변경된 부분: const -> let
  let name="";
  // send the new user their name and a list of users
  // socket.emit('init', {
  //   name: name,
  //   users: userNames.get()
  // });

  socket.on('user:register', (user_info, fn) => {
    let message = "";
    if (!userNames.registerCheck(user_info)) {
      message = "해당 id는 존재하는 id입니다. 다른 id로 가입해주세요!!";
      fn(message);
    } else {
      message = "회원 가입 성공!!";
      fn(message);
    }
    // socket.emit('user:register', {
    //   message: message
    // });
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
    // socket.emit('server:login', {
    //   message: message
    // });
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.text
    });
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      const oldName = name;
      userNames.free(oldName);

      name = data.name;  // 변경된 부분: name을 let으로 선언하여 재할당 가능하게 함

      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};
