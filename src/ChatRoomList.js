import React from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 20px;
  text-align: left; /* 왼쪽 정렬 */
`;

const Message = styled.p`
  font-size: 1.2em;
  margin-bottom: 20px;
  white-space:pre-wrap
`;

const RoomNameButton = styled.button`
  font-size: 1.5em;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  margin-bottom: 10px;
  &:hover {
    color: #0056b3;
    text-decoration: ;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => (props.primary ? '#007bff' : '#ccc')};
  color: ${props => (props.primary ? '#fff' : '#000')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.primary ? '#0056b3' : '#999')};
  }
`;

const ChatRoomList = ({ room_name, exist_room, onCreateRoom, onClickXButton, onEnterRoom }) => {
  return (
    <Container>
      {exist_room && (
        <RoomNameButton onClick={onEnterRoom}>📌 {room_name}</RoomNameButton>
      )}
      {!exist_room && (
        <Container>
          <Message> 해당 채팅방이 없습니다.<br></br>새로운 채팅방을 만드시겠습니까?</Message>
          <ButtonContainer>
            <Button onClick={onClickXButton}>취소</Button>
            <Button primary onClick={onCreateRoom}>생성</Button>
          </ButtonContainer>
        </Container>
      )}
    </Container>
  );
};

export default ChatRoomList;
