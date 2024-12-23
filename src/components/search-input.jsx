import React from 'react';
import {Input } from 'antd';

const {Search} = Input;
const SearchInput = () => {

  return (
    
    <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="medium"
            style={{width: '400px'}}
            
        />

  );
};

export default SearchInput;
