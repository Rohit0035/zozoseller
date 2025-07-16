import React, { useState } from 'react';
import { Input, InputGroup, InputGroupText } from 'reactstrap';
import { FaSearch } from 'react-icons/fa';

const SearchComponent = ({ placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <InputGroup>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
      />
     <InputGroupText style={{cursor:'pointer'}}><FaSearch /></InputGroupText>
    </InputGroup>
  );
};

export default SearchComponent;
