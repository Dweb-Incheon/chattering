import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row; /* 요소들을 가로로 배열 */
  align-items: center;
`;

const Input = styled.input`
  flex: 1; /* 입력창이 남은 공간을 채우도록 함 */
  padding: 15px;
  margin-right: 10px; /* 입력창과 버튼 사이 간격 조정 */
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1.0em;
`;

const Button = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1.0em;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatRoomSearch = ({ setSearchQuery }) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    if (input!=='') {
      setSearchQuery(input);
    }
  };

  return (
    <SearchContainer>
      <Input
        type="text"
        placeholder="채팅방 이름 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={handleSearch}>search</Button>
    </SearchContainer>
  );
};

export default ChatRoomSearch;
