import React, { useState } from 'react';
import "antd/dist/antd.css";
import "./index.css";
import { Button, Table, Modal, Input, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
/* This file is for the routes generation and regex list*/
const id_regex = new RegExp(
    /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/i  );

//export var regex_list = [{ ":id": id_regex }, {":orgID":"test"}];

const convertStringToRegex = (input) => {
    var lastSlash = input.lastIndexOf("/"); 
    var restoredRegex = new RegExp(input.slice(1, lastSlash), input.slice(lastSlash + 1)); 
    return restoredRegex;
};

export function parseRegex(input) {
    for (const item of regex_list)  {
        const regexString = item.regex;
        const regexp = convertStringToRegex(regexString);
        if (regexp.test(input) == true){
            input = item.identifier;
            break;
        }
    };
    return input;
}

const regex_list = [
  {
    id: 1,
    identifier: ":id",
    regex: id_regex.toString()
  },
  {
    id: 2,
    identifier: ":orgid",
    regex: id_regex.toString()
  }
];

var cur_id = 2;

export function RegexTable() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRegex, setEditingRegex] = useState(null);
  const [dataSource, setDataSource] = useState(regex_list);
  const [addingRegex, setAddingRegex] = useState(null);

  const columns = [
    {
      key: "2",
      title: "Idenifier",
      dataIndex: "identifier"
    },
    {
      key: "3",
      title: "Regex",
      dataIndex: "regex"
    },

    {
      key: "5",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <Tooltip title={"Edit"}>
            <EditOutlined
              onClick={() => {
                onEditRegex(record);
              }}
              style={{ marginLeft: 12 }}
            />
            </Tooltip>
            <Tooltip title={"Delete"}>
            <DeleteOutlined
              onClick={() => {
                onDeleteRegex(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
            </Tooltip>
          </>
        );
      }
    }
  ];

  const onAddRegex = () => {
    setIsAdding(true);
  };

  const onDeleteRegex = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this regex record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((regex) => regex.id !== record.id);
        });
      }
    });
  };

  const onEditRegex = (record) => {
    setIsEditing(true);
    setEditingRegex({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingRegex(null);
  };

  const resetAdding = () => {
    setIsAdding(false);
    setAddingRegex(null);
  };
  return (
    <div>
        <Tooltip title={"Add Regex"}>
        <Button onClick={onAddRegex} shape="circle">
          <PlusOutlined/>
          </Button>
        </Tooltip>
        <Table columns={columns} dataSource={dataSource} size="small">

        </Table>

        <Modal
          title="Add Regex"
          visible={isAdding}
          okText="Save"
          onCancel={() => {
            resetAdding();
          }}
          onOk={() => {
            setDataSource([...dataSource, addingRegex]);
            setAddingRegex((pre) =>{
                return {...pre, id: cur_id};
            })
            cur_id +=1;
            resetAdding();
          }}
        >
          Add Identifier
          <Input
            value={addingRegex?.identifier}
            onChange={(e) => {
              setAddingRegex((pre) => {
                return { ...pre, identifier: e.target.value };
              });
            }}
          />
          Add Regex
          <Input
            value={addingRegex?.regex}
            onChange={(e) => {
              setAddingRegex((pre) => {
                return { ...pre, regex: e.target.value };
              });
            }}
          />
        </Modal>

        <Modal
          title="Edit Regex"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((regex) => {
                if (regex.id === editingRegex.id) {
                  return editingRegex;
                } else {
                  return regex;
                }
              });
            });
            resetEditing();
          }}
        >
          Edit Identifier{" "}
          <Input
            value={editingRegex?.identifier}
            onChange={(e) => {
              setEditingRegex((pre) => {
                return { ...pre, identifier: e.target.value };
              });
            }}
          />
          Edit Regex
          <Input
            value={editingRegex?.regex}
            onChange={(e) => {
              setEditingRegex((pre) => {
                return { ...pre, regex: e.target.value };
              });
            }}
          />
        </Modal>
    </div>
  );
}
