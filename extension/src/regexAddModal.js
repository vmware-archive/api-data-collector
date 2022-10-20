// import React, { useState } from 'react';
// import 'antd/dist/antd.css';
// import './index.css';
// import { Button, Modal, Space, Input } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import { regex_list } from './parser';

// export const RegexAddModal = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [regexKey, setRegexKey] = useState('');
//   const [regexValue, setRegexValue] = useState('');

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     regex_list.push({regexKey:regexValue});
//     setIsModalVisible(false);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <>
//     <Button
//           type="default"
//           shape="circle"
//           icon={<PlusOutlined />}
//           onClick={showModal}>
//         </Button>
//       <Modal title="Add Regex" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
//       <Space>
//             Regex identifier:
//             <Input
//               placeholder="Please enter the regex identifier"
//               value={regexKey}
//               style={{
//                 width: 200,
//               }}
//               onChange={e => {
//                 const currValue = e.target.value;
//                 setRegexKey(currValue);
//               }}
//             />
//           </Space>
//           <Space>
//             Regex Pattern:
//             <Input
//               placeholder="Please enter the regex pattern"
//               value={regexValue}
//               style={{
//                 width: 200,
//               }}
//               onChange={e => {
//                 const currValue = e.target.value;
//                 setRegexValue(currValue);
//               }}
//             />
//           </Space>
//       </Modal>
//     </>
//   );
// };

