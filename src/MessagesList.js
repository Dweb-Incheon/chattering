import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 92%;
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 14px 24px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  border-radius: 8px 8px 0 0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  overflow-y: auto;
`;

const WrapMessage = styled.div`
  max-width: 100%;
  align-self: ${({ isUserMessage }) => (isUserMessage ? 'flex-end' : 'flex-start')};
  
`;

const MessageWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  max-width: 50%; /* Adjust the max-width of individual messages */
  margin-left: ${({ isUserMessage }) => (isUserMessage ? 'auto' : '0')};
  margin-right: ${({ isUserMessage }) => (isUserMessage ? '0' : 'auto')};
`;

const Message = styled.div`
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${({ isUserMessage }) => (isUserMessage ? '#d1e7dd' : '#ffffff')};
  margin-left: ${({ isUserMessage }) => (isUserMessage ? 'auto' : '0')};
  margin-right: ${({ isUserMessage }) => (isUserMessage ? '0' : 'auto')};
`;

const Username = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const MessageContent = styled.div`
  margin-top: 5px;
`;

const MessagesList = ({ roomName, roomMessages, userId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  return (
    <ChatContainer>
      <ChatHeader>🏠 {roomName}</ChatHeader>
      <MessagesContainer>
        {roomMessages.map((message, i) => (
          <WrapMessage key={i}>
            <MessageWrapper isUserMessage={message.user === userId}>
              <Message isUserMessage={message.user === userId}>
                <Username>👤 {message.user}</Username>
                <MessageContent>{message.message}</MessageContent>
              </Message>
            </MessageWrapper>
          </WrapMessage>
        ))}
        <div ref={messagesEndRef}></div>
      </MessagesContainer>
    </ChatContainer>
  );
};

export default MessagesList;
