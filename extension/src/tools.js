import {saveAs} from 'file-saver'
import { parseRegex } from './parser';

//Save Data As Zip file
export const saveDataAsZip = (filename, dataObjToWrite) => {
    const zip = require('jszip')();
    zip.file("data.json",JSON.stringify(dataObjToWrite));
    zip.generateAsync({type:"blob"})
    .then(function (newblob) {
        saveAs(newblob, filename);
    });
}

//Save Data As JSON file
export const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    link.dispatchEvent(evt);
    link.remove();
  };

// Generate the Routes value based on input url
export const genRouterValue = (url) =>{
    var urlList = String(url).split("/");
      for (var i = 0; i < urlList.length; i++) {
        urlList[i] = parseRegex(urlList[i]);
      }
      //The last part of urlList, used for parameter processing
      const urlName = urlList[urlList.length - 1];
      const urlSplit = urlName.split("?");
      var routerValue = "";
      // If there is parameter
      if (urlSplit.length > 1) {
        routerValue = String(urlName.split("?")[0]) + "*";
      }
      // If there is no parameter
      else {
        routerValue = urlName;
      }
      // Special case for OAuth Apps
      const urlPrefix = urlName.split("?")[0];
        if (urlPrefix === "oauth-apps") {
          const params = urlName.split("?")[1];
          const pageInfo = params.split("&")[1];
          routerValue += String(pageInfo);
        }
  
      return routerValue;
  }

// Determine whether an object is JSON or not, return the boolean value
export const isJson = (data) => {
    try {
      const testIfJson = JSON.parse(data);
      if (typeof testIfJson === "object") {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

//Determine the host
export const isLocalHost = (url) =>{
  let url_1 = url.split(":")[1];
  console.log(url);
  return url_1.split("/")[2] == "localhost";
}