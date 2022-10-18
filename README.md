# api-data-collector

## Overview
API Data Captor for Mock Servers is a Chrome DevTools Extension powered by React and Ant Design that can capture HTTP Requests and save/edit its Response Payloads in JSON for updating local mock server database. It also can allow users to record the selected Requests/Responses details and save them as JSON or ZIP files. According to different input "project" and "session" field, the JSON object will be stored locally and can be retrieved. Also, it will generate custom routes.json file automatically.

## Try it out
API Data Captor uses npm to manage and install packages. It is strongly recommended to install Node.js >16 and npm.

### Prerequisites

* Git
* Node.js version 16 and up
* npm

### Installation
1. Clone the repo in your local system
```
git clone git@gitlab.eng.vmware.com:cpsbu/cloud-path/mock-server-generator.git
```

2. Enter the /extension folder in the repo, install the dependencies and build the application
```
npm install
 
npm run move
```
npm install
 
npm run move
```

3. Open Chrome with the extensions management address chrome://extensions

4. Click the "Load Unpacked" button and selected the Repo folder

### Build & Run

- Project/Session management: You can select/input the "Project" and "Session" field to save/load your JSON file according to the selected two fields locally.

- Start/Stop recording: You can click on the "Capture" switch to enable/disable the recording functionalities.

- Max Record Limitation: You can click on the "Record Limit" switch to enable/disable the max number limitation for the records. The default value is 50. You can input and select the number you want in the selector near the switch.

- Clear: You can click the "Clear" button to clear all the captured information data in the current session.

- Setting: You can select the request type you want to capture.

- Save/Load locally: When you entered the "Project" and "Session" fields, you can click "Save To Local" or "Load From Local" button to store and retrieve the data stored in JSON object.

"Download JSON" or "Download ZIP" button. Also, you can download the selected data by clicking the "Download selected".

- Data Selection, Searching and Filtering: The captured data will be listed in the table below. You can click the "Response" button to preview the response payload. You can search the data according to the keywords in URL and select the data you want.

- Automated capture process for CPN mock server: As for OAuth Apps, the "oath-apps", "max-oath-apps" and "roles" fields are be automatically captured.

- Regular Expression for routes: Users can edit the regex lists by opening the regex modal. Specifically, each visited URL will be splitted by "/" and if one part matches regex list, it will be replaced by the corresponding identifier.

- Automated capture process for CPN mock server: As for OAuth Apps, the "oath-apps", "max-oath-apps" and "roles" fields are be automatically captured.

- Response editing: You can edit the response by clicking the response editing icon in the response preview page.

## Documentation

## Contributing

The api-data-collector project team welcomes contributions from the community. Before you start working with api-data-collector, please
read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be
signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on
as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).


## License
API Data Collector Copyright 2022 VMware, Inc.

The BSD-2 license (the "License") set forth below applies to all parts of the Attack Surface Framework project. You may not use this file except in compliance with the License.

BSD-2 License

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
