import React, { useState, useRef } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import './index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button } from 'antd';
import { getProjectSelectResult, getSessionSelectResult, max_limit } from './App';
const { Option } = Select;
let index = 0;

/*This file is for the selector UI*/
export const Selector = (props) => {
  const [items, setItems] = useState([props.preset]);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const onSelectChange = (value) =>{
    if (props.selectorName == "Project")
      getProjectSelectResult = value;
    else if (props.selectorName == "Scenario")
      getSessionSelectResult = value;
    else if (props.selectorName == "MaxLimit")
      if (value == "Unlimited")
        max_limit = 10000000;
      else
        max_limit = Number(value);
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      onChange={onSelectChange}
      style={{
        width: props.length,
      }}
      placeholder= {props.preset}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <Space
            style={{
              padding: '0 8px 4px',
            }}
          >
            <Input
              placeholder="Please enter item"
              size="small"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
            </Button>
          </Space>
        </>
      )}
    >
      {items.map((item) => (
        <Option key={item}>{item}</Option>
      ))}
    </Select>
  );
};

