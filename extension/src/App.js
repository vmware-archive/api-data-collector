/*global chrome*/
import './App.css';
import React, {
  useEffect,
  useState
} from 'react';
import {
  saveTemplateAsFile,
  saveDataAsZip,
  genRouterValue,
  isJson,
  isLocalHost
} from './tools';
import {
  Table,
  Checkbox,
  Modal,
  Button,
  Input,
  Select,
  Space,
  BackTop,
  PageHeader,
  Switch,
  notification,
  Tooltip,
} from 'antd';
import {
  ClearOutlined,
  SettingOutlined,
  DownloadOutlined,
  EditOutlined,
  CloudSyncOutlined,
  CheckOutlined,
  CloseOutlined,
  ControlOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons"
import { Selector } from './Selector';
import { parseRegex, RegexTable } from './parser';

// Style for back to top button
const backTopStyle = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

//Style for page Header
const PageHeaderStyle = {
  fontSize: 11,
  padding: 3,
  height: 30,
}


// json_data: stored the captured payload information
var json_data = {};
var modified_url_response = {}; // url: response
var url_type = {}; // url : type
var url_method = {}; // url :method

// For OAuth Apps
json_data['oauth-apps'] = [];
json_data['max-oauth-apps'] = {};
json_data.roles = {};

// Routes generation
var router = {};

// response_list: caputure all the response data
// url_list: capture all the url
// type_list: the resource type of request
// method_list: the method of request
//They share the same index
var response_list = {};
var url_list = {};
var type_list = {}; 
var method_list = {}; 

// For duplication removal
var request_set = new Set();
var oauth_apps_params = new Set();

export var max_limit = 100000;// Page Limit
const { Option } = Select;
const { TextArea } = Input;

//for setting button
const plainOptions = ['xhr', 'script', 'document'];

// id for captured data
var id = 0;

//test_data: for request preview info
var test_data = [];

//project and session management
export var getProjectSelectResult = "";
export var getSessionSelectResult = "";

//for table serach and selection
const CheckboxGroup = Checkbox.Group;
var tableSelection = {};

// Notification for "Store" and "Retrieve" button
const openNotification = (input) => {
  notification.open({
    message: 'Data ' + input + ' local Storage!',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

// Pack all info as one
const packInfo = () => {
  var allInfo = {};
  allInfo.json_data = json_data;
  allInfo.modified_url_response = modified_url_response;
  allInfo.url_type = url_type;
  allInfo.url_method = url_method;
  allInfo.router = router;
  allInfo.response_list = response_list;
  allInfo.url_list = url_list;
  allInfo.type_list = type_list;
  allInfo.method_list = method_list;
  allInfo.request_set = request_set;
  allInfo.oauth_apps_params = oauth_apps_params;
  allInfo.id = id;
  allInfo.test_data = test_data;
  return allInfo;
};

// Unpack all info
const unpackInfo = (allInfo) => {
  json_data = allInfo.json_data;
  modified_url_response = allInfo.modified_url_response;
  url_type = allInfo.url_type;
  url_method = allInfo.url_method;
  router = allInfo.router;
  response_list = allInfo.response_list;
  url_list = allInfo.url_list;
  type_list = allInfo.type_list;
  method_list = allInfo.method_list;
  request_set = allInfo.request_set;
  oauth_apps_params = allInfo.oauth_apps_params;
  id = allInfo.id;
  test_data = allInfo.test_data;
};

function sendMsg(msg){
  //msg: {greeting: "hello"}
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
      console.log(response);
    });
  });
}


