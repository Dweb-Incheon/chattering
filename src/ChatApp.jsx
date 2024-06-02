import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import ChatRoomSearch from './ChatRoomSearch';
import ChatRoomList from './ChatRoomList';
import MessagesList from "./MessagesList";

let socket = io("http://localhost:4000", { transports: ['websocket', 'polling'] });

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const ChatAppContainer = styled.div`
  width: 60%;
  height: 80vh;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 30%;
  padding: 20px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  width: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const EmptyChat = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #868e96;
`;

const MessageFormContainer = styled.form`
  display: flex;
  align-items: center;
  margin-top: auto; /* 메시지 입력창을 아래쪽에 고정시킵니다. */
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  margin: 0;
`;

const SendMessageButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 8px 8px 0;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const MessageForm = ({ userId, onMessageSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text !== '') {
      const message = {
        user: userId,
        message: text,
      };
      onMessageSubmit(message);
      setText('');
    }
  };

  return (
    <MessageFormContainer onSubmit={handleSubmit}>
      <MessageInput
        placeholder='메시지 입력'
        className='textinput'
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <SendMessageButton type="submit">전송</SendMessageButton>
    </MessageFormContainer>
  );
};

const ChatApp = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [existRoom, setExistRoom] = useState(false);
  const [onSearch, setOnSearch] = useState(false);
  const [roomMessages, setRoomMessages] = useState([]);
  const [enterRoom, setEnterRoom] = useState(false);

  useEffect(() => {
    socket.on('send:message', (message) => {
      setRoomMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('send:message');
    };
  }, []);

  const handleMessageSubmit = (message) => {
    socket.emit('send:message', { message, room_name: searchQuery });
  };

  useEffect(() => {
    if (searchQuery) {
      socket.emit('search:room', { room_name: searchQuery, user:user }, (room_messages, exist_room) => {
        setOnSearch(true);
        setEnterRoom(false);
        setExistRoom(exist_room);
        setRoomMessages(room_messages);
      });
    }
  }, [searchQuery]);

  const handleCreateRoom = () => {
    socket.emit('make:room', { room_name: searchQuery, user:user }, (room_messages) => {
      setEnterRoom(true);
      setOnSearch(false);
      setExistRoom(true);
      setRoomMessages(room_messages);
    });
  };

  const onClickXButton = () => {
    setOnSearch(false);
    setSearchQuery('');
  };

  const handleEnterRoom = () => {
    setOnSearch(false);
    setEnterRoom(true);
  };

  return (
    <AppContainer>
      <ChatAppContainer>
        <Sidebar>
          <ChatRoomSearch setSearchQuery={setSearchQuery} />
          {onSearch && (
            <ChatRoomList
              room_name={searchQuery}
              exist_room={existRoom}
              onCreateRoom={handleCreateRoom}
              onClickXButton={onClickXButton}
              onEnterRoom={handleEnterRoom}
            />
          )}
        </Sidebar>
        <ChatContainer>
          {enterRoom ? (
            <>
              <MessagesList roomName={searchQuery} roomMessages={roomMessages} userId={user}/>
              <MessageForm onMessageSubmit={handleMessageSubmit} userId={user} />
            </>
          ) : (
            <EmptyChat>
              <p>채팅방을 검색하거나 생성해주세요.</p>
            </EmptyChat>
          )}
        </ChatContainer>
      </ChatAppContainer>
    </AppContainer>
  );
};

export default ChatApp;
