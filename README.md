# api-data-collector

## Overview
API Data Collector (ADC) is a Chrome DevTools Extension, which captures HTTP Requests and Responses, especially API response data. It provides:
* Capturing HTTP requests and responses, especially API response data, and saving or downloading it in JSON or ZIP formats for updating local Mock Server database
* Saving and then editing API response payloads for local testing and troubleshooting production issues.
* Storing and retrieving different user sessions for local development and debugging.

## Try it out
API Data Collector uses npm to manage and install packages. It is strongly recommended to install Node.js >16 and npm.

### Prerequisites
* Git
* Node.js version 16 and up
* npm

### Installation, Build & Run
1. Clone the repo in your local system
2. Install ajax.hook and file-saver at root level
```
npm install
```
3. Enter the /extension folder in the repo, install the dependencies and build the application
```
npm install
npm run move
```
4. Open Chrome with the extensions management address chrome://extensions
5. Click the "Load Unpacked" button and selected the Repo folder

## Documentation
Usage Guide and functionalities
* To use the extensions you need to open the Chrome DevTools first. Then, Select the "ADC" panel. Keep the DevTools opened when using this tool.

* Project/Session management: You can select/input the "Project" and "Session" field to save/load your JSON file according to the selected two fields locally.

* Start/Stop recording: You can click on the "Capture" switch to enable/disable the recording functionalities.

* Max Record Limitation: You can click on the "Record Limit" switch to enable/disable the max number limitation for the records. The default value is 50. You can input and select the number you want in the selector near the switch.

* Clear: You can click the "Clear" button to clear all the captured information data in the current session.

* Setting: You can select the request type you want to capture.

* Save/Load locally: When you entered the "Project" and "Session" fields, you can click "Save To Local" or "Load From Local" button to store and retrieve the data stored in JSON object.

* Download: You can choose to download the captured data in JSON or ZIP format by clicking "Download JSON" or "Download ZIP" button. Also, you can download the selected data by clicking the "Download selected".

* Data Selection, Searching and Filtering: The captured data will be listed in the table below. You can click the "Response" button to preview the response payload. You can search the data according to the keywords in URL and select the data you want.  

* Automated capture process for CPN mock server: As for OAuth Apps, the "oath-apps", "max-oath-apps" and "roles" fields are be automatically captured.


## Contributing
The api-data-collector project team welcomes contributions from the community. Before you start working with api-data-collector, please
read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be
signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on
as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License
The Desired State Configuration Resources for VMware is distributed under the BSD-2.
For more details, refer to the BSD-2 License File, https://github.com/vmware-labs/api-data-collector/blob/main/LICENSE