function App() {
  const [curID, setCurID] = useState(1); //Pointer for the selected record
  const [pD, setpD] = useState([]); // table data
  const [checkedList, setCheckedList] = useState(['xhr', 'document']); // Options checked for the settings
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Seleted table rows
  const [capture, setCapture] = useState(true); // Flag for capture Status
  const [responsePreview, setResponsePreview] = useState(''); //Preview Content for the response
  const [searchValue, setSearchValue] = useState(''); // Search input value for the url
  const [downloadModalVisible, setDownloadModalVisible] = useState(false); // Visible flag for download modal
  const [downloadSelection, setDownloadSelection] = useState('JSON'); // Selection for download options
  const [downloadFileName, setDownloadFileName] = useState('data'); // Filename for download files
  const [regexModal, setRegexModal] = useState(false); // Visible flag for regex modal
  const [projScenModal, setProjScenModal] = useState(false); // Visible flag for project/scenario management modal
  const [responseEditModal, setResponseEditModal] = useState(false); //Visible flag for edit response modal
  const [editResponse, setEditResponse] = useState('');// Content for edit response
  const [responseModal, setResponseModal] = useState(false); // Visible flag for response modal
  const [settingsModal, setSettingsModal] = useState(false); // Visible flag for setting modal
  const [localDebug, setLocalDebug] = useState(true);// Localhost Debug Mappling
  // Filter the data according to the search boxes
  const FilterByUrlInput = (
    <Input
      placeholder="Search Url"
      value={searchValue}
      size="small"
      onChange={e => {
        const currValue = e.target.value;
        setSearchValue(currValue);
        const filteredData = test_data.filter(entry =>
          entry.url.includes(currValue) || tableSelection[entry.id] == true
        );
        setpD(filteredData);
      }}
    />
  );

  // onchange function for row selection
  const onSelectChange = (newSelectedRowKeys) => {
    Object.keys(tableSelection).forEach(v => tableSelection[v] = false);
    newSelectedRowKeys.map(key => { tableSelection[key] = true; })
    setSelectedRowKeys(newSelectedRowKeys);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    newSelectedRowKeys.forEach(key =>{
      let selected_url = url_list[key];
      if (selected_url in modified_url_response){
        console.log("Already in!");
      }
      else
      {
        console.log("Add modified response");
        modified_url_response[selected_url] = response_list[key];
        url_type[url_list[key]] = type_list[key];
        url_method[url_list[key]] = method_list[key];
      }
    });
  };

  // Row selection config
  const rowSelection = {
    columnWidth:40,
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Intercept the request before receiving the response
  function HandleRequestBefore(request){
    let url_address_raw = String(request.url); 
    let url_address = genRouterValue(url_address_raw);
    if (url_address in modified_url_response){
        if (isLocalHost(url_address_raw) && !localDebug ){
          console.log(isLocalHost(url_address_raw),localDebug);
          return;
        }

        console.log("Response already modified!");
        var data_entry = {};
        data_entry["method"] = url_method[url_address];
        data_entry["type"] = url_type[url_address];
        data_entry["url"] = request.url;
        data_entry["id"] = id;
        data_entry["key"] = id;
        test_data.push(data_entry);
    
        // For selection
        tableSelection[id] = false;
        //console.log("Push Data Entry: ", id, data_entry["key"], request.request.url);
        const copy = [...test_data];
        setpD(copy);
        //console.log(pD, test_data);
        id = id + 1;
        response_list[id - 1] = modified_url_response[url_address];
        url_list[id-1] = url_address;
        method_list[id-1] = url_method[url_address];
        type_list[id-1] = url_type[url_address];
        // Return Empty
        return {redirectUrl: 'javascript:void(0)'};
    }
  }

  // Processing the response data
  async function HandleRequestFinished(request) {
    if (!capture) {
      console.log("Capture Disabled!");
      return;
    };
    if (genRouterValue(String(request.request.url))  in modified_url_response){
      if (localDebug){
        console.log("Request cancelled!");
        return;
      }
    }
    if (!checkedList.includes(request._resourceType)) {
      return;
    }
    var url_address = String(request.request.url)
    if (request_set.has(url_address)){
      console.log("URL already visited!", request.request.url);
      return;
    }
    request_set.add(url_address);

    //Can be replaced by genRouterValue()
    var urlList = String(request.request.url).split("/");
    for (var i = 0; i < urlList.length; i++) {
      urlList[i] = parseRegex(urlList[i]);
    }
    const urlName = urlList[urlList.length - 1];
    //Router genearation
    const urlSplit = urlName.split("?");
    var routerValue = "";
    if (urlSplit.length > 1) {
      routerValue = String(urlName.split("?")[0]) + "*";
    } else {
      routerValue = urlName;
    }

    urlList[urlList.length - 1] = routerValue;
    var routerKey = "/" + urlList.slice(3).join('/');
    router[routerKey] = "/" + routerValue;

    var response_body = "";
    await request.getContent((body) => {
      if (isJson(body)) {
        response_body = JSON.parse(body);
      }
      else
        response_body = body;

      const urlPrefix = urlName.split("?")[0];
      if (urlPrefix === "oauth-apps") {
          if (json_data['oauth-apps'].length > max_limit) {
            console.log("OAuth apps records exceed the max limitation!");
            return;
          }
        const params = urlName.split("?")[1];
        const pageInfo = params.split("&")[1];
        urlList[urlList.length -1] += String(pageInfo);
        if (oauth_apps_params.has(pageInfo)) {
          console.log("Oauth apps page recorded already!");
          response_list[id - 1] = response_body;
          url_list[id - 1] = urlList[urlList.length -1];
          type_list[id -1] = request._resourceType;
          method_list[id-1] = request.request.method;
          return;
        }
        oauth_apps_params.add(pageInfo);
        const response_obj = JSON.parse(body);
        json_data['oauth-apps'].push(...response_obj.results);
        //json_data.oauth_apps.push(response_obj);
      } else if (urlPrefix === "max-oauth-apps") {
        const response_obj = JSON.parse(body);
        json_data['max-oauth-apps'] = response_obj;
      } else if (urlPrefix === 'roles') {
        console.log("Role's url: ", urlList);
        if (urlList[3] === 'csp') {
          const response_obj = JSON.parse(body);
          json_data.roles = response_obj;
        }
      }
      response_list[id - 1] = response_body;
      url_list[id - 1] = urlList[urlList.length -1];
      type_list[id -1] = request._resourceType;
      method_list[id-1] = request.request.method;
    });

    //Push data for table rendering
    var data_entry = {};
    data_entry["method"] = request.request.method;
    data_entry["type"] = request._resourceType;
    data_entry["url"] = request.request.url;
    data_entry["id"] = id;
    data_entry["key"] = id;
    test_data.push(data_entry);

    //for selection
    tableSelection[id] = false;
    //console.log("Push Data Entry: ", id, data_entry["key"], request.request.url);
    const copy = [...test_data];
    setpD(copy);
    //console.log(pD, test_data);
    id = id + 1;
    //console.log("Current response list: ",response_list);
  }

  //Listener to capture the network traffic
  useEffect(() => {
    chrome.webRequest.onBeforeRequest.addListener(HandleRequestBefore,
      { urls: ["<all_urls>"],
       types: ["main_frame", "sub_frame", "stylesheet", "script", "object", "xmlhttprequest", "other"]},
      );
    chrome.devtools.network.onRequestFinished.addListener(HandleRequestFinished);
    return () => { 
      chrome.webRequest.onBeforeRequest.removeListener(HandleRequestBefore,
        { urls: ["<all_urls>"],
         types: ["main_frame", "sub_frame", "stylesheet", "script", "object", "xmlhttprequest", "other"]},
      );
      chrome.devtools.network.onRequestFinished.removeListener(HandleRequestFinished); 
    }
  } , [capture, localDebug, pD, checkedList]);

  // onchange function for setting
  const onChange = (list) => {
    setCheckedList(list);
  };

  //onchange function for clear
  const handleClickClear = () => {
    json_data = {};
    json_data['oauth-apps'] = [];
    json_data['max-oauth-apps'] = {};
    json_data.roles = {};
    test_data = [];
    setpD(test_data);
    id = 0;
    response_list = {};
    url_list = {};
    type_list = {}; 
    method_list = {}; 
    modified_url_response = {};
    url_type = {};
    url_method = {};
    request_set.clear();
    oauth_apps_params.clear();

  };

  // columns for table
  const previewColumns = [
    /*{
      title: "Id",
      dataIndex: "id",
      key: "id",
    },*/
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width:30

    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 30,
    },
    {
      title: FilterByUrlInput,
      dataIndex: 'url',
      width: 350,
      key: "url"
    }
  ];

  // Download OK button
  const handleDownloadOk = () => {
    if (downloadSelection == 'JSON') {
      const fileName = downloadFileName + ".json";
      saveTemplateAsFile(fileName, json_data);
    } else if (downloadSelection == 'ZIP') {
      const fileName = downloadFileName + ".zip";
      saveDataAsZip(fileName, json_data);
    } else if (downloadSelection == 'Selected') {
      const fileName = downloadFileName + ".json";
      var selectedJSON = {};
      selectedRowKeys.map(i => {
        if (url_list[i].split("*")[0] == "oauth-apps"){
          if ("oauth-apps" in selectedJSON) {
            selectedJSON["oauth-apps"].push(response_list[i]);
          } else {
            selectedJSON["oauth-apps"] = [];
            selectedJSON["oauth-apps"].push(response_list[i]);
          }
        }else{
          if (url_list[i] in selectedJSON) {
            selectedJSON[url_list[i]].push(response_list[i]);
          } else {
            selectedJSON[url_list[i]] = [];
            selectedJSON[url_list[i]].push(response_list[i]);
          }
        }
      });
      saveTemplateAsFile(fileName, selectedJSON);
    } else if (downloadSelection == 'Routes') {
      const fileName = downloadFileName + ".json";
      saveTemplateAsFile(fileName, router)
    }
    setDownloadModalVisible(false);
  };

  //When Download Changed
  const handleDownloadChange = (value) => {
    setDownloadSelection(value);
    console.log(`selected ${value}`);
  };

  //Switch the capture status
  const handleCaptureClick = () => {
    setCapture(!capture);
  }

  //Save the JSON obj to local
  const saveToLocal = () => {
    openNotification("is store to");
    const projectSession = getProjectSelectResult + "_" + getSessionSelectResult;
    var obj = {};
    obj[projectSession] = packInfo();
    console.log(obj);
    chrome.storage.local.set(obj, function () {
      console.log('Value is set to ', projectSession);
    });
  }

  //Load the JSON obj according to project and session field
  const loadFromLocal = () => {
    openNotification("is retrieved from");
    const projectSession = getProjectSelectResult + "_" + getSessionSelectResult;
    chrome.storage.local.get([projectSession], function (result) {
      console.log('Value currently is ', Object.values(result));
      unpackInfo(Object.values(result)[0]);
      setpD(test_data);
    });
  }

  return (
    <div style={{}}>
      <PageHeader
        style={PageHeaderStyle}
        onBack={() => null}
        backIcon=<CloudSyncOutlined />
        className="site-page-header"
        title="API Data Collector"
        extra={[
          <Tooltip title={"Manage Projects/Scenarios"}>
            <Button
              key="5"
              type="default"
              shape="circle"
              icon={<ControlOutlined />}
              onClick={() => setProjScenModal(true)}>
            </Button>
          </Tooltip>,
          <Tooltip title={"Manage Regular Expressions"}>
            <Button
              key="4"
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => setRegexModal(true)}>
            </Button>
          </Tooltip>,
          <Tooltip title={"Clear API Data"}>
            <Button
              key="3"
              type="default"
              shape="circle"
              icon={<ClearOutlined />}
              onClick={handleClickClear}>
            </Button>
          </Tooltip>,
          <Tooltip title={"Download API Data"} placement="topRight">
          <Button key="1"
            type="default"
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModalVisible(true)}>
          </Button>
        </Tooltip>,
          <Tooltip title={"Set Capture Types"}>
            <Button
              key="2"
              type="default"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={() => setSettingsModal(true)}>
            </Button>
          </Tooltip>,

        ]}
      />

      <br></br>
      <Space style={{ height: 30, padding: 1 }}>
        Capture<Switch
          checkedChildren={"On"}
          unCheckedChildren={"Off"}
          checked={capture}
          onClick={handleCaptureClick}
        />
        Local Debug<Switch
          checkedChildren={"On"}
          unCheckedChildren={"Off"}
          checked={localDebug}
          onClick={() =>{setLocalDebug(!localDebug)}}
        />
        <Tooltip title={"The maximum number of OAuth Apps records that can captured"}>
          Max Record Limit: <QuestionCircleOutlined />
          </Tooltip><Selector selectorName="MaxLimit" preset="Unlimited" length={150} />
      </Space>
      <Space>
        <div>
          <Table
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  console.log("The request parsed URL: ",url_list[record.id], "ID: ", record.id);
                  if (url_list[record.id] in modified_url_response)
                    setResponsePreview(JSON.stringify(modified_url_response[url_list[record.id]]));
                  else
                    setResponsePreview(JSON.stringify(response_list[record.id]));
                  setResponseModal(true);
                  setCurID(record.id);
                }, // click row
                onDoubleClick: event => { }, // double click row
                onContextMenu: event => { }, // right button click row
                onMouseEnter: event => { }, // mouse enter row
                onMouseLeave: event => { }, // mouse leave row
              };
            }}
            size='small'
            style={{ width: 680, }}
            pagination={{ pageSize: 20, position: ['bottomLeft'] }}
            rowSelection={rowSelection}
            columns={previewColumns}
            dataSource={pD}
          />
        </div>
        <BackTop>
          <div
            style={backTopStyle}>
            UP
          </div>
        </BackTop>
      </Space>

      <Modal
        title={
        <Space>Download Data
          <Tooltip title={"JSON: Download OAuth Apps Data as JSON, ZIP:Download OAuth Apps Data as ZIP, Seleted: Download seleted records as JSON, Routes: Download the mapped routes JSON files"}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
        }
        visible={downloadModalVisible}
        onOk={handleDownloadOk}
        onCancel={() => setDownloadModalVisible(false)}>
        <Space direction="vertical" size="middle">
          <Space>
            Download Selection: <Select
              defaultValue="JSON"
              style={{
                width: 200,
              }}
              onChange={handleDownloadChange}
            >
              <Option value="JSON">
                JSON
              </Option>
              <Option value="ZIP">
                ZIP
              </Option>
              <Option value="Selected">
                Selected
              </Option>
              <Option value="Routes">
                Routes
              </Option>
            </Select>
          </Space>
          <Space>
            Download Filename:
            <Input
              placeholder="data"
              size="small"
              value={downloadFileName}
              style={{
                width: 200,
              }}
              onChange={e => {
                const currValue = e.target.value;
                setDownloadFileName(currValue);
              }}
            />
          </Space>
        </Space>
      </Modal>

      <Modal
        title={
        <Space>
          Response Body
          <EditOutlined
            onClick={() => setResponseEditModal(true)}
          />
        </Space>}
        centered
        visible={responseModal}
        onOk={() => setResponseModal(false)}
        onCancel={() => setResponseModal(false)}
        width={1000}
      >
        <p>{responsePreview}</p>
      </Modal>

      <Modal
        title={"Edit Response "}
        visible={responseEditModal}
        okText={"Save"}
        onOk={() => {
          setResponsePreview(editResponse);
          setResponseEditModal(false);
          response_list[curID] = editResponse;
          const url_add = url_list[curID];
          modified_url_response[url_list[curID]] = editResponse;
          url_type[url_list[curID]] = type_list[curID];
          url_method[url_list[curID]] = method_list[curID];
          let msg = {url:url_add,response:editResponse};
          //Message({...msg,to:'inject'});
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {...msg, to: 'content'});
          });
          console.log("Message sent!");
        }}
        onCancel={() => setResponseEditModal(false)}
      >
        <TextArea rows={15} 
        defaultValue = {JSON.stringify(response_list[curID])}
        onChange={(e) => {setEditResponse(e.target.value)}}/>
      </Modal>
      <Modal
        title="Project/Scenario Management"
        visible={projScenModal}
        onOk={() => setProjScenModal(false)}
        onCancel={() => setProjScenModal(false)}>
        <Space direction="vertical" size="middle">
          <Space>
            Project:<br></br><Selector selectorName="Project" preset="CPN" length={200} />
          </Space>
          <Space>
            Scenario: <Selector selectorName="Scenario" preset="Scenario 1" length={200}/>
          </Space>
          <Space>
            <Tooltip title={"Store the data into local storage"}>
              <Button
                type="default"
                id="saveToLocal"
                onClick={saveToLocal}>
                Store
              </Button>
            </Tooltip>
            <Tooltip title={"Retrieve the data from local storage"}>
              <Button
                type="default"
                id="loadFromLocal"
                onClick={loadFromLocal}>
                Retrieve
              </Button>
            </Tooltip>
          </Space>
        </Space>
      </Modal>

      <Modal
        title="Settings"
        visible={settingsModal}
        onOk={() =>setSettingsModal(false)}
        onCancel={()=>setSettingsModal(false)}>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange} />
      </Modal>

      <Modal
        title="Regex"
        visible={regexModal}
        onOk={() => setRegexModal(false)}
        onCancel={() => setRegexModal(false)}>
        <RegexTable />
      </Modal>

    </div>
  );
}

export default App;